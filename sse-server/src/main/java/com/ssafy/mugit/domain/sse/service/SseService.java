package com.ssafy.mugit.domain.sse.service;

import com.ssafy.mugit.domain.exception.SseException;
import com.ssafy.mugit.infrastructure.dto.ConnectionDto;
import com.ssafy.mugit.global.dto.SseMessageDto;
import com.ssafy.mugit.infrastructure.repository.SseQueueContainer;
import com.ssafy.mugit.infrastructure.repository.SseQueueContainerRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;

import static com.ssafy.mugit.domain.exception.error.SseError.*;
import static com.ssafy.mugit.domain.sse.service.SseEvent.CONNECT;

@Service
@Slf4j
public class SseService {

    private final Long EMITTER_TIMEOUT;
    private final SseQueueContainerRepository sseQueueContainerRepository;

    public SseService(@Value("${emitter.timeout}") Long emitterTimeout,
                      @Autowired SseQueueContainerRepository sseQueueContainerRepository) {
        EMITTER_TIMEOUT = emitterTimeout;
        this.sseQueueContainerRepository = sseQueueContainerRepository;
    }

    public SseEmitter subscribe(Long userId) throws IOException {

        // SSE 연결이 만료 전이면 기존연결 완료하기
        if (sseQueueContainerRepository.existsById(userId)) {
            SseQueueContainer sseContainer = sseQueueContainerRepository.findById(userId);
            if (sseContainer.getSseEmitter() != null) sseContainer.getSseEmitter().complete();
        }

        SseEmitter emitter = new SseEmitter(EMITTER_TIMEOUT);
        SseQueueContainer sseQueueContainer = sseQueueContainerRepository.save(userId, emitter);
        return subscribeNewSse(userId, sseQueueContainer);
    }

    public SseEmitter subscribeNewSse(long userId, SseQueueContainer sseContainer) throws IOException {
        // handler
        addHandler(userId, sseContainer.getSseEmitter());

        // connection 전송
        send(userId, sseContainer, new SseMessageDto<ConnectionDto>(userId, CONNECT, new ConnectionDto()));

        // polling 시도
        attemptPolling(userId, sseContainer);
        return sseContainer.getSseEmitter();
    }

    public void send(Long userId, SseQueueContainer sseQueueContainer, SseMessageDto<?> message) throws SseException {
        try {
            SseEmitter sseEmitter = sseQueueContainer.getSseEmitter();
            if (sseEmitter == null) throw new SseException(SSE_EMITTER_NOT_FOUND);
            sseEmitter.send(SseEmitter.event()
                    .id(String.valueOf(userId))
                    .name(message.getEvent().getEventName())
                    .data(message));
            log.info("message 전송완료 : {}", message);
        } catch (SseException e) {
            if (System.currentTimeMillis() - sseQueueContainer.getLastEmitterCreateTime() > EMITTER_TIMEOUT) {
                throw new SseException(EXCEED_SSE_EMITTER_TIMEOUT);
            }
            sseQueueContainer.getMessageQueue().offer(message);
        } catch (IOException e) {
            sseQueueContainer.getMessageQueue().offer(message);
            throw new RuntimeException();
        }
    }

    public void send(Long userId, SseMessageDto<?> message) throws IOException {
        SseQueueContainer sseContainer = sseQueueContainerRepository.findById(userId);

        // 예외처리 : SSE Container를 찾지 못했을 때 오류 출력
        if (sseContainer == null) {
            SseEmitter emitter = new SseEmitter(EMITTER_TIMEOUT);
            SseQueueContainer sseQueueContainer = sseQueueContainerRepository.save(userId, emitter);
            throw new SseException(SSE_QUEUE_CONTAINER_NOT_FOUND);
        }

            // 예외처리 2 : SSE를 찾지 못했을 때 Queue에 저장
        else if (sseContainer.getSseEmitter() == null || sseContainer.getSseEmitter().getTimeout() == null) {
            sseContainer.getMessageQueue().offer(message);
            log.info("SSE 연결 없음, 메시지 큐에 저장 완료");
        }

            // 전송
        else send(userId, sseContainer, message);
    }

    // Timeout 이전에 생성된 알림 polling 시도
    public void attemptPolling(long userId, SseQueueContainer sseContainer) throws IOException {
        if (sseContainer.getSseEmitter().getTimeout() != null && System.currentTimeMillis() - sseContainer.getLastEmitterCreateTime() < sseContainer.getSseEmitter().getTimeout()) {
            sseContainer.poll(userId);
        }
    }

    public SseEmitter complete(Long userId) {
        SseQueueContainer sseContainer = sseQueueContainerRepository.findById(userId);
        SseEmitter sseEmitter = sseContainer.getSseEmitter();
        if (sseEmitter != null) {
            sseEmitter.complete();
            return sseEmitter;
        }
        else throw new SseException(SSE_EMITTER_NOT_FOUND);
    }

    private void addHandler(long userId, SseEmitter emitter) {
        emitter.onCompletion(() -> {
            log.info("user{}'s emitter complete", userId);
        });
        emitter.onTimeout(() -> {
            log.info("user{}'s emitter timeout", userId);
            sseQueueContainerRepository.deleteEmitterById(userId);
        });
        emitter.onError((error) -> {
            log.error("user{}'s emitter have error : {}", userId, error.getMessage());
            sseQueueContainerRepository.deleteEmitterById(userId);
        });
    }
}
