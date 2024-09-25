package com.quirely.backend.service;

import com.quirely.backend.dto.WorkspaceCreationDto;
import com.quirely.backend.entity.MemberWorkspaceEntity;
import com.quirely.backend.entity.User;
import com.quirely.backend.entity.Workspace;
import com.quirely.backend.mapper.MemberWorkspaceMapper;
import com.quirely.backend.mapper.WorkspaceMapper;
import com.quirely.backend.repository.MemberWorkspaceRepository;
import com.quirely.backend.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkspaceService {
    private final WorkspaceRepository workspaceRepository;
    private final MemberWorkspaceRepository memberWorkspaceRepository;
    private final WorkspaceMapper workspaceMapper;
    private final MemberWorkspaceMapper memberWorkspaceMapper;

    @Transactional
    public Workspace createWorkspace(WorkspaceCreationDto workspaceDto, User owner) {
        Workspace workspace = workspaceMapper.toEntity(workspaceDto, owner);
        workspace = workspaceRepository.save(workspace);

        MemberWorkspaceEntity memberWorkspace = memberWorkspaceMapper.createEntity(owner, workspace, true);
        memberWorkspaceRepository.save(memberWorkspace);

        return workspace;
    }

    public List<Workspace> getMemberWorkspaces(Long userId, Boolean accepted) {
        return workspaceRepository.findWorkspacesByMemberAndAccepted(userId, accepted)
                .stream()
                .sorted(Comparator.comparing(Workspace::getName))
                .toList();
    }
}
