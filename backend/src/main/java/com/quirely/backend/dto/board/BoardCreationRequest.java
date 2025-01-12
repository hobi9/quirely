package com.quirely.backend.dto.board;

import jakarta.validation.constraints.NotBlank;
import org.hibernate.validator.constraints.URL;

public record BoardCreationRequest(@NotBlank String title, @NotBlank @URL String thumbnailUrl, @NotBlank @URL String fullUrl) {
}
