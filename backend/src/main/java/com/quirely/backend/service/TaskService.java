package com.quirely.backend.service;

import com.quirely.backend.dto.task.TaskCreationRequest;
import com.quirely.backend.entity.Task;
import com.quirely.backend.entity.TaskList;
import com.quirely.backend.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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

}
