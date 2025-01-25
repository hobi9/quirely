package com.quirely.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "members_workspaces")
public class MemberWorkspace {
    @EmbeddedId
    private MemberWorkspacePK id;

    @ManyToOne(optional = false)
    @ToString.Exclude
    @MapsId("memberId")
    @JoinColumn(name = "member_id")
    private User member;

    @ManyToOne(optional = false)
    @ToString.Exclude
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
        @Column(name = "member_id", nullable = false)
        private Long memberId;
        @Column(name = "workspace_id", nullable = false)
        private Long workspaceId;
    }
}
