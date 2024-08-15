package com.ssafy.mugit;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.TimeZone;

@SpringBootApplication
public class MugitApplication {

    @PostConstruct
    public void setTimeZone() {
        // timezone 셋팅
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Seoul"));
    }

    public static void main(String[] args) {
        SpringApplication.run(MugitApplication.class, args);
    }

}
