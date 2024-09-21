package com.quirely.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginInputDto(
        @NotBlank @Email String email,
        @NotBlank @Size(min = 8, max = 254) String password
) {
    @Override
    public String toString() {
        return "LoginDto{" +
                "email='" + email + '\'' +
                ", password='" + "CLASSIFIED" + '\'' +
                '}';
    }
}
