package com.ssafy.mugit.domain.exception.error;


import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum SseError {
    SSE_EMITTER_NOT_FOUND("Emitter를 찾을 수 없습니다."),
    EXCEED_SSE_EMITTER_TIMEOUT("Emitter timeout 시간이 지나 메시지를 보관할 수 없습니다."),
    SSE_QUEUE_CONTAINER_NOT_FOUND("SseQueueContainer를 찾을 수 없습니다."),
    ALREADY_EXIST_CONNECTION("이미 SSE가 연결되어 있습니다.");

    private final String message;
}
