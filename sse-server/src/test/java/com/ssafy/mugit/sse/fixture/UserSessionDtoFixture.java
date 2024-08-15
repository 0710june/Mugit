package com.ssafy.mugit.sse.fixture;

import com.ssafy.mugit.global.dto.UserSessionDto;
import com.ssafy.mugit.global.security.RoleType;

import static com.ssafy.mugit.global.security.RoleType.ROLE_USER;

public enum UserSessionDtoFixture {
    USER_SESSION_DTO_01(1L, "test@test.com", ROLE_USER);

    private Long id;
    private String email;
    private RoleType role;

    UserSessionDtoFixture(Long id, String email, RoleType role) {
        this.id = id;
        this.email = email;
        this.role = role;
    }

    public UserSessionDto getFixture() {
        return new UserSessionDto(this.id, this.email, this.role);
    }
}
