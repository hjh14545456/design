package com.example.design.controller;

import com.example.design.common.domain.Book;
import com.example.design.common.domain.Bookshelf;
import com.example.design.common.domain.Bookuser;
import com.example.design.mapper.BookMapper;
import com.example.design.mapper.BookshelfMapper;
import com.example.design.service.DetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@Controller
public class DetailsController {
    @Autowired
    DetailsService detailsService;
    @Autowired
    BookshelfMapper bookshelfMapper;
    @Autowired
    BookMapper bookMapper;
    @GetMapping("/BookDetails")
    public String detailspage(Model model, Integer bookId, HttpServletRequest request){
        request.getSession().setAttribute("ifshelf", "加入书架");
        System.out.println("bookid:"+bookId);
        List<Book> debook=detailsService.detailservice(bookId);
        System.out.println(debook.size());
        model.addAttribute("debook",debook);
        model.addAttribute("bkname",debook.get(0).getBookName());
        //记住登陆前的地址
        request.getSession().setAttribute("netaddress","BookDetails");
        System.out.println(request.getSession().getAttribute("netaddress"));
        //记住登陆前的参数
        request.getSession().setAttribute("agobookid",bookId);
        //是否已加入书架
        if(request.getSession().getAttribute("logininfo")!=null) {
            Bookuser info = (Bookuser) request.getSession().getAttribute("logininfo");
            List<Bookshelf> bk = bookshelfMapper.yzshelf(bookId, info.getTelephone());
            if (!bk.isEmpty()) {

                request.getSession().setAttribute("ifshelf", "已加入书架");
            }
            else{
                request.getSession().setAttribute("ifshelf", "加入书架");
            }
        }
        return "BookDetails";
    }


    @GetMapping("/addshelfs")
    @ResponseBody
    public String addshelfs(Integer bookId,HttpServletRequest request,Model model) {
        System.out.println("加入书架id:" + bookId);
        System.out.println(request.getSession().getAttribute("logininfo"));
        if (request.getSession().getAttribute("logininfo") == null) {
            return "delu";
        }
        else {

            //取得用户唯一标识
            Bookuser info= (Bookuser)request.getSession().getAttribute("logininfo");
            System.out.println(info.getUsername());
            //取得书籍信息
//            List<Book> dbook = detailsService.detailservice(bookId);
//            Book book = dbook.get(0);
//            System.out.println(book.getBookName()+","+book.getBookAuthor()+","+book.getBookType()+","+book.getWordNum()+","+book.getBookId());
            List<Bookshelf> bk=bookshelfMapper.yzshelf(bookId,info.getTelephone());



            //jia
            if(bk.isEmpty()){

                Bookshelf bookshelf = new Bookshelf();
                bookshelf.setBookId(bookId);
                bookshelf.setTelephone(info.getTelephone());
                bookshelfMapper.insertSelective(bookshelf);
                request.getSession().setAttribute("ifshelf","已加入书架");
                return "ok";
            }
            //shan
            else{
                Bookshelf b=bk.get(0);
                bookshelfMapper.deleteByPrimaryKey(b.getShelfid());
                request.getSession().setAttribute("ifshelf","加入书架");
                return "del";
            }



        }

    }
}
