package com.example.design.controller;

import com.example.design.mapper.BookuserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Controller
public class IndexController {
    @Autowired
    BookuserMapper bookuserMapper;
    @GetMapping("/index")
    public String indexpage(){

        return "index";
    }
}
