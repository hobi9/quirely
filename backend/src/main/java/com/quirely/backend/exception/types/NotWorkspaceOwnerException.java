package com.quirely.backend.exception.types;

import org.springframework.http.HttpStatus;

public class NotWorkspaceOwnerException extends ApiException {
    public NotWorkspaceOwnerException() {
        super("You are not the owner of this workspace", HttpStatus.FORBIDDEN);
    }
}
