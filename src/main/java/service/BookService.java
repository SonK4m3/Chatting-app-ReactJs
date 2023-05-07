package service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import model.Book;
import repository.BookRepository;

@Service
public class BookService {
//	@Autowired(required=true)
	private BookRepository repo;
	
	public BookService() {
		
	}
	
	public List<Book> getBooks() {
		return repo.findAll();
	}
	
//	public Book getBookById(int id) {
//		return repo.getById(id);
//	}
}
