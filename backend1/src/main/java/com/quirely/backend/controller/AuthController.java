package com.quirely.backend.controller;

import com.quirely.backend.controller.exception.NonUniqueUserException;
import com.quirely.backend.controller.exception.UserNotFoundException;
import com.quirely.backend.mapper.UserMapper;
import com.quirely.backend.service.EmailService;
import com.quirely.backend.service.User;
import com.quirely.backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;


import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
@Tag(name = "User Authentication", description = "Endpoints for user registration, login, logout, and profile management.")
public class AuthController {
    private final UserService userService;
    private final UserMapper userMapper;
    private final EmailService emailService;

    @PostMapping("/register")
    @Operation(summary = "Create a New Account", description = "Registers a new user account by providing valid user details and email.")
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

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/login")
    @Operation(summary = "User Login", description = "Authenticates a user using email and password, creating a session upon success.")
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
    @Operation(summary = "User Logout", description = "Logs out the currently authenticated user and invalidates their session.")
    public ResponseEntity<Void> logout(HttpSession httpSession) {
        httpSession.invalidate();

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    @Operation(summary = "Get Current User Profile", description = "Retrieves the profile details of the currently authenticated user.")
    public ResponseEntity<UserDto> getMe(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.noContent().build();
        }

        UserDto userDto = userMapper.toDto(user);

        return ResponseEntity.ok(userDto);
    }

    @PutMapping("/verify/{verificationToken}")
    @Operation(summary = "Verify User Email", description = "Confirms a user's email address using a verification token.")
    public ResponseEntity<Void> verify(@PathVariable("verificationToken") @NotBlank String verificationToken) {
        Long userId = emailService.getUserIdFromVerificationToken(verificationToken);

        if (userId == null) {
            throw new RuntimeException("Incorrect verification token"); //TODO: 400 status exception
        }

        userService.verifyUser(userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/csrf-refresh")
    @Operation(summary = "Refresh CSRF Token", description = "Generates and returns a new CSRF token.")
    public ResponseEntity<CsrfDto> getCsrf(CsrfToken csrfToken) {
        var csrfDto = new CsrfDto(csrfToken.getToken());
        return ResponseEntity.ok(csrfDto);
    }


}
