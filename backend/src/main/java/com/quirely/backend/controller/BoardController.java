package com.quirely.backend.controller;

import com.quirely.backend.dto.board.BoardImageDto;
import com.quirely.backend.mapper.BoardMapper;
import com.quirely.backend.service.UnsplashService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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

    @GetMapping("/images")
    @Operation(summary = "Get board images", description = "Retrieves a list of board images from an external Unsplash service.")
    public ResponseEntity<List<BoardImageDto>> getLogos() {
        List<BoardImageDto> boardImages = unsplashService.getBoardImages()
                .stream()
                .map(boardMapper::toDto)
                .toList();

        return ResponseEntity.ok(boardImages);
    }

}
