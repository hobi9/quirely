package com.quirely.backend.repository;

import com.quirely.backend.entity.TaskList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TaskListRepository extends JpaRepository<TaskList, Long> {

    int countTaskListByBoardId(Long boardId);

    List<TaskList> findTaskListByBoardIdOrderByOrder(Long boardId);

    @Query("select t from TaskList t join t.board b join b.workspace w join w.members m where t.id = :taskListId and m.member.id = :memberId and m.accepted = true")
    Optional<TaskList> findByIdAndMember(Long taskListId, Long memberId);

    @Query("select t from TaskList t where t.id != :taskListId and t.order > :oldOrder and t.order <= :newOrder and t.board.id = :boardId")
    List<TaskList> getTaskListsForLeftShift(Long taskListId, Long boardId, int oldOrder, int newOrder);

    @Query("select t from TaskList t  where t.id != :taskListId and t.order >= :newOrder and t.order < :oldOrder and t.board.id = :boardId")
    List<TaskList> getTaskListsForRightShift(Long taskListId, Long boardId, int oldOrder, int newOrder);

    @Query("select t from TaskList t where t.id != :taskListId and t.order > :listOrder and t.board.id = :boardId")
    List<TaskList> getFollowingTaskLists(Long taskListId, Long boardId, int listOrder);
}
