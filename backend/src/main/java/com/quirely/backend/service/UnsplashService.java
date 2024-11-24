package com.quirely.backend.service;

import com.quirely.backend.model.BoardImage;
import com.quirely.openapi.model.UnsplashPhoto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Objects;

@Service
public class UnsplashService {
    private final RestClient restClient;

    public UnsplashService(RestClient.Builder restClientBuilder, @Value("${unsplash.base-url}") String baseUrl, @Value("${unsplash.access-key}") String accessKey) {
        this.restClient = restClientBuilder
                .baseUrl(baseUrl)
                .defaultHeader("Authorization", String.format("Client-ID %s", accessKey))
                .build();
    }

    public List<BoardImage> getBoardImages() {
        List<UnsplashPhoto>body = restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/photos/random")
                        .queryParam("collections", "317099")
                        .queryParam("count", "9")
                        .build()
                )
                .header("Accept-Version", "v1")
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});

        Objects.requireNonNull(body);

        return body
                .stream()
                .filter(Objects::nonNull)
                .map(photo -> new BoardImage(photo.getId(), photo.getUrls().getThumb().toString()))
                .toList();
    }
}
