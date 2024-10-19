package com.quirely.backend.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum S3Prefix {
    WORKSPACE_LOGO("workspaces/logos/"),
    AVATAR_URL("users/avatars/");

    private final String prefix;

}
