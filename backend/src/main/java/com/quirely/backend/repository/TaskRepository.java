package com.quirely.backend.repository;

import com.quirely.backend.entity.Task;
import com.quirely.backend.entity.TaskList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    int countTasksByListId(Long listId);
}
