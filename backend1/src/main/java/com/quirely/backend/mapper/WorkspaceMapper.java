package com.quirely.backend.mapper;

import com.quirely.backend.dto.WorkspaceCreationDto;
import com.quirely.backend.dto.WorkspaceDto;
import com.quirely.backend.entity.UserEntity;
import com.quirely.backend.entity.WorkspaceEntity;
import com.quirely.backend.model.Workspace;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

@Component
public class WorkspaceMapper {

    public Workspace toModel(WorkspaceCreationDto dto) {
        return Workspace.builder()
                .name(StringUtils.trim(dto.name()))
                .description(StringUtils.trimToNull(dto.description()))
                .build();
    }

    public WorkspaceEntity toEntity(Workspace dto, UserEntity owner) {
        return WorkspaceEntity.builder()
                .id(dto.getId())
                .name(dto.getName())
                .description(dto.getDescription())
                .owner(owner)
                .logoUrl(dto.getLogoUrl())
                .build();
    }

    public Workspace toModel(WorkspaceEntity workspaceEntity) {
        return Workspace.builder()
                .id(workspaceEntity.getId())
                .name(workspaceEntity.getName())
                .description(workspaceEntity.getDescription())
                .logoUrl(workspaceEntity.getLogoUrl())
                .build();
    }

    public WorkspaceDto toDto(Workspace workspace) {
        return WorkspaceDto.builder()
                .id(workspace.getId())
                .name(workspace.getName())
                .description(workspace.getDescription())
                .logoUrl(workspace.getLogoUrl())
                .build();
    }
}

