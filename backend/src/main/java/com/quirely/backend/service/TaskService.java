package com.quirely.backend.service;

import com.quirely.backend.dto.task.TaskCreationRequest;
import com.quirely.backend.dto.task.TaskReorderRequest;
import com.quirely.backend.dto.task.TaskUpdateRequest;
import com.quirely.backend.entity.Task;
import com.quirely.backend.entity.TaskList;
import com.quirely.backend.exception.types.TaskNotFoundException;
import com.quirely.backend.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;
    private final TaskListService taskListService;

    public Task createTask(TaskCreationRequest request, Long taskListId, Long userId) {
        TaskList taskList = taskListService.getTaskList(taskListId, userId);

        return taskRepository.save(
                Task.builder()
                        .title(request.title().trim())
                        .list(taskList)
                        .description(request.description())
                        .order(taskRepository.countTasksByListId(taskList.getId()))
                        .build()
        );

    }

    @Transactional
    public Task reorderTask(TaskReorderRequest request, Long taskId, Long userId) {
        Long newTaskListId = request.taskListId();
        TaskList taskList = taskListService.getTaskList(newTaskListId, userId);
        Task task = taskRepository.findTaskByIdAndMember(taskId, userId)
                .orElseThrow(TaskNotFoundException::new);

        Long oldTaskListId = task.getList().getId();
        int oldOrder = task.getOrder();
        int newOrder;

        var affectedTasks = new LinkedList<Task>();
        affectedTasks.add(task);

        if (oldTaskListId.equals(newTaskListId) && task.getOrder() != request.order()) {
            // Reorder within the same list
            int numberOfTasksInTaskList = taskRepository.countTasksByListId(taskList.getId());
            newOrder = Math.min(request.order(), numberOfTasksInTaskList - 1);

            if (newOrder > oldOrder) {
                List<Task> taskListsForLeftShift = taskRepository.getTasksForLeftShift(taskId, oldTaskListId, oldOrder, newOrder);
                taskListsForLeftShift.forEach(taskListForLeftShift -> taskListForLeftShift.setOrder(taskListForLeftShift.getOrder() - 1));
                affectedTasks.addAll(taskListsForLeftShift);
            } else {
                List<Task> taskListsForRightShift = taskRepository.getTasksForRightShift(taskId, oldTaskListId, oldOrder, newOrder);
                taskListsForRightShift.forEach(taskListForRightShift -> taskListForRightShift.setOrder(taskListForRightShift.getOrder() + 1));
                affectedTasks.addAll(taskListsForRightShift);
            }

            task.setOrder(newOrder);
        } else if (!oldTaskListId.equals(newTaskListId)) {
            //Move to a different list
            int numberOfTasksInNewTaskList = taskRepository.countTasksByListId(newTaskListId);
            int numberOfTasksInOldTaskList = taskRepository.countTasksByListId(oldTaskListId);
            newOrder = Math.min(request.order(), numberOfTasksInNewTaskList);

            List<Task> taskListsForRightShift = taskRepository.getTasksForRightShift(taskId, newTaskListId, numberOfTasksInNewTaskList, newOrder);
            taskListsForRightShift.forEach(taskListForRightShift -> taskListForRightShift.setOrder(taskListForRightShift.getOrder() + 1));

            List<Task> taskListsForLeftShift = taskRepository.getTasksForLeftShift(taskId, oldTaskListId, oldOrder, numberOfTasksInOldTaskList - 1);
            taskListsForLeftShift.forEach(taskListForLeftShift -> taskListForLeftShift.setOrder(taskListForLeftShift.getOrder() - 1));

            affectedTasks.addAll(taskListsForLeftShift);
            affectedTasks.addAll(taskListsForRightShift);
            task.setList(taskList);
            task.setOrder(newOrder);
        }

        taskRepository.saveAll(affectedTasks);
        return task;
    }

    public Task updateTask(TaskUpdateRequest request, Long taskId, Long userId) {
        Task task = taskRepository.findTaskByIdAndMember(taskId, userId)
                .orElseThrow(TaskNotFoundException::new);

        task.setTitle(request.title().trim());
        task.setDescription(request.description());
        return taskRepository.save(task);
    }



}
