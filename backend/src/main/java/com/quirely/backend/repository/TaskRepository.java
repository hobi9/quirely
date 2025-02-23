package com.quirely.backend.repository;

import com.quirely.backend.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {

    int countTasksByListId(Long listId);

    @Query("select t from Task t join t.list l join l.board b join b.workspace w join w.members m where t.id = :taskId and m.member.id = :memberId and m.accepted = true")
    Optional<Task> findTaskByIdAndMember(Long taskId, Long memberId);


    @Query("select t from Task t where t.id != :taskId and t.order > :oldOrder and t.order <= :newOrder and t.list.id = :taskListId")
    List<Task> getTasksForLeftShift(Long taskId, Long taskListId, int oldOrder, int newOrder);

    @Query("select t from Task t  where t.id != :taskId and t.order >= :newOrder and t.order < :oldOrder and t.list.id = :taskListId")
    List<Task> getTasksForRightShift(Long taskId, Long taskListId, int oldOrder, int newOrder);

}
