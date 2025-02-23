package com.quirely.backend.controller;

import com.quirely.backend.dto.task.TaskDto;
import com.quirely.backend.dto.task.TaskUpdateRequest;
import com.quirely.backend.entity.Task;
import com.quirely.backend.entity.User;
import com.quirely.backend.mapper.TaskMapper;
import com.quirely.backend.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/tasks")
@Tag(name = "Tasks", description = "Task management operations")
public class TaskController {
    private final TaskService taskService;
    private final TaskMapper taskMapper;

    @PutMapping("/{taskId}")
    @Operation(summary = "Update a task", description = "Updates the details and order of an existing task.")
    public ResponseEntity<TaskDto> updateTaskList(@PathVariable Long taskId, @RequestBody @Valid TaskUpdateRequest request,
                                                  @AuthenticationPrincipal User user) {
        Task task = taskService.updateTask(request, taskId, user.getId());
        return ResponseEntity.ok(taskMapper.toDto(task));
    }
}
