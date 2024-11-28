package com.quirely.backend.mapper;

import com.quirely.backend.entity.MemberWorkspace;
import com.quirely.backend.entity.User;
import com.quirely.backend.entity.Workspace;
import org.springframework.stereotype.Component;

@Component
public class MemberWorkspaceMapper {

    public MemberWorkspace createEntity(User member, Workspace workspace, Boolean accepted) {
        MemberWorkspace.MemberWorkspacePK memberWorkspacePK = MemberWorkspace.MemberWorkspacePK.builder()
                .workspaceId(workspace.getId())
                .memberId(member.getId())
                .build();

        return MemberWorkspace.builder()
                .id(memberWorkspacePK)
                .member(member)
                .accepted(accepted)
                .workspace(workspace)
                .build();
    }
}
