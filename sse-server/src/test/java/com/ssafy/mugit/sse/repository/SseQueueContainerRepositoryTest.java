package com.ssafy.mugit.sse.repository;

import com.ssafy.mugit.domain.exception.SseException;
import com.ssafy.mugit.infrastructure.repository.SseQueueContainer;
import com.ssafy.mugit.infrastructure.repository.SseQueueContainerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import static com.ssafy.mugit.domain.exception.error.SseError.SSE_QUEUE_CONTAINER_NOT_FOUND;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class SseQueueContainerRepositoryTest {

    SseQueueContainerRepository sut;

    @BeforeEach
    void setUp() {
        sut = new SseQueueContainerRepository();
    }

    @Test
    @DisplayName("EmitterContainer 없을때 조회 시 null")
    void testNotFoundEmitter() {
        // given
        long userId = 1;

        // when
        SseQueueContainer sseQueueContainer = sut.findById(userId);

        // then
        assertThat(sseQueueContainer).isNull();
    }

    @Test
    @DisplayName("Emitter 조회")
    void testFindEmitter() {
        // given
        long userId = 1;

        // when
        sut.save(userId, new SseEmitter(10000L));
        SseEmitter emitterInCache = sut.findById(userId).getSseEmitter();

        // then
        assertThat(emitterInCache).isNotNull();
        assertThat(emitterInCache.getTimeout()).isEqualTo(10000L);
    }
}