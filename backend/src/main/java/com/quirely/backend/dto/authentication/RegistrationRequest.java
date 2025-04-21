package com.quirely.backend.dto.authentication;

import jakarta.validation.constraints.*;

public record RegistrationRequest(
        @NotBlank @Size(min = 2, max = 100) String fullName,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 8, max = 254) String password
) {

    @Override
    public String toString() {
        return "RegistrationRequest{" +
                "fullName='" + fullName + '\'' +
                ", email='" + email + '\'' +
                ", password='" + "[REDACTED]" + '\'' +
                '}';
    }
}
