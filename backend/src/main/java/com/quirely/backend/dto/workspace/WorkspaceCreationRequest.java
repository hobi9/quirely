package com.quirely.backend.dto.workspace;

import jakarta.validation.constraints.NotBlank;

public record WorkspaceCreationRequest(
        @NotBlank String name,
        String description
) {
}
