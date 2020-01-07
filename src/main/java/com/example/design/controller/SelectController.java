package com.example.design.controller;

import com.example.design.common.domain.Book;
import com.example.design.mapper.BookMapper;
import com.example.design.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;


import javax.servlet.http.HttpServletRequest;
import java.util.List;

@Controller
public class SelectController {
    @Autowired
    BookService bookService;
    @Autowired
    BookMapper bookMapper;
    @GetMapping("/selectbook")
    public String selectpage(Model model, String keyword, HttpServletRequest request){
        //登陆前的地址
        request.getSession().setAttribute("netaddress","Selectbook");
        System.out.println(request.getSession().getAttribute("netaddress"));
        //登陆前的参数
        request.getSession().setAttribute("agoselect",keyword);
        //List返回
        System.out.println("搜索值："+keyword);
        List<Book> booksum=bookMapper.findbook(keyword);
        int i=booksum.size();


        System.out.println("booksum:"+i);
        model.addAttribute("i",i);
        model.addAttribute("booksum",booksum);
        return "Selectbook";
    }
}
