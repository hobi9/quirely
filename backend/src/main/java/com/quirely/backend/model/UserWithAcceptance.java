package com.quirely.backend.model;

import com.quirely.backend.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserWithAcceptance {
    private User user;
    private Boolean accepted;
}
