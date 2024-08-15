package com.ssafy.mugit.global.dto;

import com.ssafy.mugit.domain.sse.service.SseEvent;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class SseMessageDto<T> {
    private Long userId;
    private SseEvent event;
    private T message;
}