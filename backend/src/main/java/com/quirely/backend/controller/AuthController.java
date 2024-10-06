package com.quirely.backend.controller;

import com.quirely.backend.constants.SessionConstants;
import com.quirely.backend.dto.authentication.CsrfDto;
import com.quirely.backend.dto.authentication.LoginRequest;
import com.quirely.backend.dto.authentication.RegistrationRequest;
import com.quirely.backend.dto.UserDto;
import com.quirely.backend.entity.User;
import com.quirely.backend.mapper.UserMapper;
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

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
@Tag(name = "User Authentication", description = "Endpoints for user registration, login, logout, and profile management.")
public class AuthController {
    private final UserService userService;
    private final UserMapper userMapper;

    @PostMapping("/register")
    @Operation(summary = "Create a New Account", description = "Registers a new user account by providing valid user details and email.")
    public ResponseEntity<Void> register(@RequestBody @Valid RegistrationRequest request) {
        userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/login")
    @Operation(summary = "User Login", description = "Authenticates a user using email and password, creating a session upon success.")
    public ResponseEntity<Void> login(@RequestBody @Valid LoginRequest request, HttpSession httpSession, @AuthenticationPrincipal User user) {
        if (user != null) {
            return ResponseEntity.noContent().build();
        }

        Long userId = userService.loginUser(request);
        httpSession.setAttribute(SessionConstants.SESSION_USER_ID_ATTRIBUTE, userId);

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
        return ResponseEntity.ok(userMapper.toDto(user));
    }

    @PutMapping("/verify/{verificationToken}")
    @Operation(summary = "Verify User Email", description = "Confirms a user's email address using a verification token.")
    public ResponseEntity<Void> verify(@PathVariable("verificationToken") @NotBlank String verificationToken) {
        userService.verifyUser(verificationToken);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/csrf-refresh")
    @Operation(summary = "Refresh CSRF Token", description = "Generates and returns a new CSRF token.")
    public ResponseEntity<CsrfDto> getCsrf(CsrfToken csrfToken) {
        var csrfDto = new CsrfDto(csrfToken.getToken());
        return ResponseEntity.ok(csrfDto);
    }


}
