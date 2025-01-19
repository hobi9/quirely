package com.quirely.backend.dto.board;

import jakarta.validation.constraints.NotBlank;

public record BoardTitleUpdateRequest(@NotBlank String title) {
}
