package com.ssafy.mugit.global.exception;

import lombok.Getter;

@Getter
public class CustomException extends RuntimeException {

    private final FileError fileError;
    private final int code;
    private final String message;

    public CustomException(FileError fileError) {
        this.fileError = fileError;
        this.code = fileError.getCode();
        this.message = fileError.getMessage();
    }

}
