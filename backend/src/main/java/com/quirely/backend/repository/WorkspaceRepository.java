package com.quirely.backend.repository;

import com.quirely.backend.entity.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface WorkspaceRepository extends JpaRepository<Workspace, Long> {

    @Query("select w from Workspace w join w.members m where m.member.id = :userId and m.accepted = :accepted order by w.name")
    List<Workspace> findWorkspacesByMemberAndAccepted(Long userId, Boolean accepted);

    @Query("select w from Workspace w join w.members m where m.member.id = :userId and m.accepted is null order by w.name")
    List<Workspace> findPendingWorkspacesByMember(Long userId);

    @Query("select w from Workspace w where  w.id = :workspaceId and w.owner.id = :ownerId")
    Optional<Workspace> findWorkspaceByIdAndOwner(Long workspaceId, Long ownerId);

    @Query("select w from Workspace w join w.members m where m.member.id = :memberId and w.id = :workspaceId and m.accepted = true")
    Optional<Workspace> findWorkspaceByIdAndMember(Long workspaceId, Long memberId);

}
