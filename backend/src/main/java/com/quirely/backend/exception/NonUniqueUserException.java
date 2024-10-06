package com.quirely.backend.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class NonUniqueUserException extends RuntimeException {
    private final String email;
}
