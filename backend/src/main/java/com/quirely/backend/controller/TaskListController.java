package com.quirely.backend.controller;

import com.quirely.backend.dto.task.TaskListDto;
import com.quirely.backend.dto.task.TaskListUpdateRequest;
import com.quirely.backend.entity.TaskList;
import com.quirely.backend.entity.User;
import com.quirely.backend.mapper.TaskListMapper;
import com.quirely.backend.service.TaskListService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/task-lists")
@Tag(name = "Task Lists", description = "Operations related to task lists")
public class TaskListController {
    private final TaskListService taskListService;
    private final TaskListMapper taskListMapper;

    @PutMapping("/{taskListId}")
    @Operation(summary = "Update a task list", description = "Updates the title and order of a specific task list")
    public ResponseEntity<TaskListDto> updateTaskList(@PathVariable Long taskListId, @RequestBody TaskListUpdateRequest request, @AuthenticationPrincipal User user) {
        TaskList taskList = taskListService.updateTaskList(request, taskListId, user);

        return ResponseEntity.ok(taskListMapper.toDto(taskList));
    }

    @DeleteMapping("/{taskListId}")
    @Operation(summary = "Delete a task list", description = "Deletes a specific task list by its ID")
    public ResponseEntity<Void> deleteTaskList(@PathVariable Long taskListId, @AuthenticationPrincipal User user) {
        taskListService.deleteTaskList(taskListId, user);

        return ResponseEntity.noContent().build();
    }

}
