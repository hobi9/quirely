package com.quirely.backend.exception.types;

import org.springframework.http.HttpStatus;

public class TaskNotFoundException extends ApiException {

    public TaskNotFoundException() {
        super("Task not found", HttpStatus.NOT_FOUND);
    }
}
