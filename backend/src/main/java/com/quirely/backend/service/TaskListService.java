package com.quirely.backend.service;

import com.quirely.backend.dto.task.TaskListCreationRequest;
import com.quirely.backend.entity.Board;
import com.quirely.backend.entity.TaskList;
import com.quirely.backend.entity.User;
import com.quirely.backend.repository.TaskListRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TaskListService {
    private final BoardService boardService;
    private final TaskListRepository taskListRepository;

    public TaskList createTaskList(TaskListCreationRequest request, Long boardId, User user) {
        Board board = boardService.getBoard(boardId, user);

        return taskListRepository.save(TaskList.builder()
                .board(board)
                .title(request.title())
                .order(taskListRepository.countTaskListByBoardId(boardId))
                .build()
        );
    }
}
