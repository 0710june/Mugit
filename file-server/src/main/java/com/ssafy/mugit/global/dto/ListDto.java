package com.ssafy.mugit.global.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ListDto {
    private List<?> list;
}
