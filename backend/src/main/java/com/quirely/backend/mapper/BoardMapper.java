package com.quirely.backend.mapper;

import com.quirely.backend.dto.board.BoardImageDto;
import com.quirely.backend.model.BoardImage;
import org.springframework.stereotype.Component;

@Component
public class BoardMapper {

    public BoardImageDto toDto(BoardImage boardImage) {
        return new BoardImageDto(boardImage.getId(), boardImage.getUrl());
    }

}
