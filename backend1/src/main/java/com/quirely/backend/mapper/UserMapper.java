package com.quirely.backend.mapper;

import com.quirely.backend.dto.RegistrationRequest;
import com.quirely.backend.dto.UserDto;
import com.quirely.backend.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserMapper {

    public User toEntity(RegistrationRequest registrationInputDto) {
        return User.builder()
                .fullName(registrationInputDto.fullName().trim())
                .email(registrationInputDto.email().toLowerCase())
                .password(registrationInputDto.password())
                .build();
    }

    public UserDto toDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .verified(user.isVerified())
                .avatarUrl(user.getAvatarUrl())
                .build();
    }
}
