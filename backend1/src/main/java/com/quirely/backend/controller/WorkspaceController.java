package com.quirely.backend.controller;

import com.quirely.backend.dto.WorkspaceCreationDto;
import com.quirely.backend.dto.WorkspaceDto;
import com.quirely.backend.mapper.WorkspaceMapper;
import com.quirely.backend.model.User;
import com.quirely.backend.model.Workspace;
import com.quirely.backend.service.WorkspaceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/workspaces")
@Tag(name = "Workspaces", description = "Endpoints for managing workspaces.")
public class WorkspaceController {
    private final WorkspaceService workspaceService;
    private final WorkspaceMapper workspaceMapper;

    @PostMapping
    @Operation(summary = "Create a new workspace", description = "Creates a new workspace for the authenticated user.")
    public ResponseEntity<WorkspaceDto> createWorkspace(@RequestBody @Valid WorkspaceCreationDto workspaceDto, @AuthenticationPrincipal User user) {
        Workspace createdWorkspace = workspaceService.createWorkspace(workspaceMapper.toModel(workspaceDto), user.getId());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(workspaceMapper.toDto(createdWorkspace));

    }

    @GetMapping
    @Operation(summary = "Get user workspaces", description = "Retrieves all workspaces the authenticated user is a member of.")
    public ResponseEntity<List<WorkspaceDto>> getWorkspaces(@AuthenticationPrincipal User user) {
        List<WorkspaceDto> workspaces = workspaceService.getMemberWorkspaces(user.getId(), true)
                .stream()
                .map(workspaceMapper::toDto)
                .toList();

        return ResponseEntity.ok(workspaces);
    }

}
