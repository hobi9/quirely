package com.quirely.backend.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum Roles {
    VERIFIED("VERIFIED");

    private final String value;
}
