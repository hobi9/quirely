package com.quirely.backend.dto.workspace;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record MemberInvitationRequest (
        @Email String email
) {
}
