package com.quirely.backend.mapper;

import com.quirely.backend.dto.task.TaskDto;
import com.quirely.backend.entity.Task;
import org.springframework.stereotype.Component;

@Component
public class TaskMapper {

    public TaskDto toDto(Task task) {
        return TaskDto.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .order(task.getOrder())
                .build();
    }
}
