package com.quirely.backend.controller;

import com.quirely.backend.dto.task.TaskDto;
import com.quirely.backend.dto.task.TaskReorderRequest;
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

    @PostMapping("/{taskId}/reorder")
    @Operation(summary = "Reorder a task", description = "Reorders a task based on the provided request.")
    public ResponseEntity<TaskDto> reorderTask(@PathVariable Long taskId, @RequestBody @Valid TaskReorderRequest request,
                                                  @AuthenticationPrincipal User user) {
        Task task = taskService.reorderTask(request, taskId, user.getId());
        return ResponseEntity.ok(taskMapper.toDto(task));
    }

    @PatchMapping("/{taskId}")
    @Operation(summary = "Update a task", description = "Updates the details of a task based on the provided request.")
    public ResponseEntity<TaskDto> updateTask(@PathVariable Long taskId, @RequestBody @Valid TaskUpdateRequest request,
                                              @AuthenticationPrincipal User user) {
        Task task = taskService.updateTask(request, taskId, user.getId());
        return ResponseEntity.ok(taskMapper.toDto(task));
    }
}
