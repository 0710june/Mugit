package com.ssafy.mugit.global.security;

import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AuthorizeHttpRequestsConfigurer;
import org.springframework.stereotype.Component;

@Component
public class CustomAuthorizeHttpRequestsFilter {
    public Customizer<AuthorizeHttpRequestsConfigurer<HttpSecurity>.AuthorizationManagerRequestMatcherRegistry> regist() {
        return (authorize) -> authorize

                // sse 요청은 전부 인증 필요
//                .requestMatchers("/sse/**").authenticated()

                // 이외 요청은 전부 허용
                .anyRequest().permitAll();

    }
}
