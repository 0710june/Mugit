package com.ssafy.mugit.global.exception;

import com.ssafy.mugit.global.exception.error.UserApiError;
import lombok.Getter;

@Getter
public class UserApiException extends RuntimeException {
    private final UserApiError userApiError;
    private final String message;

    public UserApiException(UserApiError userApiError) {
        this.userApiError = userApiError;
        this.message = userApiError.getMessage();
    }
}
