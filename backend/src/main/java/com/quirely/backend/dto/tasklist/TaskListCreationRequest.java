package com.quirely.backend.dto.tasklist;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TaskListCreationRequest(@NotBlank @Size(min = 1, max = 50) String title) {
}
