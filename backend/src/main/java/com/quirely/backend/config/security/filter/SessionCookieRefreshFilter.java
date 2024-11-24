package com.quirely.backend.config.security.filter;

import com.quirely.backend.constants.SessionConstants;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;

public class SessionCookieRefreshFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        filterChain.doFilter(request, response);

        if (request.getCookies() != null) {
            Arrays.stream(request.getCookies())
                    .filter(cookie -> SessionConstants.SESSION_COOKIE_NAME.equals(cookie.getName()))
                    .findFirst()
                    .ifPresent(cookie -> this.updateCookie(response, cookie));
        }
    }

    private void updateCookie(HttpServletResponse response, Cookie existingCookie) {
        var newCookie = new Cookie(existingCookie.getName(), existingCookie.getValue());
        newCookie.setMaxAge(SessionConstants.SESSION_MAX_AGE);
        newCookie.setPath(SessionConstants.SESSION_COOKIE_PATH);
        newCookie.setHttpOnly(true);
        newCookie.setSecure(true);
        newCookie.setAttribute("SameSite", org.springframework.boot.web.server.Cookie.SameSite.LAX.attributeValue());
        response.addCookie(newCookie);
    }

}
