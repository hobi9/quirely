package com.quirely.backend.controller;

import com.quirely.backend.dto.board.BoardImageDto;
import com.quirely.backend.mapper.BoardMapper;
import com.quirely.backend.service.UnsplashService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/boards")
public class BoardController {
    private final UnsplashService unsplashService;
    private final BoardMapper boardMapper;


    @GetMapping("/images")
    public ResponseEntity<List<BoardImageDto>> getLogos() {
        List<BoardImageDto> boardImages = unsplashService.getBoardImages()
                .stream()
                .map(boardMapper::toDto)
                .toList();

        return ResponseEntity.ok(boardImages);
    }

}
