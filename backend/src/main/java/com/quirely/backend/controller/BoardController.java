package com.quirely.backend.controller;

import com.quirely.backend.dto.board.BoardDto;
import com.quirely.backend.dto.board.BoardImageDto;
import com.quirely.backend.dto.board.BoardTitleUpdateRequest;
import com.quirely.backend.dto.tasklist.TaskListCreationRequest;
import com.quirely.backend.dto.tasklist.TaskListDto;
import com.quirely.backend.entity.Board;
import com.quirely.backend.entity.TaskList;
import com.quirely.backend.entity.User;
import com.quirely.backend.mapper.BoardMapper;
import com.quirely.backend.mapper.TaskListMapper;
import com.quirely.backend.service.BoardService;
import com.quirely.backend.service.TaskListService;
import com.quirely.backend.service.UnsplashService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/boards")
@Tag(name = "Boards", description = "Endpoints for managing boards.")
public class BoardController {
    private final UnsplashService unsplashService;
    private final BoardMapper boardMapper;
    private final BoardService boardService;
    private final TaskListService taskListService;
    private final TaskListMapper taskListMapper;

    @GetMapping("/images")
    @Operation(summary = "Get board images", description = "Retrieves a list of board images from an external Unsplash service.")
    public ResponseEntity<List<BoardImageDto>> getLogos() {
        List<BoardImageDto> boardImages = unsplashService.getBoardImages()
                .stream()
                .map(boardMapper::toDto)
                .toList();

        return ResponseEntity.ok(boardImages);
    }

    @GetMapping("/{boardId}")
    @Operation(summary = "Get board by ID", description = "Retrieves the details of a specific board by its ID for the authenticated user.")
    public ResponseEntity<BoardDto> getBoard(@PathVariable @NotNull Long boardId, @AuthenticationPrincipal User user) {
        Board board = boardService.getBoard(boardId, user);

        return ResponseEntity.ok(boardMapper.toDto(board));
    }

    @PatchMapping("/{boardId}")
    @Operation(summary = "Update board title", description = "Updates the title of a specific board for the authenticated user.")
    public ResponseEntity<BoardDto> updateBoard(@PathVariable @NotNull Long boardId, @RequestBody @Valid BoardTitleUpdateRequest request,
                                                @AuthenticationPrincipal User user) {
        Board updatedBoard = boardService.updateBoard(request, boardId, user);

        return ResponseEntity.ok(boardMapper.toDto(updatedBoard));
    }

    @DeleteMapping("/{boardId}")
    @Operation(summary = "Delete board", description = "Deletes a specific board for the authenticated user.")
    public ResponseEntity<Void> deleteBoard(@PathVariable @NotNull Long boardId, @AuthenticationPrincipal User user) {
        boardService.deleteBoard(boardId, user);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{boardId}/task-lists")
    @Operation(summary = "Create a task list", description = "Creates a new task list within a specific board for the authenticated user.")
    public ResponseEntity<TaskListDto> createTaskList(@PathVariable @NotNull Long boardId, @RequestBody @Valid TaskListCreationRequest request,
                                                      @AuthenticationPrincipal User user) {
        TaskList taskList = taskListService.createTaskList(request, boardId, user);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(taskListMapper.toDto(taskList));
    }

    @GetMapping("/{boardId}/task-lists")
    @Operation(summary = "Get task lists for a board", description = "Retrieves all task lists associated with a specific board for the authenticated user.")
    public ResponseEntity<List<TaskListDto>> getTaskLists(@PathVariable @NotNull Long boardId, @AuthenticationPrincipal User user) {
        List<TaskListDto> taskLists = taskListService.getTaskLists(boardId, user)
                .stream()
                .map(taskListMapper::toDto)
                .toList();

        return ResponseEntity.ok(taskLists);
    }


}
