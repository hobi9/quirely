package com.quirely.backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class WorkspaceDetailDto extends WorkspaceDto {
    private UserDto owner;

    @Builder(builderMethodName = "detailBuilder")
    public WorkspaceDetailDto(Long id, String name, String description, String logoUrl, UserDto owner) {
        super(id, name, description, logoUrl);
        this.owner = owner;
    }
}
