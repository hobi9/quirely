package com.quirely.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;

@Data
@AllArgsConstructor
public class BoardImage implements Serializable {
    private String id;
    private String url;
    private String description;
}
