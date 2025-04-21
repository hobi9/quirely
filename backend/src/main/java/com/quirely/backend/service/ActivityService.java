package com.quirely.backend.service;

import com.quirely.backend.entity.Activity;
import com.quirely.backend.entity.User;
import com.quirely.backend.entity.Workspace;
import com.quirely.backend.enums.ActivityAction;
import com.quirely.backend.enums.ActivityEntityType;
import com.quirely.backend.repository.ActivityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Limit;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ActivityService {
    private final ActivityRepository activityRepository;

    public List<Activity> findByWorkspaceId(Long workspaceId) {
        return activityRepository.findActivitiesByWorkspace_IdOrderByCreatedAtDesc(workspaceId);

    }

    public List<Activity> findByEntityIdAndEntityType(Long entityId, ActivityEntityType entityType, Integer limit) {
        return activityRepository.findByEntityIdAndEntityTypeOrderByCreatedAtDesc(entityId, entityType, limit == null ? Limit.unlimited() : Limit.of(limit));

    }

    public void createActivity(Workspace workspace, ActivityAction action, ActivityEntityType entityType, User user, String entityTitle, Long entityId) {
        var activity = Activity.builder()
                .workspace(workspace)
                .action(action)
                .entityType(entityType)
                .entityTitle(entityTitle)
                .user(user)
                .entityId(entityId)
                .build();

        try {
            activityRepository.save(activity);
        } catch (Exception e) {
            log.error("Error while creating activity", e);
        }
    }


}
