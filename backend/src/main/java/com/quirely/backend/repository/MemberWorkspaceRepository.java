package com.quirely.backend.repository;

import com.quirely.backend.entity.MemberWorkspace;
import com.quirely.backend.model.UserWithAcceptance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface MemberWorkspaceRepository extends JpaRepository<MemberWorkspace, MemberWorkspace.MemberWorkspacePK> {

    @Modifying
    @Transactional
    @Query("delete from MemberWorkspace m where m.member.id = :memberId and m.workspace.id = :workspaceId")
    void deleteMembership(Long memberId, Long workspaceId);

    @Query("select w from MemberWorkspace w where w.workspace.id = :workspaceId and w.member.id != :ownerId")
    Optional<MemberWorkspace> findNewOwner(Long ownerId, Long workspaceId);

    @Query("select new com.quirely.backend.model.UserWithAcceptance(w.member, w.accepted) from MemberWorkspace w where  w.workspace.id = :workspaceId")
    List<UserWithAcceptance> getWorkspaceMembers(Long workspaceId);
}
