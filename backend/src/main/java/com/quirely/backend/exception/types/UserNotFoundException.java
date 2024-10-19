package com.quirely.backend.exception.types;

import org.springframework.http.HttpStatus;

public class UserNotFoundException extends ApiException {
    public UserNotFoundException() {
        super("User not found", HttpStatus.CONFLICT);
    }
}
