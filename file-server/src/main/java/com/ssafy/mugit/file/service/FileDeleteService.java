package com.ssafy.mugit.file.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@Slf4j
public class FileDeleteService {

    @Value("${upload-path}")
    private String UPLOAD_PATH;

    public void fileDelete(List<String> list) {
        for (String path : getNotExistedList(list, getFilePath())) {
            log.info("[Not Existed File] {}", path);
            File file = new File(path);
            if (!file.delete()) {
                log.error("[File Delete Error] 삭제 실패 : {}", path);
            }
        }
    }

    private List<String> getFilePath() {
        try (Stream<Path> stream = Files.walk(Paths.get(UPLOAD_PATH))) {
            return stream.filter(Files::isRegularFile)
                    .filter(path -> !path.startsWith(Paths.get(UPLOAD_PATH + "default")))
                    .map(Path::toAbsolutePath)
                    .map(Path::toString)
                    .collect(Collectors.toList());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private List<String> getNotExistedList(List<String> paths, List<String> localPaths) {
        List<String> notExisted = new ArrayList<>();
        for (String localPath : localPaths) {
            if (!paths.contains(localPath)) {
                notExisted.add(localPath);
            }
        }
        return notExisted;
    }
}
