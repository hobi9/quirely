package com.quirely.backend.exception.types;

import org.springframework.http.HttpStatus;

public class BoardNotFoundException extends ApiException {
    public BoardNotFoundException() {
        super("Board not found", HttpStatus.NOT_FOUND);
    }
}
