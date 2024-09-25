package com.quirely.backend.mapper;

import com.quirely.backend.entity.MemberWorkspaceEntity;
import com.quirely.backend.entity.User;
import com.quirely.backend.entity.Workspace;
import org.springframework.stereotype.Component;

@Component
public class MemberWorkspaceMapper {

    public MemberWorkspaceEntity createEntity(User member, Workspace workspace, Boolean accepted) {
        MemberWorkspaceEntity.MemberWorkspacePK memberWorkspacePK = MemberWorkspaceEntity.MemberWorkspacePK.builder()
                .workspaceId(workspace.getId())
                .memberId(member.getId())
                .build();

        return MemberWorkspaceEntity.builder()
                .id(memberWorkspacePK)
                .member(member)
                .accepted(accepted)
                .workspace(workspace)
                .build();
    }
}
