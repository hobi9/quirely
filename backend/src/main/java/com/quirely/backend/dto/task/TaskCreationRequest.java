package com.quirely.backend.dto.task;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TaskCreationRequest(@NotBlank @Size(min = 1, max = 60) String title, String description) {
}
