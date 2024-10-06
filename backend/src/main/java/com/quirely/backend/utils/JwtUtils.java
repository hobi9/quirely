package com.quirely.backend.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.experimental.UtilityClass;
import lombok.extern.slf4j.Slf4j;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Slf4j
@UtilityClass
public class JwtUtils {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    private static SecretKey createKey(String secret) {
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

    public static <T> T parseJwt(String jwt, String secret, Class<T> payloadClass) {
        try {
            String subject = Jwts.parser()
                    .verifyWith(createKey(secret))
                    .build()
                    .parseSignedClaims(jwt).getPayload().getSubject();

            return objectMapper.readValue(subject,payloadClass);
        } catch (Exception e) {
            log.error("Error while parsing JWT", e);
            return null;
        }

    }
}
