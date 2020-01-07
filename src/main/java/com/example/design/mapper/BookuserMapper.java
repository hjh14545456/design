package com.example.design.mapper;

import com.example.design.common.domain.Bookuser;
import com.example.design.common.domain.BookuserExample;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface BookuserMapper {

    Bookuser finduser(@Param("telephone") String telephone);
    Bookuser finduser1(@Param("telephone") Bookuser bookuser);

    List<Bookuser> userna(String registerUsername);

    List<Bookuser> userphone(String phone);
    List<Bookuser> userphones(@Param("telephone") String telephone,@Param("password") String password);
    List<Bookuser> usermail(String mail);

    long countByExample(BookuserExample example);
    int deleteByExample(BookuserExample example);
    int insert(Bookuser record);
    int insertSelective(Bookuser record);
    List<Bookuser> selectByExample(BookuserExample example);
    int updateByExampleSelective(@Param("record") Bookuser record, @Param("example") BookuserExample example);
    int updateByExample(@Param("record") Bookuser record, @Param("example") BookuserExample example);
}