package com.quirely.backend.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;

public record UpdateUserRequest(@NotEmpty String fullName, @Email String email) {
}
