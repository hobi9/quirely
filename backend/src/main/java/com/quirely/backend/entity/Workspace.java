package com.quirely.backend.entity;

import com.quirely.backend.utils.DateUtils;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.LinkedList;
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

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "logo_url")
    private String logoUrl;

    @ManyToOne(optional = false)
    @ToString.Exclude
    @JoinColumn(name = "owner_id")
    private User owner;

    @ToString.Exclude
    @OneToMany(mappedBy = "workspace", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MemberWorkspace> members;

    @ToString.Exclude
    @OneToMany(mappedBy = "workspace", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Board> associatedBoards;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "workspace", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Activity> activities = new LinkedList<>();

    @PrePersist
    private void onCreate() {
        createdAt = DateUtils.getCurrentDateTime();
    }

    @PreUpdate
    private void onUpdate() {
        updatedAt = DateUtils.getCurrentDateTime();
    }
}
