package com.quirely.backend.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.experimental.UtilityClass;
import lombok.extern.slf4j.Slf4j;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Slf4j
@UtilityClass
public class JwtUtils {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    private static Key createKey(String secret) {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public static String createJwt(Object payload, String secret, long expiresIn) {
        try {
            return Jwts.builder()
                    .subject(objectMapper.writeValueAsString(payload))
                    .expiration(new Date(System.currentTimeMillis() + expiresIn))
                    .signWith(createKey(secret))
                    .compact();
        } catch (JsonProcessingException e) {
            log.error("Error while creating JWT", e);
            throw new RuntimeException(e);
        }
    }
}
