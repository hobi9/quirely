package com.quirely.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record WorkspaceCreationRequest(
        @NotBlank String name,
        String description
) {
}
