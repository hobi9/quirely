package com.quirely.backend.exception.types;

import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.util.Map;

@Getter
public class ApiException extends RuntimeException {
    private final HttpStatus httpStatus;
    //field-error
    private Map<String, String> errors;

    public ApiException(final String message, final HttpStatus httpStatus) {
        super(message);
        this.httpStatus = httpStatus;
    }

    public ApiException(final String message, final HttpStatus httpStatus, Map<String, String> errors) {
        super(message);
        this.httpStatus = httpStatus;
        this.errors = errors;
    }

}
