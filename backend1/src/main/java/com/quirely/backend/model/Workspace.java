package com.quirely.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Workspace {
    private Long id;
    private String name;
    private String description;
    private String logoUrl;
}
