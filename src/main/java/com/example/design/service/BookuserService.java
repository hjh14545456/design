package com.example.design.service;

import com.example.design.common.domain.Bookuser;
import com.example.design.common.domain.BookuserExample;
import com.example.design.mapper.BookuserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookuserService {
    @Autowired
    BookuserMapper bookuserMapper;
//    public Integer usern(String registerUsername){
//        System.out.println("service："+registerUsername);
//        System.out.println("回传："+bookuserMapper.userna(registerUsername));
//        return bookuserMapper.userna(registerUsername);
//    }

    public List<Bookuser> userna(String registerUsername){
        System.out.println("registerUsername:"+registerUsername);

        return bookuserMapper.userna(registerUsername);
    }

    public List<Bookuser> userphone(String phone){
        System.out.println("phone:"+phone);
        return bookuserMapper.userphone(phone);
    }

    public List<Bookuser> usermail(String mail){
        System.out.println("mail:"+mail);
        return bookuserMapper.usermail(mail);
    }




}
