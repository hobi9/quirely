package com.quirely.backend.repository;

import com.quirely.backend.entity.MemberWorkspaceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberWorkspaceRepository extends JpaRepository<MemberWorkspaceEntity, MemberWorkspaceEntity.MemberWorkspacePK> {
}
