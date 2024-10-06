package com.quirely.backend.config.security.provider;

import com.quirely.backend.config.security.authentication.SessionAuthentication;
import com.quirely.backend.entity.User;
import com.quirely.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class SessionAuthProvider implements AuthenticationProvider {
    private final UserService userService;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        Long userId = ((SessionAuthentication) authentication).getUserId();

        Optional<User> user = userService.findUserById(userId);
        if (user.isPresent()) {
            authentication.setAuthenticated(true);
            ((SessionAuthentication) authentication).setUser(user.get());
        }
        return authentication;
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return SessionAuthentication.class.equals(authentication);
    }
}
