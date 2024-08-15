package com.ssafy.mugit.infrastructure.redis;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.mugit.global.dto.NotificationDto;
import com.ssafy.mugit.domain.message.fixture.SseMessageDtoFixture;
import com.ssafy.mugit.global.dto.SseMessageDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class PublisherTest {

    @Autowired
    Publisher publisher;

    @Autowired
    ObjectMapper objectMapper;

    @Test
    @DisplayName("pub/sub 테스트")
    void testPublishAndSubscribe() throws InterruptedException, JsonProcessingException {
        SseMessageDto<NotificationDto> messageDto = SseMessageDtoFixture.MESSAGE_DTO_01.getFixture();
        publisher.publish(messageDto);
        Thread.sleep(50);
    }
}