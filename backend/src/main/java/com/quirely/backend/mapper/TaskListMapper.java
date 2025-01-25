package com.quirely.backend.mapper;

import com.quirely.backend.dto.task.TaskListDto;
import com.quirely.backend.entity.TaskList;
import org.springframework.stereotype.Component;

@Component
public class TaskListMapper {

    public TaskListDto toDto(TaskList taskList) {
        return TaskListDto.builder()
                .id(taskList.getId())
                .title(taskList.getTitle())
                .order(taskList.getOrder())
                .build();
    }
}
