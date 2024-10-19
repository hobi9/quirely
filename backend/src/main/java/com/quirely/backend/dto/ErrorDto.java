package com.quirely.backend.dto;

import java.util.Map;

public record ErrorDto(
        String message,
        //key,message
        Map<String, String> fields
) {
    public ErrorDto(String message, Map<String, String> fields) {
        this.message = message;
        this.fields = fields;
    }

    public ErrorDto(String message) {
        this(message, null);
    }

}
