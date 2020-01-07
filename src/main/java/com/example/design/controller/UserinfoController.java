package com.example.design.controller;

import com.example.design.common.domain.Book;
import com.example.design.common.domain.Bookshelf;
import com.example.design.common.domain.Bookuser;
import com.example.design.mapper.BookMapper;
import com.example.design.mapper.BookshelfMapper;
import com.example.design.service.BookshelfService;
import com.example.design.service.DetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

@Controller
public class UserinfoController {
    @Autowired
    BookshelfService bookshelfService;
    @Autowired
    DetailsService detailsService;
    @Autowired
    BookMapper bookMapper;
    @Autowired
    BookshelfMapper bookshelfMapper;
    Bookshelf bookshelf1;

    @GetMapping("/Userinformation")
    public String userpage(Model model, HttpServletRequest request) {
        if (request.getSession().getAttribute("logininfo") == null) {
            return "login";
        } else {

            model.addAttribute("context","information");
            return "Userinformation";
        }
    }
    //基本资料
    @GetMapping("/informa")
    public String informapage(Model model,HttpServletRequest request){
        if (request.getSession().getAttribute("logininfo") == null) {
            return "login";
        } else {

            model.addAttribute("context", "information");
            return "Userinformation";
        }
    }




//书架
    @GetMapping("/shelf")
    public String shelfpage(Model model,HttpServletRequest request) {
        if (request.getSession().getAttribute("logininfo") == null) {
            return "login";
        } else {

            Bookuser bookuser=(Bookuser) request.getSession().getAttribute("logininfo");
//            List<Bookshelf> books=bookshelfService.findshelf(bookuser.getTelephone());
            List<Bookshelf> books=bookshelfMapper.finds(bookuser.getTelephone());
            List<Book> ab=new ArrayList<>();
            Bookshelf av;
            for(int a=0;a<books.size();a++){            //将books中的booklist放到ab中
                av=books.get(a);
                List<Book> vv=av.getBookList();
                for(int b=0;b<vv.size();b++){
                    ab.add(vv.get(b));
                }

            }
            System.out.println("BookList的数量："+ab.size());
//            List<Book> bookList1 = new ArrayList<>();
//            for(int i=0;i<books.size();i++)
//            {
//                bookList1.add(books.get(i).getBookList());
//            }
            System.out.println("书架书的数量："+books.size());
            model.addAttribute("context","bookshelf");

            request.getSession().setAttribute("books",ab);
            return "Userinformation";

        }
    }
    //加入书架

    @GetMapping("/addshelf")
    public String addshelf(Integer bookId,HttpServletRequest request,Model model) {
        System.out.println("addshelf:" + bookId);
        if (request.getSession().getAttribute("logininfo") == null) {
            return "login";
        } else {
            //取得用户唯一标识
            Bookuser info= (Bookuser)request.getSession().getAttribute("logininfo");
            System.out.println(info.getUsername());
            //取得书籍信息
            List<Book> dbook = detailsService.detailservice(bookId);
            Book book = dbook.get(0);
            System.out.println(book.getBookName()+","+book.getBookAuthor()+","+book.getBookType()+","+book.getWordNum()+","+book.getBookId());
            List<Bookshelf> bk=bookshelfMapper.yzshelf(book.getBookId(),info.getTelephone());
            if(bk.isEmpty()){

                Bookshelf bookshelf = new Bookshelf();
                bookshelf.setBookId(book.getBookId());
                bookshelf.setTelephone(info.getTelephone());
                bookshelfMapper.insertSelective(bookshelf);
            }
            String ses = null;
            ses=request.getSession().getAttribute("netaddress").toString();
            String kk="index";
            if(ses=="Selectbook"){
                String sel=request.getSession().getAttribute("agoselect").toString();
                System.out.println("搜索值："+sel);
                List<Book> booksum=bookMapper.findbook(sel);
                int i=booksum.size();
                System.out.println("booksum:"+i);
                model.addAttribute("i",i);
                model.addAttribute("booksum",booksum);
//                return "Selectbook";
                kk="Selectbook";
            }
            if(ses=="BookDetails"){
                Integer det=(Integer) request.getSession().getAttribute("agobookid");
                System.out.println("bookid:"+det);
                List<Book> debook=detailsService.detailservice(det);
                System.out.println(debook.size());
                model.addAttribute("debook",debook);
//                return "BookDetails";
                kk="BookDetails";
            }
            return kk;

        }

    }

    //移出书架
    @GetMapping("/bookout")
    @ResponseBody
    public Integer outshelf(Model model, @RequestParam("bookid") Integer bookid, HttpServletRequest request){
        System.out.println("书架页面删除的书bookid："+bookid);
        Bookuser info= (Bookuser)request.getSession().getAttribute("logininfo");
        Integer i=bookshelfMapper.delshelf(bookid,info.getTelephone());
        model.addAttribute("context","bookshelf");
        return i;
    }


}
