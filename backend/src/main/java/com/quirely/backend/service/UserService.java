package com.quirely.backend.service;

import com.quirely.backend.dto.authentication.LoginRequest;
import com.quirely.backend.dto.authentication.RegistrationRequest;
import com.quirely.backend.dto.user.UpdateUserRequest;
import com.quirely.backend.entity.User;
import com.quirely.backend.enums.S3Prefix;
import com.quirely.backend.exception.types.*;
import com.quirely.backend.mapper.UserMapper;
import com.quirely.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final FileService fileService;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    public Optional<User> findUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> findUserByEmail(String email) {
        return userRepository.findByEmail(email.toLowerCase());
    }

    public void createUser(RegistrationRequest request) {
        Optional<User> userByEmail = this.findUserByEmail(request.email());

        if (userByEmail.isPresent()) {
            throw new NonUniqueUserException(request.email());
        }

        User entity = userMapper.toEntity(request);
        entity.setPassword(passwordEncoder.encode(request.password()));
        User user = userRepository.save(entity);

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
            throw new InvalidVerificationTokenException();
        }

        User user = this.findUserById(userId)
                .orElseThrow(UserNotFoundException::new);

        if (user.isVerified()) {
            throw new UserAlreadyVerifiedException();
        }
        user.setVerified(true);
        userRepository.save(user);
    }

    public void resendVerification(User user) {
        if (user.isVerified()) {
            throw new UserAlreadyVerifiedException();
        }

        try {
            emailService.sendRegistrationEmail(user.getEmail(), user.getId());
        } catch (Exception e) {
            log.error("Error while sending registration email", e);
        }
    }

    public String uploadAvatar(User user, MultipartFile file) throws IOException {
        String oldAvatarUrl = user.getAvatarUrl();

        String avatarUrl = fileService.uploadFile(file, S3Prefix.AVATAR_URL);
        user.setAvatarUrl(avatarUrl);
        userRepository.save(user);

        if (StringUtils.isNotBlank(oldAvatarUrl)) {
            fileService.deleteFile(oldAvatarUrl, S3Prefix.AVATAR_URL);
        }

        return avatarUrl;
    }

    public List<User> findUserByFilters(Long userId, Long workspaceId, String email) {
        return userRepository.findUsersByFilter(userId, workspaceId, email.toLowerCase());
    }

    public User updateUser(UpdateUserRequest request, User user) {
        user.setFullName(request.fullName().trim());

        String newEmail = request.email().toLowerCase();
        if (!newEmail.equals(user.getEmail())) {
            Optional<User> userByEmail = this.findUserByEmail(request.email());

            if (userByEmail.isPresent()) {
                throw new NonUniqueUserException(request.email());
            }

            user.setEmail(newEmail);
            user.setVerified(false);
            try {
                emailService.sendRegistrationEmail(request.email(), user.getId());
            } catch (Exception e) {
                log.error("Error while sending registration email", e);
            }
        }

        return userRepository.save(user);
    }
}
