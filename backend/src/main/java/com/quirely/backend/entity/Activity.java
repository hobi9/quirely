package com.quirely.backend.entity;

import com.quirely.backend.enums.ActivityAction;
import com.quirely.backend.enums.ActivityEntityType;
import com.quirely.backend.utils.DateUtils;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@Entity
@Builder
@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
@Table(name = "activities")
public class Activity implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ToString.Exclude
    @ManyToOne(optional = false)
    @JoinColumn(name = "workspace_id", nullable = false)
    private Workspace workspace;

    @Enumerated(EnumType.STRING)
    @Column(name = "action", nullable = false)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private ActivityAction action;

    @Enumerated(EnumType.STRING)
    @Column(name = "entity_type", nullable = false)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private ActivityEntityType entityType;

    @ToString.Exclude
    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "entity_title", nullable = false)
    private String entityTitle;

    @Column(name = "entity_id", nullable = false)
    private Long entityId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    private void onCreate() {
        createdAt = DateUtils.getCurrentDateTime();
    }

}
