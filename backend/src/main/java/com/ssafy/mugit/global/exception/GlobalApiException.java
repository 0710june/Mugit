package com.ssafy.mugit.global.exception;

import com.ssafy.mugit.global.exception.error.GlobalApiError;
import lombok.Getter;

@Getter
public class GlobalApiException extends RuntimeException {
    private final GlobalApiError globalApiError;
    private final String message;

    public GlobalApiException(GlobalApiError globalApiError) {
        this.globalApiError = globalApiError;
        this.message = globalApiError.getMessage();
    }
}
