package com.quirely.backend.exception.types;

import org.springframework.http.HttpStatus;

import java.util.Map;

public class NonUniqueUserException extends ApiException {
    private static final String MESSAGE = "User with given email already exists";

    public NonUniqueUserException(String email) {
        super(MESSAGE, HttpStatus.CONFLICT, Map.of("email", MESSAGE));
    }
}
