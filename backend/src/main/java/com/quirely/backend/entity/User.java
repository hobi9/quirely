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

    @Column(name = "email", nullable = false, length = 254)
    private String email;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @ToString.Exclude
    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "is_verified", nullable = false)
    private boolean verified;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @ToString.Exclude
    @OneToMany(mappedBy = "owner")
    private List<Workspace> ownedWorkspaces;

    @ToString.Exclude
    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MemberWorkspace> associatedWorkspaces;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    private void onCreate() {
        createdAt = DateUtils.getCurrentDateTime();
    }

    @PreUpdate
    private void onUpdate() {
        updatedAt = DateUtils.getCurrentDateTime();
    }

}
