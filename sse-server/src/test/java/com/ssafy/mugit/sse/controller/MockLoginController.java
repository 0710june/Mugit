package com.ssafy.mugit.sse.controller;

import com.ssafy.mugit.global.dto.UserSessionDto;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.ssafy.mugit.infrastructure.DataKeys.LOGIN_USER_KEY;
import static com.ssafy.mugit.sse.fixture.UserSessionDtoFixture.USER_SESSION_DTO_01;

@RestController
public class MockLoginController {

    @GetMapping("/mock/login")
    public ResponseEntity login(HttpSession session) {
        session.setAttribute(LOGIN_USER_KEY.getKey(), (UserSessionDto) USER_SESSION_DTO_01.getFixture());
        return ResponseEntity.ok().build();
    }
}
