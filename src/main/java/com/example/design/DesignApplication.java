package com.example.design;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import javax.servlet.http.HttpServletRequest;

@SpringBootApplication
@MapperScan({"com.example.design.mapper"})
public class DesignApplication {

	public static void main(String[] args) {

		SpringApplication.run(DesignApplication.class, args);
	}


}


