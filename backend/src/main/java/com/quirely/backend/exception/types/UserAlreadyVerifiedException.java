package com.quirely.backend.exception.types;

import org.springframework.http.HttpStatus;

public class UserAlreadyVerifiedException extends ApiException {
    public UserAlreadyVerifiedException() {
        super("User is already verified", HttpStatus.CONFLICT);
    }
}