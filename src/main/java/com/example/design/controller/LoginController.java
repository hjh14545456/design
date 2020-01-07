package com.example.design.controller;

import com.example.design.common.domain.Book;
import com.example.design.common.domain.Bookshelf;
import com.example.design.common.domain.Bookuser;
import com.example.design.common.domain.BookuserExample;
import com.example.design.mapper.BookMapper;
import com.example.design.mapper.BookshelfMapper;
import com.example.design.mapper.BookuserMapper;
import com.example.design.service.BookuserService;
import com.example.design.service.DetailsService;
import com.example.design.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@Controller
public class LoginController {
    @Autowired
    BookuserService bookuserService;
    @Autowired
    LoginService loginService;
    @Autowired
    BookuserMapper bookuserMapper;
    @Autowired
    BookMapper bookMapper;
    @Autowired
    DetailsService detailsService;
    @Autowired
    BookshelfMapper bookshelfMapper;

    @Autowired
    SelectController selectController;
    @Autowired
    IndexController indexController;
    @Autowired
    DetailsController detailsController;

    @GetMapping("/tzs")
    public void tztest(Model model,HttpServletRequest request){
        System.out.println(request.getSession().getAttribute("netaddress"));
        String ses = null;
        if(request.getSession().getAttribute("netaddress")==null){
            System.out.println("session为空");

            indexController.indexpage();
        }else {
            ses=request.getSession().getAttribute("netaddress").toString();

//            Object s=request.getSession().getAttribute("netaddress");
            String kk="";
            if(ses=="Selectbook"){
                String sel=request.getSession().getAttribute("agoselect").toString();
                selectController.selectpage(model,sel,request);
            }
            if(ses=="BookDetails"){
                Integer det=(Integer)request.getSession().getAttribute("agobookid");
                System.out.println("bookid:"+det);
                detailsController.detailspage(model,det,request);
            }

        }



    }






    @GetMapping("/tz")
    public String tiaozzhuan(Model model,HttpServletRequest request){
        System.out.println(request.getSession().getAttribute("netaddress"));
        String ses = null;
        if(request.getSession().getAttribute("netaddress")==null){
            System.out.println("session为空");
            return "index";
        }else {
           ses=request.getSession().getAttribute("netaddress").toString();

            Object s=request.getSession().getAttribute("netaddress");
            String kk="";

            if(ses=="Selectbook"){

                String sel=request.getSession().getAttribute("agoselect").toString();

                System.out.println("搜索值："+sel);
                List<Book> booksum=bookMapper.findbook(sel);
                int i=booksum.size();
                System.out.println("booksum:"+i);
                model.addAttribute("i",i);
                model.addAttribute("booksum",booksum);

                kk="Selectbook";
            }
            if(ses=="BookDetails"){
                Integer det=(Integer)request.getSession().getAttribute("agobookid");
                System.out.println("bookid:"+det);
                List<Book> debook=detailsService.detailservice(det);
                System.out.println(debook.size());
                model.addAttribute("debook",debook);
                if(request.getSession().getAttribute("logininfo")!=null) {
                    Bookuser info = (Bookuser) request.getSession().getAttribute("logininfo");
                    List<Bookshelf> bk = bookshelfMapper.yzshelf(det, info.getTelephone());
                    if (!bk.isEmpty()) {

                        request.getSession().setAttribute("ifshelf", "已加入书架");
                    }
                    else{
                        request.getSession().setAttribute("ifshelf", "加入书架");
                    }
                }
//                return "BookDetails";
                kk="BookDetails";
            }
            return kk;
        }



    }


    @GetMapping("/login")
    public String loginpages(HttpServletRequest request){
        if(request.getSession().getAttribute("logininfo")!=null){
            return "BookDetails";
        }
        return "login";
    }

    @GetMapping("/denglu")
    @ResponseBody
    public String yz(String telephone, String password,HttpServletRequest request){


            System.out.println("用户名：" + telephone + ",密码：" + password);
            List<Bookuser> namesum = loginService.userphone(telephone);//后期可完成加密
            if (namesum.size() > 0) {
                Bookuser bookuser = namesum.get(0);
                System.out.println(bookuser.getPassword());
                if (bookuser.getPassword().equals(password)) {
                    request.getSession().setAttribute("logininfo", bookuser);
                    return "ok";

                } else {
                    return "password error";
                }
            } else {
                return "no";
            }


    }
@GetMapping("/loginout")
public String  loginout(Model model,HttpServletRequest request) {  //代码重复，是否可调用含HttpServletRequest的方法
//        request.getSession().invalidate();
    if (request.getSession().getAttribute("logininfo") == null) { //判断是否登录，防止已登出，还有以前的页面停在登录状态
        return "login";
    } else {


        request.getSession().removeAttribute("logininfo");
        System.out.println(request.getSession().getAttribute("netaddress"));
        String ses = null;
        if (request.getSession().getAttribute("netaddress") == null) {
            System.out.println("session为空");
            return "index";
        } else {
            ses = request.getSession().getAttribute("netaddress").toString();

            Object s = request.getSession().getAttribute("netaddress");
            String kk = "";

            if (ses == "Selectbook") {
                String sel = request.getSession().getAttribute("agoselect").toString();
                System.out.println("搜索值：" + sel);
                List<Book> booksum = bookMapper.findbook(sel);
                int i = booksum.size();
                System.out.println("booksum:" + i);
                model.addAttribute("i", i);
                model.addAttribute("booksum", booksum);
                kk = "Selectbook";
            }
            if (ses == "BookDetails") {
                Integer det =(Integer) request.getSession().getAttribute("agobookid");
                System.out.println("bookid:" + det);
                List<Book> debook = detailsService.detailservice(det);
                System.out.println(debook.size());
                model.addAttribute("debook", debook);
                kk = "BookDetails";
            }
            return kk;
        }
    }
}
}
