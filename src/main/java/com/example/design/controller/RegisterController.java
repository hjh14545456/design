package com.example.design.controller;

import com.example.design.common.domain.Bookuser;
import com.example.design.mapper.BookuserMapper;
import com.example.design.service.BookuserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
public class RegisterController {
    @Autowired
    BookuserMapper bookuserMapper;
    @Autowired
    BookuserService bookuserService;
    @GetMapping("/register")
    public String registerpage(){
        return "register";
    }
    @GetMapping("/zhuce")
    @ResponseBody
    public String zc(Model model,String registerUsername, String sex, String registerPassword, String phone, String mail){
        System.out.println(registerUsername+","+registerPassword+","+phone+","+mail);
//        System.out.println(bookuserMapper.userna(registerUsername));

        //查询用户名是否重复
//        System.out.println("单个名字："+registerUsername);
        List<Bookuser> namesum=bookuserService.userna(registerUsername);


//        int countname=namesum.size();
//        System.out.println("名字："+namesum);

        //查询电话是否重复
        List<Bookuser> phonesum=bookuserService.userphone(phone);
//        int countphone=phonesum.size();
//        System.out.println("phone个数："+countphone);
//        model.addAttribute("phonesum",phonesum);

        //查询邮箱是否重复
        List<Bookuser> mailsum=bookuserService.usermail(mail);
//        int countmail=mailsum.size();
//        System.out.println("mail个数："+countmail);
//        model.addAttribute("mailsum",mailsum);




        if(namesum.isEmpty()==false){       //rs.next()

            return "name";
        }
        else if(phonesum.isEmpty()==false){
            return "phone";
        }
        else if(mailsum.isEmpty()==false){
            return "mail";
        }
        else {

            Bookuser bookuser = new Bookuser();
            bookuser.setUsername(registerUsername);
            bookuser.setPassword(registerPassword);
            bookuser.setSex(sex);
            bookuser.setTelephone(phone);
            bookuser.setEmail(mail);
            bookuserMapper.insertSelective(bookuser);
            return "ok";
        }
    }

}
