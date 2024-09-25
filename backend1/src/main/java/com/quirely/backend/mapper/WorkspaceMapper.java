package com.quirely.backend.mapper;

import com.quirely.backend.dto.WorkspaceCreationDto;
import com.quirely.backend.dto.WorkspaceDto;
import com.quirely.backend.entity.User;
import com.quirely.backend.entity.Workspace;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

@Component
public class WorkspaceMapper {

    public Workspace toEntity(WorkspaceCreationDto dto, User owner) {
        return Workspace.builder()
                .name(StringUtils.trim(dto.name()))
                .description(StringUtils.trimToNull(dto.description()))
                .owner(owner)
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

