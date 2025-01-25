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
@Table(name = "boards")
public class Board {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @Column(name = "title", nullable = false, length = 60)
  private String title;

  @Column(name = "thumbnail_url", nullable = false)
  private String thumbnailUrl;

  @Column(name = "full_url", nullable = false)
  private String fullUrl;

  @ManyToOne(optional = false)
  @ToString.Exclude
  @JoinColumn(name = "workspace_id")
  private Workspace workspace;

  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @Column(name = "updated_at", insertable = false)
  private LocalDateTime updatedAt;

  @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<TaskList> taskLists;

  @PrePersist
  private void onCreate() {
    createdAt = DateUtils.getCurrentDateTime();
  }

  @PreUpdate
  private void onUpdate() {
    updatedAt = DateUtils.getCurrentDateTime();
  }

}