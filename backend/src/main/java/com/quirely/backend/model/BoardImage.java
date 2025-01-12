package com.quirely.backend.model;

import lombok.Builder;
import lombok.Data;

import java.io.Serializable;

@Data
@Builder
public class BoardImage implements Serializable {
    private String id;
    private String thumbnailUrl;
    private String fullUrl;
    private String description;
}
