package com.quirely.backend.service;

import com.quirely.backend.dto.task.TaskListCreationRequest;
import com.quirely.backend.dto.task.TaskListUpdateRequest;
import com.quirely.backend.entity.Board;
import com.quirely.backend.entity.TaskList;
import com.quirely.backend.entity.User;
import com.quirely.backend.exception.types.ListNotFoundException;
import com.quirely.backend.repository.TaskListRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
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

    public List<TaskList> getTaskLists(Long boardId, User user) {
        boardService.getBoard(boardId, user);

        return taskListRepository.findTaskListByBoardIdOrderByOrder(boardId);
    }

    @Transactional
    public TaskList updateTaskList(TaskListUpdateRequest request, Long taskListId, User user) {
        TaskList taskList = taskListRepository.findByIdAndMember(taskListId, user.getId())
                .orElseThrow(ListNotFoundException::new);
        taskList.setTitle(request.title());

        int oldOrder = taskList.getOrder();
        if (oldOrder != request.order()) {
            Long boardId = taskList.getBoard().getId();
            int numberOfTaskListsInBoard = taskListRepository.countTaskListByBoardId(boardId);
            int newOrder = Math.min(request.order(), numberOfTaskListsInBoard -1);

            if (newOrder > oldOrder) {
                List<TaskList> taskListsForLeftShift = taskListRepository.getTaskListsForLeftShift(taskListId, boardId, oldOrder, newOrder);
                for (TaskList taskListForLeftShift : taskListsForLeftShift) {
                    taskListForLeftShift.setOrder(taskListForLeftShift.getOrder() + -1);
                }
                try {
                    log.info("Updating task list for left shift");
                    Thread.sleep(10000);
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
                taskListRepository.saveAll(taskListsForLeftShift);
            } else if (newOrder < oldOrder) {
                List<TaskList> taskListsForRightShift = taskListRepository.getTaskListsForRightShift(taskListId, boardId, oldOrder, newOrder);
                for (TaskList taskListForRightShift : taskListsForRightShift) {
                    taskListForRightShift.setOrder(taskListForRightShift.getOrder() + 1);
                }
                taskListRepository.saveAll(taskListsForRightShift);
            }
            taskList.setOrder(newOrder);
        }
        return taskListRepository.save(taskList);
    }

    public void deleteTaskList(Long taskListId, User user) {
        TaskList taskList = taskListRepository.findByIdAndMember(taskListId, user.getId())
                .orElseThrow(ListNotFoundException::new);

        taskListRepository.delete(taskList);
    }



}
