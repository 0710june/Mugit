package com.ssafy.mugit.domain.message.service;

import com.ssafy.mugit.global.dto.SseMessageDto;

public interface MessageService {
    void send(SseMessageDto<?> sseMessageDto);
}
