package com.ssafy.mugit.global.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum FileError {

    SESSIONID_NOT_EXISTED(401, "SessionId is not existed."),
    SESSIONID_ILLEGAL(403, "SessionId is illegal.");

    private final int code;
    private final String message;
}
