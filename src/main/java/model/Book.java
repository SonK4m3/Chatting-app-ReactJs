package model;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Book {
	@Id
	int bookcode;
	String title;
	String author;
	String category;
	boolean approved;
	
	
	public Book() {
		this.bookcode = -1;
		this.title = "";
		this.author = "";
		this.category = "";
		this.approved = false;
	}
	
	public Book(int bookCode, String title, String author, String category, boolean approved) {
		this.bookcode = bookCode;
		this.title = title;
		this.author = author;
		this.category = category;
		this.approved = approved;
	}
	
	public int getBookcode() {
		return bookcode;
	}

	public void setBookcode(int bookcode) {
		this.bookcode = bookcode;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getAuthor() {
		return author;
	}

	public void setAuthor(String author) {
		this.author = author;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public boolean getApproved() {
		return approved;
	}

	public void setApproved(boolean approved) {
		this.approved = approved;
	}
}
