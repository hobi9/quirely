package com.quirely.backend.controller.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class NonUniqueUserException extends RuntimeException {
    private final String email;
}
