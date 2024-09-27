package com.quirely.backend.mapper;

import com.quirely.backend.dto.WorkspaceCreationRequest;
import com.quirely.backend.dto.WorkspaceDetailDto;
import com.quirely.backend.dto.WorkspaceDto;
import com.quirely.backend.entity.User;
import com.quirely.backend.entity.Workspace;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class WorkspaceMapper {
    private final UserMapper userMapper;

    public Workspace toEntity(WorkspaceCreationRequest dto, User owner) {
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

    public WorkspaceDetailDto toDetailDto(Workspace workspace) {
        return WorkspaceDetailDto.detailBuilder()
                .id(workspace.getId())
                .name(workspace.getName())
                .description(workspace.getDescription())
                .logoUrl(workspace.getLogoUrl())
                .owner(userMapper.toDto(workspace.getOwner()))
                .build();
    }
}

