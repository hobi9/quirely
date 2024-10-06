package com.quirely.backend.dto.workspace;

import com.quirely.backend.dto.UserDto;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class WorkspaceDetailDto extends WorkspaceDto {
    private UserDto owner;
}
