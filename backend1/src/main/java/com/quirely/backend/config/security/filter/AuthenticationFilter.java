package com.quirely.backend.config.security.filter;

import com.quirely.backend.config.security.authentication.SessionAuthentication;
import com.quirely.backend.constants.SessionConstants;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class AuthenticationFilter extends OncePerRequestFilter {
    private final AuthenticationManager authenticationManager;

    @Override
    protected void doFilterInternal(HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        Long userId = (Long) request.getSession().getAttribute(SessionConstants.SESSION_USER_ID_ATTRIBUTE);

        if (userId != null) {
            var sessionAuthentication = new SessionAuthentication(userId);

            var authentication = authenticationManager.authenticate(sessionAuthentication);

            if (authentication.isAuthenticated()) {
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }
}
