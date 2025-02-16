package com.quirely.backend.service;

import com.quirely.backend.dto.tasklist.TaskListCreationRequest;
import com.quirely.backend.dto.tasklist.TaskListUpdateRequest;
import com.quirely.backend.entity.Board;
import com.quirely.backend.entity.Task;
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
                .title(request.title().trim())
                .order(taskListRepository.countTaskListByBoardId(boardId))
                .build()
        );
    }

    public List<TaskList> getTaskLists(Long boardId, User user) {
        boardService.getBoard(boardId, user);

        return taskListRepository.findTaskListByBoardIdOrderByOrder(boardId);
    }

    public TaskList getTaskList(Long taskListId, Long userId) {
        return taskListRepository.findByIdAndMember(taskListId, userId)
                .orElseThrow(ListNotFoundException::new);
    }

    @Transactional
    public TaskList updateTaskList(TaskListUpdateRequest request, Long taskListId, User user) {
        TaskList taskList = this.getTaskList(taskListId, user.getId());
        taskList.setTitle(request.title().trim());

        int oldOrder = taskList.getOrder();
        if (oldOrder != request.order()) {
            Long boardId = taskList.getBoard().getId();
            int numberOfTaskListsInBoard = taskListRepository.countTaskListByBoardId(boardId);
            int newOrder = Math.min(request.order(), numberOfTaskListsInBoard - 1);
            System.out.println("HEREEE");
            if (newOrder > oldOrder) {
                List<TaskList> taskListsForLeftShift = taskListRepository.getTaskListsForLeftShift(taskListId, boardId, oldOrder, newOrder);
                taskListsForLeftShift.forEach(taskListForLeftShift -> taskListForLeftShift.setOrder(taskListForLeftShift.getOrder() - 1));
                taskListRepository.saveAll(taskListsForLeftShift);
            } else if (newOrder < oldOrder) {
                List<TaskList> taskListsForRightShift = taskListRepository.getTaskListsForRightShift(taskListId, boardId, oldOrder, newOrder);
                taskListsForRightShift.forEach(taskListForRightShift -> taskListForRightShift.setOrder(taskListForRightShift.getOrder() + 1));
                taskListRepository.saveAll(taskListsForRightShift);
            }
            taskList.setOrder(newOrder);
        }
        return taskListRepository.save(taskList);
    }

    @Transactional
    public void deleteTaskList(Long taskListId, User user) {
        TaskList taskList = this.getTaskList(taskListId, user.getId());

        List<TaskList> followingTaskLists = taskListRepository.getFollowingTaskLists(taskList.getId(), taskList.getBoard().getId(), taskList.getOrder());
        followingTaskLists.forEach(taskListToShiftAfterDelete -> taskListToShiftAfterDelete.setOrder(taskListToShiftAfterDelete.getOrder() - 1));

        taskListRepository.saveAll(followingTaskLists);
        taskListRepository.delete(taskList);
    }

    @Transactional
    public TaskList duplicateTaskList(Long taskListId, User user) {
        TaskList taskList = this.getTaskList(taskListId, user.getId());
        Board board = taskList.getBoard();

        List<TaskList> followingTaskLists = taskListRepository.getFollowingTaskLists(taskList.getId(), board.getId(), taskList.getOrder());
        followingTaskLists.forEach(followingTaskList -> followingTaskList.setOrder(followingTaskList.getOrder() + 1));

        var clonedTaskList = new TaskList();
        clonedTaskList.setTitle(String.format("%s - Copy", taskList.getTitle()));
        clonedTaskList.setOrder(taskList.getOrder() + 1);
        clonedTaskList.setBoard(board);


        List<Task> clonedLists = taskList.getTasks()
                .stream()
                .map(task -> Task.builder()
                        .title(task.getTitle())
                        .order(task.getOrder())
                        .list(clonedTaskList).description(task.getDescription()).build())
                .toList();
        clonedTaskList.setTasks(clonedLists);

        taskListRepository.saveAll(followingTaskLists);

        return taskListRepository.save(clonedTaskList);
    }


}
