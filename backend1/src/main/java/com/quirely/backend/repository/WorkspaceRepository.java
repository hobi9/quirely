package com.quirely.backend.repository;

import com.quirely.backend.entity.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface WorkspaceRepository extends JpaRepository<Workspace, Long> {

    @Query("select w from Workspace w join w.members m where m.member.id = :userId and m.accepted = :accepted")
    List<Workspace> findWorkspacesByMemberAndAccepted(Long userId, Boolean accepted);

}
