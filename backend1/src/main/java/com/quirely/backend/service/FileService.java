package com.quirely.backend.service;

import com.quirely.backend.enums.S3Prefix;
import io.awspring.cloud.s3.S3Resource;
import io.awspring.cloud.s3.S3Template;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileService {
    private final S3Template s3Template;

    @Value("${s3.bucket.name}")
    private String bucket;

    @PostConstruct
    protected void init() {
        if (!s3Template.bucketExists(bucket)) {
            throw new RuntimeException(String.format("Bucket '%s' does not exist", bucket));
        }
    }

    public String uploadFile(MultipartFile file, S3Prefix prefix) throws IOException {
        String originalFilename= file.getOriginalFilename();
        var fileExtension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        var objectKey = prefix.getPrefix() + UUID.randomUUID() + fileExtension;

        log.info("Uploading file {}", objectKey);
        S3Resource upload = s3Template.upload(bucket, objectKey, file.getInputStream());
        log.info("Uploaded file to S3: {}", upload.getURL());

        return upload.getURL().toString();
    }

    public void deleteFile(String fileUrl, S3Prefix prefix) {
        String key = extractObjectKeyFromUrl(fileUrl, prefix);
        log.info("Deleting file {}", key);
        s3Template.deleteObject(bucket, key);
        log.info("Deleted file from S3: {}", key);
    }

    private String extractObjectKeyFromUrl(String fileUrl, S3Prefix prefix) {
        var prefixIndex = fileUrl.indexOf(String.format("/%s", prefix.getPrefix()));
        if (prefixIndex == -1) {
            throw new IllegalArgumentException("File URL does not contain the specified prefix");
        }
        return fileUrl.substring(prefixIndex + 1);
    }
}
