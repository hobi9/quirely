package com.quirely.backend.service;

import com.quirely.backend.entity.MemberWorkspaceEntity;
import com.quirely.backend.entity.UserEntity;
import com.quirely.backend.entity.WorkspaceEntity;
import com.quirely.backend.exception.UserNotFoundException;
import com.quirely.backend.mapper.MemberWorkspaceMapper;
import com.quirely.backend.mapper.WorkspaceMapper;
import com.quirely.backend.model.Workspace;
import com.quirely.backend.repository.MemberWorkspaceRepository;
import com.quirely.backend.repository.UserRepository;
import com.quirely.backend.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkspaceService {
    private final WorkspaceRepository workspaceRepository;
    private final UserRepository userRepository;
    private final MemberWorkspaceRepository memberWorkspaceRepository;
    private final WorkspaceMapper workspaceMapper;
    private final MemberWorkspaceMapper memberWorkspaceMapper;


    @Transactional
    public Workspace createWorkspace(Workspace workspace, long userId) {
        UserEntity ownerEntity = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        WorkspaceEntity workspaceEntity = workspaceMapper.toEntity(workspace, ownerEntity);
        WorkspaceEntity savedEntity = workspaceRepository.save(workspaceEntity);

        MemberWorkspaceEntity memberWorkspace = memberWorkspaceMapper.createEntity(ownerEntity, savedEntity);
        memberWorkspaceRepository.save(memberWorkspace);

        return workspaceMapper.toModel(savedEntity);
    }


    public List<Workspace> getMemberWorkspaces(Long userId, Boolean accepted) {
        return workspaceRepository.findWorkspacesByMemberAndAccepted(userId, accepted)
                .stream()
                .map(workspaceMapper::toModel)
                .toList();
    }
}
