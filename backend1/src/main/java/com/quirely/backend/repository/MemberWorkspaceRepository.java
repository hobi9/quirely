package com.quirely.backend.repository;

import com.quirely.backend.entity.MemberWorkspaceEntity;
import com.quirely.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface MemberWorkspaceRepository extends JpaRepository<MemberWorkspaceEntity, MemberWorkspaceEntity.MemberWorkspacePK> {

    @Query("delete from MemberWorkspaceEntity m where m.member.id = :memberId and m.workspace.id = :workspaceId")
    @Modifying
    void deleteMembership(Long memberId, Long workspaceId);

    @Query("select w from MemberWorkspaceEntity w where w.workspace.id = :workspaceId and w.member.id != :ownerId")
    Optional<MemberWorkspaceEntity> findNewOwner(Long ownerId, Long workspaceId);

    @Query("select w.member from MemberWorkspaceEntity w where  w.workspace.id = :workspaceId")
    List<User> getWorkspaceMembers(Long workspaceId);
}
