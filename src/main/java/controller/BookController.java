package controller;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;

import model.Book;
import model.BookDAO;
import service.BookService;

@RestController
@CrossOrigin
public class BookController {
	
	final String SERVER = "jdbc:mysql://localhost:3306/jdbc_demo";
	final String USERNAME = "root";
	final String PASSWORD = "123456";
	
	BookDAO bookDAO = new BookDAO();
	
//	@Autowired(required=true)
	private BookService service = new BookService();
	
	protected Connection getConnection() {
		Connection connection = null;
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
			connection = DriverManager.getConnection(SERVER, USERNAME, PASSWORD);
		
		} catch (Exception e) {
			e.printStackTrace();
		}
	
		return connection;
	}
	
	@GetMapping("/books")
	public List<Book> getBooks() throws IOException{
//		return service.getBooks();
		return bookDAO.selectAllBooks();
	}
	
	@GetMapping("/book/{bookcode}")
	public Book getBook(@PathVariable String bookcode) throws IOException{
		Connection connection = null;
		PreparedStatement ps = null;
		ResultSet resultSet = null;
		Book book = new Book();
		
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
			connection = 
					DriverManager.getConnection(SERVER, USERNAME, PASSWORD);
			ps = connection.prepareStatement("select * from book where bookcode = ?");
			ps.setInt(1, Integer.valueOf(bookcode));
			resultSet = ps.executeQuery();
			while(resultSet.next()) {
				book.setBookcode(resultSet.getInt("bookcode"));
				book.setTitle(resultSet.getString("title"));
				book.setAuthor(resultSet.getString("author"));
				book.setCategory(resultSet.getString("category"));
				book.setApproved(resultSet.getInt("approved") != 0 ? true : false);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return book;
	}
	
	@GetMapping(value = "/book/delete/{bookcode}")
	public boolean deleteBook(@PathVariable String bookcode) throws IOException{
		Connection connection = null;
		Statement stmt = null;
		ResultSet resultSet = null;
		
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
			connection = 
					DriverManager.getConnection(SERVER, USERNAME, PASSWORD);
			stmt = connection.createStatement();
			String q = "DELETE FROM book WHERE bookcode=" + Integer.valueOf(bookcode);
			int rowsAffected = stmt.executeUpdate(q);
			
			return true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}
	
	@PostMapping("/book/add")
	@ResponseBody
	public boolean addBook(HttpEntity<String> httpEntity) {
		Connection connection = null;
		PreparedStatement ps = null;
		int result = 0;
	    String json = httpEntity.getBody();
	    Book book = new Gson().fromJson(json, Book.class);
//	    System.out.println(book.getAuthor() + " " + book.getCategory());
	    try {
			Class.forName("com.mysql.cj.jdbc.Driver");
			connection = 
					DriverManager.getConnection(SERVER, USERNAME, PASSWORD);
//			ps = connection.prepareStatement("SELECT * FROM book WHERE title = ?");
			
			
			ps = connection.prepareStatement("INSERT INTO book (title, author, category, approved) VALUES (?,?,?,?)");
			ps.setString(1, book.getTitle());
			ps.setString(2, book.getAuthor());
			ps.setString(3, book.getCategory());
			ps.setInt(4, Integer.valueOf(book.getApproved() ? 1 : 0));
			
			result = ps.executeUpdate();
			ps.close();
			return true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}

	@PutMapping("/book/add")
	@ResponseBody
	public boolean update(HttpEntity<String> httpEntity) {
		Connection connection = null;
		PreparedStatement ps = null;
		int result = 0;
		String json = httpEntity.getBody();
	    System.out.println("update " + json);
	    Book book = new Gson().fromJson(json, Book.class);
//	    System.out.println(book.getAuthor() + " " + book.getCategory());
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
			connection = DriverManager.getConnection(SERVER, USERNAME, PASSWORD);
			ps = connection.prepareStatement("UPDATE book SET title=?, author=?, category=?, approved=? WHERE bookcode=?");
			ps.setString(1,  book.getTitle());
			ps.setString(2, book.getAuthor());
			ps.setString(3, book.getCategory());
			ps.setInt(4, book.getApproved() ? 1 : 0);
			ps.setInt(5,  Integer.valueOf(book.getBookcode()));
			result = ps.executeUpdate();
			ps.close();
			return true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return false;
	}
}
