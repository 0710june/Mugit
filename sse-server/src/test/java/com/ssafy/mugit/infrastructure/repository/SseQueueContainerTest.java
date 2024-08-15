package com.ssafy.mugit.infrastructure.repository;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.within;

class SseQueueContainerTest {
    @Test
    @DisplayName("SseMessageQueue에 lastEmitterCreateTime, messageQueue 추가")
    void testAddTimeAndQueue() {
        // given
        
        // when
        SseQueueContainer sseQueueContainer = new SseQueueContainer(new SseEmitter());

        // then
        assertThat(sseQueueContainer.getLastEmitterCreateTime()).isCloseTo(System.currentTimeMillis(), within(100L));
        assertThat(sseQueueContainer.getMessageQueue().isEmpty()).isTrue();
    }
}