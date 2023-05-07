package model;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class BookDAO {
	private String jdbcURL = "jdbc:mysql://localhost:3306/jdbc_demo";
	private String USERNAME = "root";
	private String PASSWORD = "123456";
	
	private static final String SELECT_ALL_BOOKS = "select * from book";
	private static final String SELECT_BOOK_BY_ID = "select * from book where bookcode = ?";
	private static final String INSERT_SQL = "insert into book values(?, ?, ?, ?, ?)";
	private static final String UPDATE_BOOKS_SQL = "UPDATE book SET title=?, author=?, category=?, approved=? WHERE bookcode=?";
	
	public BookDAO() {
		
	}
	
	protected Connection getConnection() {
		Connection connection = null;
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
			connection = DriverManager.getConnection(jdbcURL, USERNAME, PASSWORD);
		
		} catch (Exception e) {
			e.printStackTrace();
		}
	
		return connection;
	}
	
	public List<Book> selectAllBooks(){
		List<Book> books = new ArrayList<Book>();
		try (Connection connection = getConnection(); 
				PreparedStatement preparedStatement = connection.prepareStatement(SELECT_ALL_BOOKS);)
		{
			ResultSet rs = preparedStatement.executeQuery();
			while(rs.next()) {
				int bookcode = rs.getInt("bookcode");
				String title = rs.getString("title");
				String author = rs.getString("author");
				String category = rs.getString("category");
				int approved = rs.getInt("approved");
				books.add(new Book(bookcode, title, author, category, approved == 0 ? false : true));
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return books;
	}
}
