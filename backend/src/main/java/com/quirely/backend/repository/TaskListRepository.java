package com.quirely.backend.repository;

import com.quirely.backend.entity.TaskList;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskListRepository extends JpaRepository<TaskList, Long> {

    int countTaskListByBoardId(Long boardId);
}
