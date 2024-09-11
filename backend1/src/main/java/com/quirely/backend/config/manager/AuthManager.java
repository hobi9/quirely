package com.quirely.backend.config.manager;

import com.quirely.backend.config.security.provider.SessionAuthProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuthManager implements AuthenticationManager {
    private final SessionAuthProvider sessionAuthProvider;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        if (sessionAuthProvider.supports(authentication.getClass())) {
            return sessionAuthProvider.authenticate(authentication);
        }

        throw new BadCredentialsException("Oh no"); //TODO: fix
    }
}
