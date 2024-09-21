package com.quirely.backend.mapper;

import com.quirely.backend.dto.RegistrationInputDto;
import com.quirely.backend.dto.UserDto;
import com.quirely.backend.entity.UserEntity;
import com.quirely.backend.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserMapper {

    public User toModel(RegistrationInputDto registrationInputDto) {
        return User.builder()
                .fullName(registrationInputDto.fullName().trim())
                .email(registrationInputDto.email().toLowerCase())
                .password(registrationInputDto.password())
                .build();
    }

    public UserEntity toEntity(User user) {
        return UserEntity.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .password(user.getPassword())
                .verified(user.isVerified())
                .avatarUrl(user.getAvatarUrl())
                .build();
    }

    public User toModel(UserEntity userEntity) {
        return User.builder()
                .id(userEntity.getId())
                .email(userEntity.getEmail())
                .fullName(userEntity.getFullName())
                .password(userEntity.getPassword())
                .verified(userEntity.isVerified())
                .avatarUrl(userEntity.getAvatarUrl())
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
