package com.ssafy.mugit.global.exception.error;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum GlobalApiError {
    NO_TOKEN_IN_HEADER("인증 토큰이 없습니다.");

    private final String message;
}
