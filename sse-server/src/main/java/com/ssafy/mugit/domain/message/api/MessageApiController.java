package com.ssafy.mugit.domain.message.api;

import com.ssafy.mugit.domain.message.service.RedisMessageService;
import com.ssafy.mugit.global.dto.SseMessageDto;
import com.ssafy.mugit.presentation.dto.MessageDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/message")
@RequiredArgsConstructor
public class MessageApiController {

    private final RedisMessageService messageService;

    @PostMapping
    public ResponseEntity<MessageDto> getMessage(@RequestBody SseMessageDto<?> sseMessageDto) {
        messageService.send(sseMessageDto);
        return ResponseEntity.status(200).body(new MessageDto("알림 전송완료"));
    }
}
