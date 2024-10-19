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
@Table(name = "workspaces")
public class Workspace {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "logo_url")
    private String logoUrl;

    @ManyToOne
    @ToString.Exclude
    @JoinColumn(name = "owner_id")
    private User owner;

    @ToString.Exclude
    @OneToMany(mappedBy = "workspace")
    private List<MemberWorkspaceEntity> members;

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
