package com.quirely.backend.exception.types;

import org.springframework.http.HttpStatus;

public class InvalidVerificationTokenException extends ApiException {
    public InvalidVerificationTokenException() {
        super("Incorrect verification token", HttpStatus.NOT_FOUND);
    }
}
