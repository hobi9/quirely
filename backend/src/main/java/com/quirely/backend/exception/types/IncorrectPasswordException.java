package com.quirely.backend.exception.types;

import org.springframework.http.HttpStatus;

import java.util.Map;

public class IncorrectPasswordException extends ApiException {
    private static final String MESSAGE = "Incorrect password";

    public IncorrectPasswordException() {
        super(MESSAGE, HttpStatus.CONFLICT, Map.of("password", MESSAGE));
    }
}
