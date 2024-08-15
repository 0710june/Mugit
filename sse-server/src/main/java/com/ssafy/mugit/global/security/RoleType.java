package com.ssafy.mugit.global.security;

import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

import static java.util.Arrays.asList;

public enum RoleType {
    ROLE_USER(asList(RoleAuthority.DEFAULT_USER_AUTHORITY)),
    ROLE_ADMIN(asList(RoleAuthority.DEFAULT_ADMIN_AUTHORITY));

    private final Collection<GrantedAuthority> authorities;

    RoleType(Collection<GrantedAuthority> authorities) {
        this.authorities = authorities;
    }

    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }
}

