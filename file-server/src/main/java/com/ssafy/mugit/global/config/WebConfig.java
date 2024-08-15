package com.ssafy.mugit.global.config;

import com.ssafy.mugit.global.interceptor.LogInterceptor;
import com.ssafy.mugit.global.interceptor.SessionValidateInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private final RedisTemplate<String, Object> redisTemplate;
    @Value("${upload-path}")
    private String uploadPath;
    @Value("${spring.session.redis.namespace}")
    private String NAMESPACE;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/files/**")
                .addResourceLocations("file:///" + uploadPath);
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 모든 경로에 대해
                .allowedOrigins("https://mugit.site", "http://localhost:3000") // 이 출발지에서 오는 요청 허용
                .allowedMethods("GET", "POST", "PUT", "DELETE") // 허용할 HTTP 메소드
                .allowedHeaders("*") // 모든 헤더 허용
                .allowCredentials(true)
                .exposedHeaders("*"); // 쿠키를 포함한 요청 허용
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new LogInterceptor())
                .addPathPatterns("/**");
        registry.addInterceptor(new SessionValidateInterceptor(redisTemplate, NAMESPACE))
                .addPathPatterns("/files");
    }
}
