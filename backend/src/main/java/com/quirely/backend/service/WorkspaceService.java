package com.quirely.backend.service;

import com.quirely.backend.enums.S3Prefix;
import com.quirely.backend.dto.workspace.MemberInvitationRequest;
import com.quirely.backend.dto.workspace.WorkspaceCreationRequest;
import com.quirely.backend.entity.MemberWorkspaceEntity;
import com.quirely.backend.entity.User;
import com.quirely.backend.entity.Workspace;
import com.quirely.backend.exception.types.*;
import com.quirely.backend.mapper.MemberWorkspaceMapper;
import com.quirely.backend.mapper.WorkspaceMapper;
import com.quirely.backend.model.UserWithAcceptance;
import com.quirely.backend.repository.MemberWorkspaceRepository;
import com.quirely.backend.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WorkspaceService {
    private final WorkspaceRepository workspaceRepository;
    private final MemberWorkspaceRepository memberWorkspaceRepository;
    private final UserService userService;
    private final FileService fileService;
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
        Workspace workspace = workspaceRepository.findWorkspaceByIdAndMember(workspaceId, owner.getId())
                .orElseThrow(WorkspaceNotFoundException::new);

        workspace.setName(request.name());
        workspace.setDescription(request.description());
        return workspaceRepository.save(workspace);
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
            throw new NotWorkspaceOwnerException();
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
            throw new InvitationAlreadyConfirmedException();
        }
        membership.setAccepted(accepted);
        memberWorkspaceRepository.save(membership);
    }

    public List<UserWithAcceptance> getWorkspaceMembers(Long workspaceId, Long userId) {
        workspaceRepository.findWorkspaceByIdAndMember(workspaceId, userId)
                .orElseThrow(WorkspaceNotFoundException::new);
        return memberWorkspaceRepository.getWorkspaceMembers(workspaceId)
                .stream()
                .map(userAcceptance -> {
                    User member = (User) userAcceptance[0];
                    Boolean accepted = (Boolean) userAcceptance[1];
                    return UserWithAcceptance.builder()
                            .user(member)
                            .accepted(accepted)
                            .build();
                })
                .toList();
    }

    public void inviteMember(MemberInvitationRequest request, Long workspaceId, User user) {
        if (request.email().equalsIgnoreCase(user.getEmail())) {
            throw new SelfActionNotAllowedException("You can't invite yourself");
        }
        Workspace workspace = workspaceRepository.findWorkspaceByIdAndMember(workspaceId, user.getId())
                .orElseThrow(WorkspaceNotFoundException::new);
        if (!workspace.getOwner().getId().equals(user.getId())) {
            throw new NotWorkspaceOwnerException();
        }
        User member = userService.findUserByEmail(request.email())
                .orElseThrow(UserNotFoundException::new);

        MemberWorkspaceEntity memberWorkspace = MemberWorkspaceEntity
                .builder()
                .id(new MemberWorkspaceEntity.MemberWorkspacePK(member.getId(), workspace.getId()))
                .member(member)
                .workspace(workspace)
                .build();
        memberWorkspaceRepository.save(memberWorkspace);
    }

    public void kickMember(Long workspaceId,Long memberId, Long userId) {
        if (memberId.equals(userId)) {
            throw new SelfActionNotAllowedException("You can't kick yourself.");
        }
        Workspace workspace = workspaceRepository.findWorkspaceByIdAndMember(workspaceId, userId)
                .orElseThrow(WorkspaceNotFoundException::new);
        if (!workspace.getOwner().getId().equals(userId)) {
            throw new NotWorkspaceOwnerException();
        }
        userService.findUserById(memberId)
                .orElseThrow(UserNotFoundException::new);
        memberWorkspaceRepository.deleteMembership(memberId, workspaceId);
    }

    public String uploadLogo(Long workspaceId, Long userId, MultipartFile file) throws IOException {
        Workspace workspace = workspaceRepository.findWorkspaceByIdAndMember(workspaceId, userId)
                .orElseThrow(WorkspaceNotFoundException::new);

        if (!workspace.getOwner().getId().equals(userId)) {
            throw new NotWorkspaceOwnerException();
        }
        String oldLogoUrl = workspace.getLogoUrl();

        String logoUrl = fileService.uploadFile(file, S3Prefix.WORKSPACE_LOGO);
        workspace.setLogoUrl(logoUrl);
        workspaceRepository.save(workspace);

        if (StringUtils.isNotBlank(oldLogoUrl)) {
            fileService.deleteFile(oldLogoUrl, S3Prefix.WORKSPACE_LOGO);
        }

        return logoUrl;
    }
}
