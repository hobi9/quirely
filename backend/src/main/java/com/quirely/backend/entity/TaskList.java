package com.quirely.backend.entity;

import com.quirely.backend.utils.DateUtils;
import jakarta.persistence.*;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "lists")
public class TaskList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "title", nullable = false, length = 50)
    private String title;

    @PositiveOrZero
    @Column(name = "task_list_order", nullable = false)
    private int order;

    @Version
    @Column(name = "version", nullable = false)
    private int version;

    @ToString.Exclude
    @ManyToOne(optional = false)
    @JoinColumn(name = "board_id", nullable = false)
    private Board board;

    @ToString.Exclude
    @OneToMany(mappedBy = "list", orphanRemoval = true, cascade = CascadeType.PERSIST)
    @OrderBy("order ASC")
    private List<Task> tasks;

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