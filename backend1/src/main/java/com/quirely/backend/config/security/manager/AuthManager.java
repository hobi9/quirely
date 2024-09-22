package com.quirely.backend.config.security.manager;

import com.quirely.backend.config.security.provider.SessionAuthProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderNotFoundException;
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

        throw new ProviderNotFoundException("Unsupported Authentication");
    }
}
