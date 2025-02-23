package com.quirely.backend.dto.task;

import jakarta.validation.constraints.*;

public record TaskUpdateRequest(@NotBlank @Size(min = 1, max = 60) String title, String description, @PositiveOrZero int order, @NotNull Long taskListId) {
}
