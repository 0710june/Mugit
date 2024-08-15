package com.ssafy.mugit.global.interceptor;

import com.ssafy.mugit.global.exception.CustomException;
import com.ssafy.mugit.global.exception.FileError;
import com.ssafy.mugit.global.util.CookieUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Base64;

@Component
@Slf4j
public class SessionValidateInterceptor implements HandlerInterceptor {

    private final RedisTemplate<String, Object> redisTemplate;
    private final String NAMESPACE;

    public SessionValidateInterceptor(RedisTemplate<String, Object> redisTemplate,
                                      @Value("${spring.session.redis.namespace}") String NAMESPACE) {
        this.redisTemplate = redisTemplate;
        this.NAMESPACE = NAMESPACE;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String jSessionId = new CookieUtil().getSessionId(request);
        if (jSessionId == null) {
            jSessionId = new CookieUtil().getSessionIdInHeader(request);
        }
        String redisSessionKey = getRedisSessionKey(jSessionId);
        log.info("[Session Validate Interceptor] JSSESIONID : {}", jSessionId);
        log.info("[Session Validate Interceptor] Redis Session Key : {}", redisSessionKey);
        if (Boolean.FALSE.equals(redisTemplate.hasKey(redisSessionKey))) {
            throw new CustomException(FileError.SESSIONID_ILLEGAL);
        }

        return HandlerInterceptor.super.preHandle(request, response, handler);
    }

    private String getRedisSessionKey(String jSessionId) {
        String decodedId = new String(Base64.getDecoder().decode(jSessionId));
        return NAMESPACE + ":sessions:" + decodedId;
    }
}
