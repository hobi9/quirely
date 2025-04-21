package com.quirely.backend.mapper;

import com.quirely.backend.dto.ActivityDto;
import com.quirely.backend.entity.Activity;
import com.quirely.backend.utils.DateUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ActivityMapper {
    private final UserMapper userMapper;

    public ActivityDto toDto(Activity activity) {
        return ActivityDto.builder()
                .id(activity.getId())
                .action(activity.getAction())
                .entityType(activity.getEntityType())
                .user(userMapper.toDto(activity.getUser()))
                .entityTitle(activity.getEntityTitle())
                .createdAt(DateUtils.toTimestamp(activity.getCreatedAt()))
                .build();
    }
}
