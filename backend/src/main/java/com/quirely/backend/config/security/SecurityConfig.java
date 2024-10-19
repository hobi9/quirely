package com.quirely.backend.config.security;

import com.quirely.backend.config.security.filter.AuthenticationFilter;
import com.quirely.backend.config.security.filter.SessionCookieRefreshFilter;
import com.quirely.backend.config.security.provider.SessionAuthProvider;
import com.quirely.backend.constants.SessionConstants;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.session.DisableEncodeUrlFilter;
import org.springframework.session.web.http.CookieSerializer;
import org.springframework.session.web.http.DefaultCookieSerializer;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    @Value("${client.base-url}")
    private String clientBaseUrl;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, AuthenticationFilter authenticationFilter) throws Exception {
        http.addFilterBefore(new SessionCookieRefreshFilter(), DisableEncodeUrlFilter.class);
        http.addFilterBefore(authenticationFilter, UsernamePasswordAuthenticationFilter.class);

        http.cors(Customizer.withDefaults());
        http.csrf(csrf -> csrf
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                .ignoringRequestMatchers(
                        "/api/v1/auth/register",
                        "/api/v1/auth/login",
                        "/api/v1/auth/verify/*"
                )
        );

        http.authorizeHttpRequests(authorize -> authorize
                .requestMatchers(
                        "/api/v1/auth/register",
                        "/api/v1/auth/login",
                        "/api/v1/auth/me",
                        "/api/v1/auth/verify/*",
                        "/v3/api-docs/**",
                        "/swagger-ui/**",
                        "/swagger-ui.html"
                )
                .permitAll()
                .anyRequest().authenticated()
        );

        return http.build();
    }

    @Bean
    public AuthenticationManager authManager(HttpSecurity http, SessionAuthProvider sessionAuthProvider) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder =
                http.getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder.authenticationProvider(sessionAuthProvider);
        return authenticationManagerBuilder.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public FilterRegistrationBean<AuthenticationFilter> authenticationFilterRegistration(AuthenticationFilter authenticationFilter) {
        var registration = new FilterRegistrationBean<>(authenticationFilter);
        registration.setEnabled(false);
        return registration;
    }

    @Bean
    public CookieSerializer cookieSerializer() {
        var cookieSerializer = new DefaultCookieSerializer();
        //cookieSerializer.setUseSecureCookie(true); //TODO: add support for it later
        cookieSerializer.setCookieName(SessionConstants.SESSION_COOKIE_NAME);
        cookieSerializer.setCookieMaxAge(SessionConstants.SESSION_MAX_AGE);
        cookieSerializer.setCookiePath(SessionConstants.SESSION_COOKIE_PATH);
        cookieSerializer.setUseHttpOnlyCookie(true);
        return cookieSerializer;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        var corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowedOrigins(List.of((clientBaseUrl)));
        corsConfiguration.setAllowCredentials(true);
        corsConfiguration.setAllowedMethods(List.of("*"));
        corsConfiguration.setAllowedHeaders(List.of("*"));
        var urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
        urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", corsConfiguration);
        return urlBasedCorsConfigurationSource;
    }
}
