package com.quirely.backend.exception.types;

import org.springframework.http.HttpStatus;

public class InvitationAlreadyConfirmedException extends ApiException {
    public InvitationAlreadyConfirmedException() {
        super("You have already confirmed the invitation to this workspace.", HttpStatus.CONFLICT);
    }
}
