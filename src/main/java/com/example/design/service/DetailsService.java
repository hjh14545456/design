package com.example.design.service;

import com.example.design.common.domain.Book;
import com.example.design.mapper.BookMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class DetailsService {
    @Autowired
    BookMapper bookMapper;
    public List<Book> detailservice(Integer bookId){
        return bookMapper.findbooks(bookId);
    }
}
