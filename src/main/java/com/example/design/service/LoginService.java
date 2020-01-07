package com.example.design.service;

import com.example.design.common.domain.Bookuser;
import com.example.design.mapper.BookuserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LoginService {
    @Autowired
    BookuserMapper bookuserMapper;
    public List<Bookuser> userphone(String telephone){
        System.out.println("telephone:"+telephone);

        return bookuserMapper.userphone(telephone);
    }
    public List<Bookuser> userphones(String telephone,String password){
        System.out.println("telephone:"+telephone);

        return bookuserMapper.userphones(telephone,password);
    }


}
