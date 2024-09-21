package com.quirely.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record WorkspaceCreationDto(
        @NotBlank String name,
        String description
) {
}
