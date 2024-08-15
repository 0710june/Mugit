package com.ssafy.mugit.presentation.handler;

import com.ssafy.mugit.domain.exception.SseException;
import com.ssafy.mugit.presentation.dto.MessageDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingRequestCookieException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@ResponseBody
@Slf4j
public class GlobalExceptionHandler {

    // [400]validate 오류
    @ExceptionHandler(MethodArgumentNotValidException.class)
    protected ResponseEntity<MessageDto> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        log.error(e.getMessage());
        return new ResponseEntity<>(new MessageDto("잘못된 요청값입니다."), HttpStatus.BAD_REQUEST);
    }

    // [400]cookie 오류
    @ExceptionHandler(MissingRequestCookieException.class)
    protected ResponseEntity<MessageDto> handleMissingRequestCookieException(MissingRequestCookieException e) {
        log.error(e.getMessage());
        return new ResponseEntity<>(new MessageDto("요청에 필요한 쿠키가 없습니다."), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    protected ResponseEntity<MessageDto> handleHttpMessageNotReadableException(HttpMessageNotReadableException e) {
        log.error(e.getMessage());
        return new ResponseEntity<>(new MessageDto("요청 파라미터를 읽을 수 없습니다."), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(SseException.class)
    protected ResponseEntity<MessageDto> handleUserApiException(SseException e) {
        log.error(e.getMessage());
        return switch (e.getSseError()) {
            case SSE_EMITTER_NOT_FOUND -> new ResponseEntity<>(new MessageDto("연결을 찾을 수 없습니다."), HttpStatus.NOT_FOUND);
            case EXCEED_SSE_EMITTER_TIMEOUT -> new ResponseEntity<>(new MessageDto("클라이언트와의 연결이 종료되었습니다."), HttpStatus.NOT_ACCEPTABLE);
            case SSE_QUEUE_CONTAINER_NOT_FOUND -> new ResponseEntity<>(new MessageDto("메시지 큐를 찾을 수 없습니다."), HttpStatus.NOT_FOUND);
            case ALREADY_EXIST_CONNECTION -> new ResponseEntity<>(new MessageDto("이미 SSE가 연결되어 있습니다."), HttpStatus.CONFLICT);
        };
    }

    // [500]서버 오류
    @ExceptionHandler(InternalError.class)
    protected ResponseEntity<MessageDto> handleInternalServerException(InternalError e) {
        log.error(e.getMessage());
        return new ResponseEntity<>(new MessageDto(e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
