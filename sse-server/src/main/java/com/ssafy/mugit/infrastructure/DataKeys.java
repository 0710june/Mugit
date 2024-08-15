package com.ssafy.mugit.infrastructure;

public enum DataKeys {
    LOGIN_USER_KEY("user");

    private final String key;

    DataKeys(String key) {
        this.key = key;
    }

    public String getKey() {
        return key;
    }
}
