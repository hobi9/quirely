package com.quirely.backend.config.security.filter;

import com.quirely.backend.constants.SessionConstants;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class SessionCookieRefreshFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        filterChain.doFilter(request, response);

        Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals(SessionConstants.SESSION_COOKIE_NAME)) {
                    cookie.setMaxAge(SessionConstants.SESSION_MAX_AGE);
                    cookie.setPath(SessionConstants.SESSION_COOKIE_PATH);
                    cookie.setHttpOnly(true);
                    response.addCookie(cookie);
                    break;
                }
            }
        }
    }
}
