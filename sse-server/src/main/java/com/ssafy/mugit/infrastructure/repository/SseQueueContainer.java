package com.ssafy.mugit.infrastructure.repository;

import com.ssafy.mugit.global.dto.SseMessageDto;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.LinkedList;
import java.util.Queue;

@Getter
@Slf4j
public class SseQueueContainer {

    private final Queue<SseMessageDto<?>> messageQueue;

    @Setter
    private Long lastEmitterCreateTime;
    private SseEmitter sseEmitter;

    public SseQueueContainer(SseEmitter emitter) {
        this.sseEmitter = emitter;
        this.messageQueue = new LinkedList<>();
        this.lastEmitterCreateTime = System.currentTimeMillis();
    }

    public void changeEmitter(SseEmitter emitter) {
        this.sseEmitter = emitter;
        this.lastEmitterCreateTime = System.currentTimeMillis();
    }

    public void poll(Long userId) throws IOException {
        while (!messageQueue.isEmpty()) {
            SseMessageDto<?> sseMessageDto = messageQueue.poll();
            sseEmitter.send(SseEmitter.event()
                    .id(userId.toString())
                    .name(sseMessageDto.getEvent().getEventName())
                    .data(sseMessageDto.getMessage()));
            log.info("message 전송완료 : {}", sseMessageDto.getMessage());
        }
    }

    public void deleteEmitter() {
        this.sseEmitter = null;
    }
}
