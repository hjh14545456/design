package com.example.design.service;

import com.example.design.common.domain.Book;
import com.example.design.mapper.BookMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {
    BookMapper bookMapper;
    public List<Book> findbook(String keyword){
        return bookMapper.findbook(keyword);
    }
}
