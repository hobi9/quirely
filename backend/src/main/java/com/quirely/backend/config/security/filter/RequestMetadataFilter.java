package com.quirely.backend.config.security.filter;

import com.quirely.backend.constants.MDCKeys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.MDC;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

public class RequestMetadataFilter extends OncePerRequestFilter {
    private static final String REQUEST_ID_HEADER = "x-request-id";


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String requestId = StringUtils.trimToNull(request.getHeader(REQUEST_ID_HEADER));
        if (requestId == null) {
            requestId = UUID.randomUUID().toString();
        }
        MDC.put(MDCKeys.REQUEST_ID, requestId);
        HttpSession session = request.getSession(false);
        if (session != null) {
            MDC.put(MDCKeys.SESSION_ID, session.getId());
        }


        try {
            filterChain.doFilter(request, response);
        } finally {
            MDC.remove(MDCKeys.REQUEST_ID);
            MDC.remove(MDCKeys.SESSION_ID);
        }
    }
}
