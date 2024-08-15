package com.ssafy.mugit.sse.service;

import com.ssafy.mugit.global.dto.NotificationDto;
import com.ssafy.mugit.domain.sse.service.SseService;
import com.ssafy.mugit.global.dto.SseMessageDto;
import com.ssafy.mugit.infrastructure.repository.SseQueueContainer;
import com.ssafy.mugit.infrastructure.repository.SseQueueContainerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;

import static com.ssafy.mugit.domain.message.fixture.SseMessageDtoFixture.MESSAGE_DTO_01;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;


@Tag("notification")
@ExtendWith(MockitoExtension.class)
class SseServiceTest {

    @Mock
    SseEmitter mockEmitter;

    SseQueueContainerRepository sseQueueContainerRepository;

    SseService sut;

    @BeforeEach
    void setUp() {
        sseQueueContainerRepository = new SseQueueContainerRepository();
        sut = new SseService(10000L, sseQueueContainerRepository);
    }

    @Test
    @DisplayName("[통합] Emitter 생성 및 저장, 조회")
    void TestCreateEmitter() throws IOException {
        // given
        long userId = 1;

        // when
        sut.subscribe(userId);
        SseQueueContainer sseQueueContainer = sseQueueContainerRepository.findById(userId);
        SseEmitter emitter = sseQueueContainer.getSseEmitter();

        // then
        assertThat(emitter).isNotNull();
        assertThat(emitter.getTimeout()).isEqualTo(10000L);
    }

    @Test
    @DisplayName("[통합] MessageQueue 생성하고 전송 실패 시 저장")
    void testFailAndOfferInQueue() throws IOException {
        // given
        Long userId = 1L;
        sseQueueContainerRepository.save(userId, new SseEmitter(-1L));
        SseMessageDto<NotificationDto> dto = MESSAGE_DTO_01.getFixture();

        // when : 마지막 전송시간 현재시간으로 설정 후 전송
        SseQueueContainer sseQueueContainer = sseQueueContainerRepository.findById(userId);
        sseQueueContainer.setLastEmitterCreateTime(System.currentTimeMillis());
        sut.send(userId, dto);

        // then
        assertThat(sseQueueContainer.getMessageQueue().isEmpty()).isFalse();
        Object message2 = sseQueueContainer.getMessageQueue().poll();
        assertThat(message2).isEqualTo(dto);
    }

    @Test
    @DisplayName("[통합] 메시지 쌓여있을때 연결 시 해당 메시지 모두 전송")
    void testPollingFailMessage() throws IOException {
        // given
        Long userId = 1L;
        sseQueueContainerRepository.save(userId, new SseEmitter(-1L));
        SseMessageDto<NotificationDto> message = MESSAGE_DTO_01.getFixture();

        // when 1 : 마지막 전송시간 현재시간 설정 후 전송(메시지 큐에 1개 쌓임)
        SseQueueContainer sseQueueContainer = sseQueueContainerRepository.findById(userId);
        sseQueueContainer.setLastEmitterCreateTime(System.currentTimeMillis());
        sut.send(userId, message);

        // when 2 : 가짜 전송 생성 후 실행
        sseQueueContainerRepository.save(userId, mockEmitter);
        when(mockEmitter.getTimeout()).thenReturn(600000L);
        sut.subscribeNewSse(userId, sseQueueContainer);

        // then : 연결요청 + 저장된 메시지 전송
        verify(mockEmitter, times(2)).send((SseEmitter.SseEventBuilder) any());
    }

    @Test
    @DisplayName("[통합] 타임아웃되지 않은 연결이 있을 경우, 기존 연결 완료하기")
    void testExistNotTimeoutSse() throws IOException {
        // given
        long userId = 1L;
        sseQueueContainerRepository.save(userId, mockEmitter);

        // when
        sut.subscribe(userId);

        // then
        verify(mockEmitter, times(1)).complete();
    }
}