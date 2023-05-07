package controller;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.http.HttpEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;

import model.Student;


@RestController
@CrossOrigin
public class StudentController {
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
	
	@GetMapping("/students")
	public List<Student> getStudents() throws IOException, ClassNotFoundException{
		Connection connection = null;
		PreparedStatement ps = null;
		ResultSet resultSet = null;
		List<Student> Students = new ArrayList<Student>();
		
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
			connection = 
					DriverManager.getConnection(SERVER, USERNAME, PASSWORD);
			ps = connection.prepareStatement("select * from student");
			resultSet = ps.executeQuery();
			while(resultSet.next()) {
				int id = resultSet.getInt("id");
				String name = resultSet.getString("name");
				Date dob = resultSet.getDate("dob");
				String major = resultSet.getString("major");
				int vaccinated = resultSet.getInt("vaccinated");
				Students.add(new Student(id, name, dob, major, vaccinated == 0 ? false : true));
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return Students;
	}
	
	@GetMapping("/student/{id}")
	public Student getStudentById(@PathVariable String id) throws IOException{
		Connection connection = null;
		PreparedStatement ps = null;
		ResultSet resultSet = null;
		Student Student = new Student();
		
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
			connection = 
					DriverManager.getConnection(SERVER, USERNAME, PASSWORD);
			ps = connection.prepareStatement("select * from student where id = ?");
			ps.setInt(1, Integer.valueOf(id));
			resultSet = ps.executeQuery();
			while(resultSet.next()) {
				Student.setId(resultSet.getInt("id"));
				Student.setName(resultSet.getString("name"));
				Student.setDob(resultSet.getDate("dob"));
				Student.setMajor(resultSet.getString("major"));
				Student.setVaccinated(resultSet.getInt("vaccinated") != 0 ? true : false);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return Student;
	}
	
	@GetMapping("/student/find/{txt}")
	public List<Student> getStudentByString(@PathVariable String txt) throws IOException, ClassNotFoundException{
		Connection connection = null;
		PreparedStatement ps = null;
		ResultSet resultSet = null;
		List<Student> Students = new ArrayList<Student>();
		
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
			connection = 
					DriverManager.getConnection(SERVER, USERNAME, PASSWORD);
			ps = connection.prepareStatement("select * from student WHERE name LIKE '%" + txt + "%' OR major LIKE '%" + txt + "%'");
			resultSet = ps.executeQuery();
			while(resultSet.next()) {
				int id = resultSet.getInt("id");
				String name = resultSet.getString("name");
				Date dob = resultSet.getDate("dob");
				String major = resultSet.getString("major");
				int vaccinated = resultSet.getInt("vaccinated");
				Students.add(new Student(id, name, dob, major, vaccinated == 0 ? false : true));
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return Students;
	}
	
	@GetMapping(value = "/student/delete/{id}")
	public boolean deleteStudent(@PathVariable String id) throws IOException{
		Connection connection = null;
		Statement stmt = null;
		ResultSet resultSet = null;
//		System.out.println(id);
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
			connection = 
					DriverManager.getConnection(SERVER, USERNAME, PASSWORD);
			stmt = connection.createStatement();
			String q = "DELETE FROM student WHERE id=" + Integer.valueOf(id);
			int rowsAffected = stmt.executeUpdate(q);
			
			return true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}
	
	@PostMapping("/student/add")
	@ResponseBody
	public boolean addStudent(HttpEntity<String> httpEntity) {
		Connection connection = null;
		PreparedStatement ps = null;
		ResultSet ss = null;
		int result = 0;
	    String json = httpEntity.getBody();
//	    System.out.println(json);
	    Student Student = new Gson().fromJson(json, Student.class);
	    try {
			Class.forName("com.mysql.cj.jdbc.Driver");
			connection = 
					DriverManager.getConnection(SERVER, USERNAME, PASSWORD);
			ps = connection.prepareStatement("SELECT * FROM Student WHERE name = ? or dob = ?");
			ps.setString(1, Student.getName());
			ps.setDate(2, Student.convertJavaDateToSql(Student.getDob()));
			ss = ps.executeQuery();
			if(ss.next()) {
				return false;
			}
			ps = connection.prepareStatement("INSERT INTO Student (name, dob, major, vaccinated) VALUES (?,?,?,?)");
			ps.setString(1, Student.getName());
			ps.setDate(2, Student.convertJavaDateToSql(Student.getDob()));
			ps.setString(3, Student.getMajor());
			ps.setInt(4, Integer.valueOf(Student.isVaccinated() ? 1 : 0));
				
			result = ps.executeUpdate();
			ps.close();
			return true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}

	@PutMapping("/Student/add")
	@ResponseBody
	public boolean update(HttpEntity<String> httpEntity) {
		Connection connection = null;
		PreparedStatement ps = null;
		int result = 0;
		String json = httpEntity.getBody();
//	    System.out.println("update " + json);
	    Student Student = new Gson().fromJson(json, Student.class);
	    
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
			connection = DriverManager.getConnection(SERVER, USERNAME, PASSWORD);
			ps = connection.prepareStatement("UPDATE Student SET name=?, dob=?, major=?, vaccinated=? WHERE id=?");
			ps.setString(1,  Student.getName());
			ps.setDate(2, Student.convertJavaDateToSql(Student.getDob()));
			ps.setString(3, Student.getMajor());
			ps.setInt(4, Student.isVaccinated() ? 1 : 0);
			ps.setInt(5,  Integer.valueOf(Student.getId()));
			result = ps.executeUpdate();
			ps.close();
			return true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return false;
	}
}
