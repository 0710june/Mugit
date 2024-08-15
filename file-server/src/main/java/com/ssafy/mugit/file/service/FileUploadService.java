package com.ssafy.mugit.file.service;

import com.ssafy.mugit.file.dto.FilePathDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileUploadService {

    private final RedisTemplate<String, Object> redisTemplate;
    @Value("${upload-path}")
    private String uploadPath;

    public List<FilePathDto> uploadFile(MultipartFile image, List<MultipartFile> sources) {
        try {
            List<FilePathDto> paths = new ArrayList<>();

            if (sources != null && !sources.isEmpty()) {
                for (MultipartFile file : sources) {
                    paths.add(saveFile("source", file));
                }
            }

            if (image != null) {
                paths.add(saveFile("image", image));
            }

            return paths;
        } catch (IOException e) {
            throw new RuntimeException("Directory Create Error");
        }
    }

    private FilePathDto saveFile(String type, MultipartFile file) throws IOException {
        String originName = file.getOriginalFilename();
        String extension = originName != null ? getExtension(originName) : "";
        String uuidName = UUID.randomUUID() + extension;

        Path path = Paths.get(uploadPath + uuidName);
        Files.createDirectories(path.getParent());
        file.transferTo(path);

        String url = "https://mugit.site/files/";
        return new FilePathDto(type, originName, url + uuidName);
    }

    private String getExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf(".");
        return lastDotIndex != -1 ? filename.substring(lastDotIndex) : "";
    }
}
