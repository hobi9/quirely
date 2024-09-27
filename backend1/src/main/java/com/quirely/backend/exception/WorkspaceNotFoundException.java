package com.quirely.backend.exception;

public class WorkspaceNotFoundException extends RuntimeException {
    public WorkspaceNotFoundException() {
        super("Workspace not found");
    }
}
