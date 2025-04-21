package com.quirely.backend.dto;

import com.quirely.backend.enums.ActivityAction;
import com.quirely.backend.enums.ActivityEntityType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityDto {
    private Long id;
    private ActivityAction action;
    private ActivityEntityType entityType;
    private UserDto user;
    private String entityTitle;
    private Long createdAt;
}