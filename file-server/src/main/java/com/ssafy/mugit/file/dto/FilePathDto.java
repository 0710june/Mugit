package com.ssafy.mugit.file.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FilePathDto {
    private String type;
    private String name;
    private String path;
}
