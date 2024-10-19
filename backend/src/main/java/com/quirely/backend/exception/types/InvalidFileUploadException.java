package com.quirely.backend.exception.types;

import org.springframework.http.HttpStatus;

public class InvalidFileUploadException extends ApiException {
    public InvalidFileUploadException(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}
