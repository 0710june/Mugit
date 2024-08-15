package com.ssafy.mugit.infrastructure.redis;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.mugit.domain.message.service.RedisMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.PatternTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.listener.adapter.MessageListenerAdapter;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.session.config.annotation.web.http.EnableSpringHttpSession;

@EnableSpringHttpSession
@Configuration
@RequiredArgsConstructor
public class RedisConfig {

    @Value("${spring.data.redis.port}")
    private int port;

    @Value("${spring.data.redis.host}")
    private String host;

    @Value("${spring.data.redis.password}")
    private String password;

    @Value("${redis.topic}")
    private String topic;

    private final ObjectMapper objectMapper;

    @Bean
    public LettuceConnectionFactory connectionFactory() {
        RedisStandaloneConfiguration redisStandaloneConfiguration = new RedisStandaloneConfiguration(host, port);
        redisStandaloneConfiguration.setPassword(password);
        LettuceConnectionFactory lettuceConnectionFactory = new LettuceConnectionFactory(redisStandaloneConfiguration);
        lettuceConnectionFactory.setEagerInitialization(true);
        return lettuceConnectionFactory;
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate() {

        final RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory());
        template.setDefaultSerializer(new GenericJackson2JsonRedisSerializer());

        // Key는 모두 String으로 처리
        template.setKeySerializer(new StringRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());

        return template;
    }

    @Bean
    public RedisSerializer<Object> springSessionDefaultRedisSerializer() {
        return new GenericJackson2JsonRedisSerializer();
    }

    @Bean
    Publisher publisher(RedisTemplate<String, Object> redisTemplate) {
        return new Publisher(redisTemplate);
    }

    @Bean
    public MessageListenerAdapter messageListenerAdapter(RedisMessageService redisMessageService) {
        return new MessageListenerAdapter(redisMessageService, "onMessage");
    }

    @Bean
    public RedisMessageListenerContainer container(LettuceConnectionFactory connectionFactory, MessageListenerAdapter listenerAdapter) {
        final RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        container.addMessageListener(listenerAdapter, new PatternTopic(topic));

        return container;
    }
}
