package com.example.demo;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

import models.Book;

@RestController
@CrossOrigin
public class BookController {
	
	final String SERVER = "jdbc:mysql://localhost:3306/jdbc_demo";
	final String USERNAME = "root";
	final String PASSWORD = "123456";
	
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
		Connection connection = null;
		Statement statement = null;
		ResultSet resultSet = null;
		List<Book> books = new ArrayList<Book>();
		
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
			connection = 
					DriverManager.getConnection(SERVER, USERNAME, PASSWORD);
			statement = connection.createStatement();
			resultSet = statement.executeQuery("select * from book");
			while(resultSet.next()) {
				int bookCode = resultSet.getInt("bookcode");
				String title = resultSet.getString("title");
				String author = resultSet.getString("author");
				String category = resultSet.getString("category");
				int approved = resultSet.getInt("approved");
				books.add(new Book(bookCode, title, author, category, approved == 0 ? false : true));
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return books;
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
	
//	@PostMapping("/book/save/{bookcode}")
//	public String addBook(Book book, @PathVariable String bookcode) {
//		Connection connection = null;
//		PreparedStatement ps = null;
//		int result = 0;
//		
//		try {
//			Class.forName("com.mysql.cj.jdbc.Driver");
//			connection = 
//					DriverManager.getConnection(SERVER, USERNAME, PASSWORD);
//			ps = connection.prepareStatement("INSERT INTO book VALUES (?,?,?,?,?)");
//			ps.setInt(1, Integer.valueOf(book.getBookcode()));
//			ps.setString(2, book.getTitle());
//			ps.setString(3, book.getAuthor());
//			ps.setString(4, book.getCategory());
//			ps.setInt(5, Integer.valueOf(book.getApproved() ? 1 : 0));
//			
//			result = ps.executeUpdate();
//			ps.close();
//			return "redirect:/books";
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//		return "error";
//	}
//	
//	@PutMapping("/book/save/{bookcode}")
//	public String update(Book book, @PathVariable String bookcode) {
//		Connection connection = null;
//		PreparedStatement ps = null;
//		int result = 0;
//		try {
//			Class.forName("com.mysql.cj.jdbc.Driver");
//			connection = DriverManager.getConnection(SERVER, USERNAME, PASSWORD);
//			ps = connection.prepareStatement("UPDATE book SET title=?, author=?, category=?, approved=? WHERE bookcode=?");
//			ps.setString(1,  book.getTitle());
//			ps.setString(2, book.getAuthor());
//			ps.setString(3, book.getCategory());
//			ps.setInt(4, book.getApproved() ? 1 : 0);
//			ps.setInt(5,  Integer.valueOf(book.getBookcode()));
//			result = ps.executeUpdate();
//			ps.close();
//			return "redirect:/books";
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//		
//		return "error";
//	}
}
