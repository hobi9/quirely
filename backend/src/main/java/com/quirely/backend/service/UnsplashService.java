package com.quirely.backend.service;

import com.quirely.backend.model.BoardImage;
import com.quirely.openapi.model.UnsplashPhoto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Objects;

import static com.quirely.backend.constants.CacheConstants.BOARD_IMAGE_CACHE;

@Service
public class UnsplashService {
    private static final String RANDOM_PHOTOS_PATH = "/photos/random";
    private static final String ACCEPT_VERSION_HEADER = "Accept-Version";
    private static final String ACCEPT_VERSION = "v1";

    private final RestClient restClient;

    public UnsplashService(RestClient.Builder restClientBuilder, @Value("${unsplash.base-url}") String baseUrl,
                           @Value("${unsplash.access-key}") String accessKey) {
        this.restClient = restClientBuilder
                .baseUrl(baseUrl)
                .defaultHeader("Authorization", String.format("Client-ID %s", accessKey))
                .build();
    }

    @Cacheable(value = BOARD_IMAGE_CACHE, key = "#root.methodName")
    public List<BoardImage> getBoardImages() {
        List<UnsplashPhoto>body = restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path(RANDOM_PHOTOS_PATH)
                        .queryParam("collections", "317099")
                        .queryParam("count", "9")
                        .build()
                )
                .header(ACCEPT_VERSION_HEADER, ACCEPT_VERSION)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});

        Objects.requireNonNull(body);

        return body
                .stream()
                .filter(Objects::nonNull)
                .map(photo -> new BoardImage(photo.getId(), photo.getUrls().getThumb().toString(), photo.getDescription()))
                .toList();
    }
}
