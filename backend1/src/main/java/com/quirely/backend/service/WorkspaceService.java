package com.quirely.backend.service;

import com.quirely.backend.dto.MemberInvitationRequest;
import com.quirely.backend.dto.WorkspaceCreationRequest;
import com.quirely.backend.entity.MemberWorkspaceEntity;
import com.quirely.backend.entity.User;
import com.quirely.backend.entity.Workspace;
import com.quirely.backend.exception.UserNotFoundException;
import com.quirely.backend.exception.WorkspaceNotFoundException;
import com.quirely.backend.mapper.MemberWorkspaceMapper;
import com.quirely.backend.mapper.WorkspaceMapper;
import com.quirely.backend.repository.MemberWorkspaceRepository;
import com.quirely.backend.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WorkspaceService {
    private final WorkspaceRepository workspaceRepository;
    private final MemberWorkspaceRepository memberWorkspaceRepository;
    private final UserService userService;
    private final WorkspaceMapper workspaceMapper;
    private final MemberWorkspaceMapper memberWorkspaceMapper;

    @Transactional
    public Workspace createWorkspace(WorkspaceCreationRequest request, User owner) {
        Workspace workspace = workspaceMapper.toEntity(request, owner);
        workspace = workspaceRepository.save(workspace);

        MemberWorkspaceEntity memberWorkspace = memberWorkspaceMapper.createEntity(owner, workspace, true);
        memberWorkspaceRepository.save(memberWorkspace);

        return workspace;
    }

    public Workspace updateWorkspace(Long workspaceId, WorkspaceCreationRequest request, User owner) {
        Optional<Workspace> workspace = workspaceRepository.findWorkspaceByIdAndOwner(workspaceId, owner.getId());
        if (workspace.isEmpty()) {
            throw new WorkspaceNotFoundException();
        }
        Workspace workspaceToUpdate = workspace.get();
        workspaceToUpdate.setName(request.name());
        workspaceToUpdate.setDescription(request.description());
        return workspaceRepository.save(workspaceToUpdate);
    }

    public List<Workspace> getMemberWorkspaces(Long userId, Boolean accepted) {
        return workspaceRepository.findWorkspacesByMemberAndAccepted(userId, accepted);
    }

    public Workspace getWorkspace(Long workspaceId, Long userId) {
        return workspaceRepository.findWorkspaceByIdAndMember(workspaceId, userId)
                .orElseThrow(WorkspaceNotFoundException::new);
    }

    public void deleteWorkspace(Long workspaceId, Long userId) {
        Workspace workspace = workspaceRepository.findWorkspaceByIdAndMember(workspaceId, userId)
                .orElseThrow(WorkspaceNotFoundException::new);
        if (!workspace.getOwner().getId().equals(userId)) {
            throw new RuntimeException("You are not the owner of this workspace"); //TODO: change with custom exception
        }
        workspaceRepository.delete(workspace);
    }

    @Transactional
    public void leaveWorkspace(Long workspaceId, Long userId) {
        Workspace workspace = workspaceRepository.findWorkspaceByIdAndMember(workspaceId, userId)
                .orElseThrow(WorkspaceNotFoundException::new);

        Optional<MemberWorkspaceEntity> newOwner = memberWorkspaceRepository.findNewOwner(userId, workspaceId);
        if (newOwner.isEmpty()) {
            workspaceRepository.delete(workspace);
            return;
        }
        memberWorkspaceRepository.deleteMembership(userId, workspaceId);
        workspace.setOwner(newOwner.get().getMember());
        workspaceRepository.save(workspace);
    }

    public void confirmInvitation(Long workspaceId, Long userId, boolean accepted) {
        MemberWorkspaceEntity.MemberWorkspacePK key = MemberWorkspaceEntity.MemberWorkspacePK
                .builder()
                .workspaceId(workspaceId)
                .memberId(userId)
                .build();
        MemberWorkspaceEntity membership = memberWorkspaceRepository.findById(key)
                .orElseThrow(WorkspaceNotFoundException::new);
        if (membership.getAccepted() != null) {
            throw new RuntimeException("You have already confirmed the invitation to this workspace."); //TODO: change with custom exception
        }
        membership.setAccepted(accepted);
        memberWorkspaceRepository.save(membership);
    }

    public List<User> getWorkspaceMembers(Long workspaceId, Long userId) {
        workspaceRepository.findWorkspaceByIdAndMember(workspaceId, userId)
                .orElseThrow(WorkspaceNotFoundException::new);
        return memberWorkspaceRepository.getWorkspaceMembers(workspaceId);
    }

    public void inviteMember(MemberInvitationRequest request, Long workspaceId, User user) {
        if (request.email().equalsIgnoreCase(user.getEmail())) {
            throw new RuntimeException("You can't invite yourself.");  //TODO: change with custom exception
        }
        Workspace workspace = workspaceRepository.findWorkspaceByIdAndMember(workspaceId, user.getId())
                .orElseThrow(WorkspaceNotFoundException::new);
        if (!workspace.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("You are not the owner of this workspace"); //TODO: change with custom exception
        }
        User member = userService.findUserByEmail(request.email())
                .orElseThrow(UserNotFoundException::new);

        MemberWorkspaceEntity memberWorkspace = MemberWorkspaceEntity
                .builder()
                .member(member)
                .workspace(workspace)
                .build();
        memberWorkspaceRepository.save(memberWorkspace);
    }

    public void kickMember(Long workspaceId,Long memberId, Long userId) {
        if (memberId.equals(userId)) {
            throw new RuntimeException("You can't kick yourself.");  //TODO: change with custom exception
        }
        Workspace workspace = workspaceRepository.findWorkspaceByIdAndMember(workspaceId, userId)
                .orElseThrow(WorkspaceNotFoundException::new);
        if (!workspace.getOwner().getId().equals(userId)) {
            throw new RuntimeException("You are not the owner of this workspace"); //TODO: change with custom exception
        }
        userService.findUserById(memberId)
                .orElseThrow(UserNotFoundException::new);
        memberWorkspaceRepository.deleteMembership(memberId, workspaceId);
    }
}
