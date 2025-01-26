package com.quirely.backend.exception.types;

import org.springframework.http.HttpStatus;

public class ListNotFoundException extends ApiException {
    public ListNotFoundException() {
        super("List not found", HttpStatus.NOT_FOUND);
    }
}
