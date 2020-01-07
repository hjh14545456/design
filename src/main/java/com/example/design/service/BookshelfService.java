package com.example.design.service;

import com.example.design.common.domain.Bookshelf;
import com.example.design.mapper.BookshelfMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookshelfService {
    BookshelfMapper bookshelfMapper;
    public void updateshelf(){

    }
    public void insertSelective(Bookshelf bookshelf){
        bookshelfMapper.insertSelective(bookshelf);
    }
    public List<Bookshelf> findshelf(String telephone){
        return bookshelfMapper.finds(telephone);
    }
}
