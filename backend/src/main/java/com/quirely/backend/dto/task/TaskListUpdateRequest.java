package com.quirely.backend.dto.task;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record TaskListUpdateRequest(@NotBlank @Size(min = 2, max = 50) String title, @PositiveOrZero int order) {
}
