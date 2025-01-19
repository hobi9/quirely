package com.quirely.backend.mapper;

import com.quirely.backend.dto.board.BoardCreationRequest;
import com.quirely.backend.dto.board.BoardDto;
import com.quirely.backend.dto.board.BoardImageDto;
import com.quirely.backend.entity.Board;
import com.quirely.backend.entity.Workspace;
import com.quirely.backend.model.BoardImage;
import org.springframework.stereotype.Component;

@Component
public class BoardMapper {

    public BoardImageDto toDto(BoardImage boardImage) {
        return new BoardImageDto(boardImage.getId(), boardImage.getThumbnailUrl(), boardImage.getFullUrl(), boardImage.getDescription());
    }

    public Board toEntity(BoardCreationRequest boardCreationRequest, Workspace workspace) {
        return Board.builder()
                .title(boardCreationRequest.title().trim())
                .thumbnailUrl(boardCreationRequest.thumbnailUrl())
                .fulllUrl(boardCreationRequest.fullUrl())
                .workspace(workspace)
                .build();
    }

    public BoardDto toDto(Board board) {
        return BoardDto.builder()
                .id(board.getId())
                .title(board.getTitle())
                .thumbnailUrl(board.getThumbnailUrl())
                .fullUrl(board.getFulllUrl())
                .workspaceId(board.getWorkspace().getId())
                .build();
    }

}
