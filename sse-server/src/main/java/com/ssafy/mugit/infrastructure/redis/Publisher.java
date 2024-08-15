package com.ssafy.mugit.infrastructure.redis;

import com.ssafy.mugit.global.dto.SseMessageDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class Publisher {

    private final RedisTemplate<String, Object> redisTemplate;

    @Value("${redis.topic}")
    private String topic;

    public void publish(SseMessageDto<?> message) {
        redisTemplate.convertAndSend(topic, message);
    }
}
