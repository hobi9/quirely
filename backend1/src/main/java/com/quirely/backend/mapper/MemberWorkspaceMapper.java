package com.quirely.backend.mapper;

import com.quirely.backend.entity.MemberWorkspaceEntity;
import com.quirely.backend.entity.UserEntity;
import com.quirely.backend.entity.WorkspaceEntity;
import org.springframework.stereotype.Component;

@Component
public class MemberWorkspaceMapper {

    public MemberWorkspaceEntity createEntity(UserEntity ownerEntity, WorkspaceEntity savedEntity) {
        MemberWorkspaceEntity.MemberWorkspacePK memberWorkspacePK = new MemberWorkspaceEntity.MemberWorkspacePK(ownerEntity.getId(), savedEntity.getId());
        return MemberWorkspaceEntity.builder()
                .id(memberWorkspacePK)
                .member(ownerEntity)
                .accepted(true)
                .workspace(savedEntity)
                .build();
    }
}
