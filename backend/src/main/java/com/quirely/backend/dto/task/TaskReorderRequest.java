package com.quirely.backend.dto.task;

import jakarta.validation.constraints.*;

public record TaskReorderRequest(@PositiveOrZero int order, @NotNull Long taskListId) {
}
