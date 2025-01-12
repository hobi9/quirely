package com.quirely.backend.repository;

import com.quirely.backend.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface BoardRepository extends JpaRepository<Board, Long> {

    @Query("select b from Board b join b.workspace w join w.members m where w.id = :workspaceId and m.member.id = :memberId and m.accepted = true")
    List<Board> findBoardsByWorkspaceAndMember(Long workspaceId, Long memberId);


    @Query("select b from Board b join b.workspace w join w.members m where b.id = :boardId and m.member.id = :memberId and m.accepted = true")
    Optional<Board> findBoardByWorkspaceAndMember(Long boardId, Long memberId);
}
