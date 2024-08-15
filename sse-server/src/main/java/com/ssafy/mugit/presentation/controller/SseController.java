package com.ssafy.mugit.presentation.controller;

import com.ssafy.mugit.domain.sse.service.SseService;
import com.ssafy.mugit.global.dto.UserSessionDto;
import com.ssafy.mugit.global.security.UserSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;

import static org.springframework.http.HttpHeaders.CONTENT_TYPE;

@RestController
@RequestMapping("/sse")
@RequiredArgsConstructor
public class SseController {

    private final SseService sseService;

    @GetMapping("/subscribe")
    public ResponseEntity<SseEmitter> subscribe(@UserSession UserSessionDto user) throws IOException {

        return ResponseEntity.status(200)
                .header(CONTENT_TYPE, "text/event-stream; charset=UTF-8")
                .header("X-Accel-Buffering", "no")
                .body(sseService.subscribe(user.getId()));
    }

    @GetMapping("/complete")
    public ResponseEntity<SseEmitter> complete(@UserSession UserSessionDto user) {

        return ResponseEntity.status(200)
                .header(CONTENT_TYPE, "text/event-stream; charset=UTF-8")
                .header("X-Accel-Buffering", "no")
                .body(sseService.complete(user.getId()));
    }
}
