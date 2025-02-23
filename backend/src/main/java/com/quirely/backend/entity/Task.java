package com.quirely.backend.entity;

import com.quirely.backend.utils.DateUtils;
import jakarta.persistence.*;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "title", nullable = false, length = 60)
    private String title;

    @Column(name = "description")
    private String description;

    @PositiveOrZero
    @Column(name = "task_order", nullable = false)
    private int order;

    @ToString.Exclude
    @ManyToOne(optional = false)
    @JoinColumn(name = "list_id", nullable = false)
    private TaskList list;

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