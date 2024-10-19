package com.quirely.backend.exception.types;

import org.springframework.http.HttpStatus;

public class SelfActionNotAllowedException extends ApiException {
    public SelfActionNotAllowedException(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}
