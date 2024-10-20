package com.quirely.backend.entity;

import com.quirely.backend.utils.DateUtils;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name="users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "email")
    private String email;

    @Column(name = "full_name")
    private String fullName;

    @ToString.Exclude
    @Column(name = "password")
    private String password;

    @Column(name = "is_verified")
    private boolean verified;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @ToString.Exclude
    @OneToMany(mappedBy = "owner")
    private List<Workspace> ownedWorkspaces;

    @ToString.Exclude
    @OneToMany(mappedBy = "member")
    private List<MemberWorkspaceEntity> associatedWorkspaces;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = DateUtils.getCurrentDateTime();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = DateUtils.getCurrentDateTime();
    }

}
