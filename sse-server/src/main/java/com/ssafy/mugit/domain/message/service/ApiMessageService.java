package com.ssafy.mugit.domain.message.service;

import com.ssafy.mugit.global.dto.SseMessageDto;
import com.ssafy.mugit.domain.sse.service.SseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service("ApiMessageService")
@Slf4j
@RequiredArgsConstructor
public class ApiMessageService implements MessageService {

    private final SseService sseService;

    @Override
    public void send(SseMessageDto<?> sseMessageDto) {
        try {
            Long userId = sseMessageDto.getUserId();
            log.info("사용자 {}에게 알림을 전송합니다.", userId);
            sseService.send(userId, sseMessageDto);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
