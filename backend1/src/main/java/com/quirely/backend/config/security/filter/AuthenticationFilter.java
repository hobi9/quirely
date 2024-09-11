package com.quirely.backend.config.security.filter;

import com.quirely.backend.config.manager.AuthManager;
import com.quirely.backend.config.SessionAuthentication;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class AuthenticationFilter extends OncePerRequestFilter {
    private final AuthManager authManager;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        Long userId = (Long) request.getSession().getAttribute("userId");

        if (userId !=  null) {
            SessionAuthentication sessionAuthentication = new SessionAuthentication(userId);

            var authentication = authManager.authenticate(sessionAuthentication);

            if (authentication.isAuthenticated()) {
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request,response);
    }
}
