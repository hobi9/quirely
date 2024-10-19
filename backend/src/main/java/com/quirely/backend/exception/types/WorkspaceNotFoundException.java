package com.quirely.backend.exception.types;

import org.springframework.http.HttpStatus;

public class WorkspaceNotFoundException extends ApiException {
    public WorkspaceNotFoundException() {
        super("Workspace not found", HttpStatus.NOT_FOUND);
    }
}
