package com.ssafy.mugit.record.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RecordRequestDto {
    private String message;
    private List<PreSourceDto> preSources;
    private List<NewSourceDto> newSources;
}
