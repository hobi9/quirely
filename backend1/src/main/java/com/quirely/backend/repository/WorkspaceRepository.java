package com.quirely.backend.repository;

import com.quirely.backend.entity.WorkspaceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface WorkspaceRepository extends JpaRepository<WorkspaceEntity, Long> {

    @Query("select w from WorkspaceEntity w join w.members m where m.member.id = :userId and m.accepted = :accepted")
    List<WorkspaceEntity> findWorkspacesByMemberAndAccepted(Long userId, Boolean accepted);

}
