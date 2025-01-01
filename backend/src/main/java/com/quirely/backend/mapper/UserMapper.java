package com.quirely.backend.mapper;

import com.quirely.backend.dto.FullUserDto;
import com.quirely.backend.dto.UserAcceptanceDto;
import com.quirely.backend.dto.authentication.RegistrationRequest;
import com.quirely.backend.dto.UserDto;
import com.quirely.backend.entity.User;
import com.quirely.backend.model.UserWithAcceptance;
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
                .avatarUrl(user.getAvatarUrl())
                .build();
    }

    public FullUserDto toFullUserDto(User user) {
        return FullUserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .verified(user.isVerified())
                .avatarUrl(user.getAvatarUrl())
                .build();
    }

    public UserAcceptanceDto toDto(UserWithAcceptance userAcceptance) {
        return UserAcceptanceDto.builder()
                .id(userAcceptance.getUser().getId())
                .email(userAcceptance.getUser().getEmail())
                .fullName(userAcceptance.getUser().getFullName())
                .avatarUrl(userAcceptance.getUser().getAvatarUrl())
                .accepted(userAcceptance.getAccepted())
                .build();
    }
}
