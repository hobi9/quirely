package com.quirely.backend.controller;

import com.quirely.backend.dto.UploadFileResponse;
import com.quirely.backend.dto.UserDto;
import com.quirely.backend.dto.user.UpdateUserRequest;
import com.quirely.backend.entity.User;
import com.quirely.backend.exception.types.InvalidFileUploadException;
import com.quirely.backend.mapper.UserMapper;
import com.quirely.backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
@Tag(name = "User Management", description = "Operations related to user management, including uploading avatars and filtering users.")
public class UserController {
    private final UserService userService;
    private final UserMapper userMapper;

    @PutMapping(value = "/avatar", consumes = "multipart/form-data")
    @Operation(summary = "Upload user avatar", description = "Uploads a new avatar for the authenticated user. Only image files are accepted.")
    public ResponseEntity<UploadFileResponse> uploadAvatar(@RequestParam("file") @NotNull MultipartFile multipartFile,
                                                           @AuthenticationPrincipal User user) throws IOException {

        if (multipartFile.isEmpty()) {
            throw new InvalidFileUploadException("File must not be empty");
        }
        String contentType = multipartFile.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new InvalidFileUploadException("Invalid content type: " + contentType);
        }

        String url = userService.uploadAvatar(user, multipartFile);

        return ResponseEntity.ok().body(new UploadFileResponse(url));
    }

    @GetMapping
    @Operation(summary = "Filter users",
            description = "Retrieves a list of users based on the provided filters. You can filter users by email and workspace ID.")
    public ResponseEntity<List<UserDto>> filterUsers(@RequestParam(defaultValue = "", required = false) String email,
                                                     @RequestParam(defaultValue = "0", required = false) Long workspaceId,
                                                     @AuthenticationPrincipal User user) {

        List<UserDto> users = userService.findUserByFilters(user.getId(), workspaceId, email)
                .stream()
                .map(userMapper::toDto)
                .toList();
        return ResponseEntity.ok(users);
    }

    @PutMapping
    public ResponseEntity<UserDto> updateUser(@RequestBody @Valid UpdateUserRequest request, @AuthenticationPrincipal User user) {
        User updatedUser = userService.updateUser(request, user);
        return ResponseEntity.ok(userMapper.toFullUserDto(updatedUser));
    }
}
