package com.quirely.backend.service;

import com.quirely.backend.mapper.UserMapper;
import com.quirely.backend.entity.UserEntity;
import com.quirely.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final UserRepository userRepository;

    public Optional<User> findUserByEmail(String email) {
        Optional<UserEntity> userByEmail = userRepository.findByEmail(email);
        return userByEmail.map(userMapper::toModel);
    }

    public Optional<User> findUserById(Long id) {
        Optional<UserEntity> userByEmail = userRepository.findById(id);
        return userByEmail.map(userMapper::toModel);
    }

    public User createUser(User user) {
        UserEntity entity = userMapper.toEntity(user);
        entity.setPassword(passwordEncoder.encode(user.getPassword()));


        UserEntity savedUser = userRepository.save(entity);
        return userMapper.toModel(savedUser);
    }

    public boolean comparePassword(User user, String password) {
        return passwordEncoder.matches(password, user.getPassword());
    }
}
