package com.quirely.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.experimental.SuperBuilder;

@SuperBuilder
public class FullUserDto extends UserDto {
    @JsonProperty("isVerified")
    private boolean verified;
}
