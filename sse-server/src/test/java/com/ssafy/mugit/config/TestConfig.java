package com.ssafy.mugit.config;

import com.ssafy.mugit.infrastructure.repository.SseQueueContainerRepository;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

@TestConfiguration
public class TestConfig {

    @Bean
    SseQueueContainerRepository sseRepository() {
        return new SseQueueContainerRepository();
    }
}
