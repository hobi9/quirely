package com.quirely.backend.controller;

import jakarta.validation.constraints.*;

public record RegistrationInputDto(
        @NotBlank @Size(min = 2, max = 100) String fullName,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 8, max = 254) String password
) {

    @Override
    public String toString() {
        return "RegistrationDto{" +
                "fullName='" + fullName + '\'' +
                ", email='" + email + '\'' +
                ", password='" + "CLASSIFIED" + '\'' +
                '}';
    }
}
