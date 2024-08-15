package com.ssafy.mugit.domain.message;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum NotificationType {
    FOLLOW("follow"),
    LIKE("like"),
    FLOW_RELEASE("flow_release"),
    REVIEW("review");
    private final String message;
}
