package com.ssafy.mugit.global.config;

import com.ssafy.mugit.global.security.CustomAuthorizeHttpRequestsFilter;
import com.ssafy.mugit.global.security.CustomCorsConfiguration;
import com.ssafy.mugit.global.security.CustomOncePerRequestFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomAuthorizeHttpRequestsFilter customAuthorizeHttpRequestsFilter;
    private final CustomOncePerRequestFilter customOncePerRequestFilter;
    private final CustomCorsConfiguration customCorsConfiguration;


    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                // Authorize Filter
                .authorizeHttpRequests(customAuthorizeHttpRequestsFilter.regist())

                // Make Authentication Object by Redis Session
                .addFilterBefore(customOncePerRequestFilter, UsernamePasswordAuthenticationFilter.class)

                // disable form login
                .formLogin((AbstractHttpConfigurer::disable))

                //cors
                .cors((corsConfig) -> corsConfig.configurationSource(customCorsConfiguration.getSource()))

                .csrf(AbstractHttpConfigurer::disable)

                .build();
    }

}
