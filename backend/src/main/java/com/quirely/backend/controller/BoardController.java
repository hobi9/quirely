package com.quirely.backend.controller;

import com.quirely.backend.dto.board.BoardDto;
import com.quirely.backend.dto.board.BoardImageDto;
import com.quirely.backend.entity.Board;
import com.quirely.backend.entity.User;
import com.quirely.backend.mapper.BoardMapper;
import com.quirely.backend.service.BoardService;
import com.quirely.backend.service.UnsplashService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/boards")
@Tag(name = "Boards", description = "Endpoints for managing boards.")
public class BoardController {
    private final UnsplashService unsplashService;
    private final BoardMapper boardMapper;
    private final BoardService boardService;

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
    public BoardDto getBoard(@PathVariable @NotNull Long boardId, @AuthenticationPrincipal User user) {
        Board board = boardService.getBoard(boardId, user);

        return boardMapper.toDto(board);
    }

}
