package com.quirely.backend.service;

import com.quirely.backend.dto.board.BoardCreationRequest;
import com.quirely.backend.entity.Board;
import com.quirely.backend.entity.User;
import com.quirely.backend.entity.Workspace;
import com.quirely.backend.exception.types.BoardNotFoundException;
import com.quirely.backend.mapper.BoardMapper;
import com.quirely.backend.repository.BoardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BoardService {
    private final BoardRepository boardRepository;
    private final WorkspaceService workspaceService;
    private final BoardMapper boardMapper;

    public Board createBoard(BoardCreationRequest request, Long workspaceId, User user) {
        Workspace workspace = workspaceService.getWorkspace(workspaceId, user.getId());
        Board board = boardMapper.toEntity(request, workspace);
        return boardRepository.save(board);
    }

    public List<Board> getBoards(Long workspaceId, User user) {
        Workspace workspace = workspaceService.getWorkspace(workspaceId, user.getId());
        return boardRepository.findBoardsByWorkspaceAndMember(workspace.getId(), user.getId());
    }

    public Board getBoard(Long boardId, User user) {
        return boardRepository.findBoardByWorkspaceAndMember(boardId, user.getId())
                .orElseThrow(BoardNotFoundException::new);
    }
}
