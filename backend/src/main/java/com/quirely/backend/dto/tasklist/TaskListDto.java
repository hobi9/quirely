package com.quirely.backend.dto.tasklist;

import com.quirely.backend.dto.task.TaskDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskListDto {
    private Long id;
    private String title;
    private int order;
    private List<TaskDto> tasks;
}
