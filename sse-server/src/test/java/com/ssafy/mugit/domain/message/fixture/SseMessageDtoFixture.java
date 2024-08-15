package com.ssafy.mugit.domain.message.fixture;

import com.ssafy.mugit.global.dto.NotificationDto;
import com.ssafy.mugit.global.dto.SseMessageDto;
import com.ssafy.mugit.domain.sse.service.SseEvent;
import lombok.AllArgsConstructor;

import static com.ssafy.mugit.domain.message.NotificationType.FOLLOW;

@AllArgsConstructor
public enum SseMessageDtoFixture {
    MESSAGE_DTO_01(1L, SseEvent.FOLLOW, new NotificationDto(1L, 1L, 2L, 2L, Object.class, FOLLOW, FOLLOW.getMessage()));

    private Long userId;
    private SseEvent event;
    private Object message;

    public SseMessageDto<NotificationDto> getFixture() {
        return new SseMessageDto<NotificationDto>(userId, event, (NotificationDto)message);
    }
}
