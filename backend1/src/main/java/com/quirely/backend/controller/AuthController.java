package com.quirely.backend.controller;

import com.quirely.backend.controller.exception.NonUniqueUserException;
import com.quirely.backend.controller.exception.UserNotFoundException;
import com.quirely.backend.mapper.UserMapper;
import com.quirely.backend.service.EmailService;
import com.quirely.backend.service.User;
import com.quirely.backend.service.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;
    private final UserMapper userMapper;
    private final EmailService emailService;

    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody @Valid RegistrationInputDto request) {
        User user = userMapper.toModel(request);
        Optional<User> userByEmail = userService.findUserByEmail(user.getEmail());

        if (userByEmail.isPresent()) {
            throw new NonUniqueUserException(user.getEmail());
        }

        User createdUser = userService.createUser(user);

        try {
            emailService.sendRegistrationEmail(createdUser.getEmail(), createdUser.getId());
        } catch (Exception e) {
            log.error("Error while sending registration email", e);
        }

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<Void> login(@RequestBody @Valid LoginInputDto request, HttpSession httpSession) {
        Optional<User> userByEmail = userService.findUserByEmail(request.email());

        if (userByEmail.isEmpty()) {
            throw new UserNotFoundException("User not found");
        }

        boolean passwordIsCorrect = userService.comparePassword(userByEmail.get(), request.password());
        if (!passwordIsCorrect) {
            throw new RuntimeException("Incorrect password"); //TODO: change
        }

        httpSession.setAttribute("userId", userByEmail.get().getId());

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/signout")
    public ResponseEntity<Void> logout(HttpSession httpSession) {
        httpSession.invalidate();

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getMe(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.noContent().build();
        }

        UserDto userDto = userMapper.toDto(user);

        return ResponseEntity.ok(userDto);
    }


}
