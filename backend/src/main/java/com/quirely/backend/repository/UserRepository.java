package com.quirely.backend.repository;

import com.quirely.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.id != :userId AND u.email LIKE %:email% AND u.id NOT IN " +
            "(SELECT mw.member.id FROM MemberWorkspaceEntity mw WHERE mw.workspace.id = :workspaceId and mw.accepted = true) order by u.fullName")
    List<User> findUsersByFilter(Long userId, Long workspaceId, String email);
}
