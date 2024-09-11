package com.quirely.backend.config.security;

import com.quirely.backend.config.security.filter.AuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, AuthenticationFilter authenticationFilter) throws Exception {
        http.authorizeHttpRequests(authorize -> authorize.anyRequest().permitAll());
        http.csrf(AbstractHttpConfigurer::disable);
        http.addFilterBefore(authenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public FilterRegistrationBean<AuthenticationFilter> tenantFilterRegistration(AuthenticationFilter authenticationFilter) {
        FilterRegistrationBean<AuthenticationFilter> registration = new FilterRegistrationBean<>(authenticationFilter);
        registration.setEnabled(false);
        return registration;
    }
}
