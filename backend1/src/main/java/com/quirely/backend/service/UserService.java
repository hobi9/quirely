package com.quirely.backend.service;

import com.quirely.backend.dto.LoginRequest;
import com.quirely.backend.dto.RegistrationRequest;
import com.quirely.backend.entity.User;
import com.quirely.backend.exception.IncorrectPasswordException;
import com.quirely.backend.exception.NonUniqueUserException;
import com.quirely.backend.exception.UserNotFoundException;
import com.quirely.backend.mapper.UserMapper;
import com.quirely.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public Optional<User> findUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public void createUser(RegistrationRequest request) {
        Optional<User> userByEmail = this.findUserByEmail(request.email());

        if (userByEmail.isPresent()) {
            throw new NonUniqueUserException(request.email());
        }

        User user = userRepository.save(userMapper.toEntity(request));

        try {
            emailService.sendRegistrationEmail(user.getEmail(), user.getId());
        } catch (Exception e) {
            log.error("Error while sending registration email", e);
        }
    }

    public Long loginUser(LoginRequest request) {
        Optional<User> userByEmail = userRepository.findByEmail(request.email());
        if (userByEmail.isEmpty()) {
            throw new UserNotFoundException();
        }

        boolean matches = passwordEncoder.matches(request.password(), userByEmail.get().getPassword());
        if (!matches) {
            throw new IncorrectPasswordException();
        }

        return userByEmail.get().getId();
    }

    public void verifyUser(String token) {
        Long userId = emailService.getUserIdFromVerificationToken(token);
        if (userId == null) {
            throw new RuntimeException("Incorrect verification token"); //TODO: 400 status exception
        }

        User user = this.findUserById(userId)
                .orElseThrow(UserNotFoundException::new);

        if (user.isVerified()) {
            throw new RuntimeException(String.format("User with id %d already verified", user.getId())); //TODO: conflict exception
        }
        user.setVerified(true);
        userRepository.save(user);
    }
}
