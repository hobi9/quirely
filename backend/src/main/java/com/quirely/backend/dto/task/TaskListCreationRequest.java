package com.quirely.backend.dto.task;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TaskListCreationRequest(@NotBlank @Size(min = 2, max = 50) String title) {
}
