package com.quirely.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record MemberInvitationRequest (
        @NotBlank @Email String email
) {
}
