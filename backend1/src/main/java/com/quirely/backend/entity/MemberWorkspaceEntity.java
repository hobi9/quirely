package com.quirely.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "members_workspaces")
public class MemberWorkspaceEntity {
    @EmbeddedId
    private MemberWorkspacePK id;

    @ManyToOne
    @MapsId("memberId")
    @JoinColumn(name = "member_id")
    private User member;

    @ManyToOne
    @MapsId("workspaceId")
    @JoinColumn(name = "workspace_id")
    private Workspace workspace;

    @Column(name= "accepted")
    private Boolean accepted;

    @Data
    @Embeddable
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MemberWorkspacePK implements Serializable {
        @Column(name = "member_id")
        private Long memberId;
        @Column(name = "workspace_id")
        private Long workspaceId;
    }
}
