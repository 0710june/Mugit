package com.ssafy.mugit.global.dto;

import com.ssafy.mugit.global.security.RoleType;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserSessionDto {
    private Long id;
    private String email;
    private RoleType role;

    public UserSessionDto(Long id, String email, RoleType role) {
        this.id = id;
        this.email = email;
        this.role = role;
    }
}
