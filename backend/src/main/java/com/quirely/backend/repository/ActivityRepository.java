package com.quirely.backend.repository;

import com.quirely.backend.entity.Activity;
import com.quirely.backend.enums.ActivityEntityType;
import org.springframework.data.domain.Limit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {

    List<Activity> findActivitiesByWorkspace_IdOrderByCreatedAtDesc(Long workspaceId);

    List<Activity> findByEntityIdAndEntityTypeOrderByCreatedAtDesc(Long entityId, ActivityEntityType entityType, Limit limit);
}
