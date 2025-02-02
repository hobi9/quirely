package com.quirely.backend.mapper;

import com.quirely.backend.dto.tasklist.TaskListDto;
import com.quirely.backend.entity.TaskList;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class TaskListMapper {
    private final TaskMapper taskMapper;

    public TaskListDto toDto(TaskList taskList) {
        return TaskListDto.builder()
                .id(taskList.getId())
                .title(taskList.getTitle())
                .order(taskList.getOrder())
                .tasks(Optional.ofNullable(taskList.getTasks())
                        .orElseGet(Collections::emptyList)
                        .stream()
                        .map(taskMapper::toDto)
                        .toList()
                )
                .build();
    }
}
