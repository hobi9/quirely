package com.quirely.backend.entity;

import com.quirely.backend.utils.DateUtils;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

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

  @Column(name = "title")
  private String title;

  @Column(name = "thumbnail_url")
  private String thumbnailUrl;

  @Column(name = "full_url")
  private String fulllUrl;

  @ManyToOne
  @ToString.Exclude
  @JoinColumn(name = "workspace_id")
  private Workspace workspace;

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