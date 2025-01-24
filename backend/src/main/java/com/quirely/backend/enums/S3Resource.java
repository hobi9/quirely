package com.quirely.backend.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum S3Resource {
    WORKSPACE_LOGO("workspaces/logos/"),
    AVATAR("users/avatars/");

    private final String prefix;

}
