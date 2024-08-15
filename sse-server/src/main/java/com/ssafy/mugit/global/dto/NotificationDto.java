package com.ssafy.mugit.global.dto;

import com.ssafy.mugit.domain.message.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class NotificationDto {
    private Long id;
    private Long notifiedId;
    private Long notifierId;
    private Long causeEntityId;
    private Class<?> causeEntityClass;
    private NotificationType type;
    private String description;
    private String createAt;
}
