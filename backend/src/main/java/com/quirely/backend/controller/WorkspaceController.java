package com.quirely.backend.controller;

import com.quirely.backend.dto.*;
import com.quirely.backend.dto.board.BoardCreationRequest;
import com.quirely.backend.dto.board.BoardDto;
import com.quirely.backend.dto.workspace.MemberInvitationRequest;
import com.quirely.backend.dto.workspace.WorkspaceCreationRequest;
import com.quirely.backend.dto.workspace.WorkspaceDetailDto;
import com.quirely.backend.dto.workspace.WorkspaceDto;
import com.quirely.backend.entity.Board;
import com.quirely.backend.entity.User;
import com.quirely.backend.entity.Workspace;
import com.quirely.backend.exception.types.InvalidFileUploadException;
import com.quirely.backend.mapper.BoardMapper;
import com.quirely.backend.mapper.UserMapper;
import com.quirely.backend.mapper.WorkspaceMapper;
import com.quirely.backend.service.BoardService;
import com.quirely.backend.service.WorkspaceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/workspaces")
@Tag(name = "Workspaces", description = "Endpoints for managing workspaces.")
public class WorkspaceController {
    private final WorkspaceService workspaceService;
    private final WorkspaceMapper workspaceMapper;
    private final UserMapper userMapper;
    private final BoardService boardService;
    private final BoardMapper boardMapper;

    @PostMapping
    @Operation(summary = "Create a new workspace", description = "Creates a new workspace for the authenticated user.")
    public ResponseEntity<WorkspaceDto> createWorkspace(@RequestBody @Valid WorkspaceCreationRequest request,
                                                        @AuthenticationPrincipal User user) {
        Workspace createdWorkspace = workspaceService.createWorkspace(request, user);

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

    @PutMapping("/{workspaceId}")
    @Operation(summary = "Update a workspace", description = "Updates the specified workspace for the authenticated user.")
    public ResponseEntity<WorkspaceDto> updateWorkspace(@RequestBody @Valid WorkspaceCreationRequest request,
                                                        @AuthenticationPrincipal User user, @PathVariable Long workspaceId) {
        Workspace workspace = workspaceService.updateWorkspace(workspaceId, request, user);
        return ResponseEntity.ok(workspaceMapper.toDto(workspace));
    }

    @GetMapping("/{workspaceId}")
    @Operation(summary = "Get workspace details", description = "Retrieves detailed information about a specific workspace.")
    public ResponseEntity<WorkspaceDetailDto> getWorkspace(@AuthenticationPrincipal User user, @PathVariable Long workspaceId) {
        Workspace workspace = workspaceService.getWorkspace(workspaceId, user.getId());
        return ResponseEntity.ok(workspaceMapper.toDetailDto(workspace));
    }

    @GetMapping("/pending")
    @Operation(summary = "Get pending workspaces", description = "Retrieves all workspaces the authenticated user has pending invitations for.")
    public ResponseEntity<List<WorkspaceDto>> getPendingWorkspaces(@AuthenticationPrincipal User user) {
        List<WorkspaceDto> workspaces = workspaceService.getPendingWorkspaces(user.getId())
                .stream()
                .map(workspaceMapper::toDto)
                .toList();

        return ResponseEntity.ok(workspaces);
    }

    @DeleteMapping("/{workspaceId}")
    @Operation(summary = "Delete a workspace", description = "Deletes the specified workspace if the authenticated user is the owner.")
    public ResponseEntity<Void> deleteWorkspace(@AuthenticationPrincipal User user, @PathVariable Long workspaceId) {
        workspaceService.deleteWorkspace(workspaceId, user.getId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{workspaceId}/leave")
    @Operation(summary = "Leave a workspace", description = "Allows the authenticated user to leave the specified workspace.")
    public ResponseEntity<Void> leaveWorkspace(@AuthenticationPrincipal User user, @PathVariable Long workspaceId) {
        workspaceService.leaveWorkspace(workspaceId, user.getId());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{workspaceId}/confirm-invitation")
    @Operation(summary = "Confirm workspace invitation", description = "Allows the authenticated user to confirm or decline a workspace invitation.")
    public ResponseEntity<Void> confirmInvitation(@AuthenticationPrincipal User user, @PathVariable Long workspaceId,
                                                  @RequestParam boolean accept) {
        workspaceService.confirmInvitation(workspaceId, user.getId(), accept);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{workspaceId}/members")
    @Operation(summary = "Get workspace members", description = "Retrieves all members of the specified workspace.")
    public ResponseEntity<List<UserAcceptanceDto>> getWorkspaceMembers(@AuthenticationPrincipal User user, @PathVariable Long workspaceId) {
        List<UserAcceptanceDto> members = workspaceService.getWorkspaceMembers(workspaceId, user.getId())
                .stream()
                .map(userMapper::toDto)
                .toList();
        return ResponseEntity.ok(members);
    }

    @PostMapping("/{workspaceId}/invite")
    @Operation(summary = "Invite a member", description = "Invites a new member to the specified workspace.")
    public ResponseEntity<Void> inviteMember(@RequestBody @Valid MemberInvitationRequest request, @PathVariable Long workspaceId,
                                             @AuthenticationPrincipal User user) {

        workspaceService.inviteMember(request, workspaceId, user);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{workspaceId}/members/{memberId}")
    @Operation(summary = "Kick a member", description = "Removes a member from the specified workspace.")
    public ResponseEntity<Void> kickMember(@PathVariable Long workspaceId, @PathVariable Long memberId,
                                           @AuthenticationPrincipal User user) {

        workspaceService.kickMember(workspaceId, memberId, user.getId());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping(value = "/{workspaceId}/logo", consumes = "multipart/form-data")
    @Operation(summary = "Upload workspace logo", description = "Uploads a new logo for the specified workspace. Only image files are accepted.")
    public ResponseEntity<UploadFileResponse> uploadLogo(@PathVariable Long workspaceId, @RequestParam("file") @NotNull MultipartFile multipartFile,
                                                         @AuthenticationPrincipal User user) throws IOException {

        if (multipartFile.isEmpty()) {
            throw new InvalidFileUploadException("File must not be empty");
        }
        String contentType = multipartFile.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new InvalidFileUploadException("Invalid content type: " + contentType);
        }

        String url = workspaceService.uploadLogo(workspaceId, user.getId(), multipartFile);

        return ResponseEntity.ok().body(new UploadFileResponse(url));
    }

    @PostMapping("/{workspaceId}/boards")
    @Operation(summary = "Create a board in a workspace", description = "Creates a new board within the specified workspace for the authenticated user.")
    public ResponseEntity<BoardDto> createBoard(@RequestBody @Valid BoardCreationRequest request, @PathVariable Long workspaceId, @AuthenticationPrincipal User user) {
        Board board = boardService.createBoard(request, workspaceId, user);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(boardMapper.toDto(board));
    }

    @GetMapping("/{workspaceId}/boards")
    @Operation(summary = "Get all boards in a workspace", description = "Fetches all boards within the specified workspace for the authenticated user.")
    public ResponseEntity<List<BoardDto>> getBoardsByWorkspace(@PathVariable Long workspaceId, @AuthenticationPrincipal User user) {
        List<BoardDto> boards = boardService.getBoards(workspaceId, user)
                .stream()
                .map(boardMapper::toDto)
                .toList();
        return ResponseEntity.ok(boards);
    }

}
