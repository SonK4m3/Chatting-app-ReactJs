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

import model.Pet;
import model.PetStr;

@RestController
@CrossOrigin
public class PetController {
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
	
	@GetMapping("/pets")
	public List<Pet> getPets() throws IOException, ClassNotFoundException{
		Connection connection = null;
		PreparedStatement ps = null;
		ResultSet resultSet = null;
		List<Pet> pets = new ArrayList<Pet>();
		
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
			connection = 
					DriverManager.getConnection(SERVER, USERNAME, PASSWORD);
			ps = connection.prepareStatement("select * from pet");
			resultSet = ps.executeQuery();
			while(resultSet.next()) {
				int id = resultSet.getInt("id");
				String name = resultSet.getString("name");
				Date dob = resultSet.getDate("dob");
				String race = resultSet.getString("race");
				int vaccinated = resultSet.getInt("vaccinated");
				pets.add(new Pet(id, name, dob, race, vaccinated == 0 ? false : true));
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return pets;
	}
	
	@GetMapping("/pet/{id}")
	public Pet getPet(@PathVariable String id) throws IOException{
		Connection connection = null;
		PreparedStatement ps = null;
		ResultSet resultSet = null;
		Pet Pet = new Pet();
		
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
			connection = 
					DriverManager.getConnection(SERVER, USERNAME, PASSWORD);
			ps = connection.prepareStatement("select * from pet where id = ?");
			ps.setInt(1, Integer.valueOf(id));
			resultSet = ps.executeQuery();
			while(resultSet.next()) {
				Pet.setId(resultSet.getInt("id"));
				Pet.setName(resultSet.getString("name"));
				Pet.setDob(resultSet.getDate("dob"));
				Pet.setRace(resultSet.getString("race"));
				Pet.setVaccinated(resultSet.getInt("vaccinated") != 0 ? true : false);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return Pet;
	}
	
	@GetMapping(value = "/pet/delete/{id}")
	public boolean deletePet(@PathVariable String id) throws IOException{
		Connection connection = null;
		Statement stmt = null;
		ResultSet resultSet = null;
		System.out.println(id);
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
			connection = 
					DriverManager.getConnection(SERVER, USERNAME, PASSWORD);
			stmt = connection.createStatement();
			String q = "DELETE FROM pet WHERE id=" + Integer.valueOf(id);
			int rowsAffected = stmt.executeUpdate(q);
			
			return true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}
	
	@PostMapping("/pet/add")
	@ResponseBody
	public boolean addPet(HttpEntity<String> httpEntity) {
		Connection connection = null;
		PreparedStatement ps = null;
		ResultSet ss = null;
		int result = 0;
	    String json = httpEntity.getBody();
	    System.out.println(json);
	    Pet pet = new Gson().fromJson(json, Pet.class);
	    try {
			Class.forName("com.mysql.cj.jdbc.Driver");
			connection = 
					DriverManager.getConnection(SERVER, USERNAME, PASSWORD);
			ps = connection.prepareStatement("SELECT * FROM pet WHERE name = ? or dob = ?");
			ps.setString(1, pet.getName());
			ps.setDate(2, Pet.convertJavaDateToSql(pet.getDob()));
			ss = ps.executeQuery();
			if(ss.next()) {
				return false;
			}
			ps = connection.prepareStatement("INSERT INTO pet (name, dob, race, vaccinated) VALUES (?,?,?,?)");
			ps.setString(1, pet.getName());
			ps.setDate(2, Pet.convertJavaDateToSql(pet.getDob()));
			ps.setString(3, pet.getRace());
			ps.setInt(4, Integer.valueOf(pet.isVaccinated() ? 1 : 0));
				
			result = ps.executeUpdate();
			ps.close();
			return true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}

	@PutMapping("/pet/add")
	@ResponseBody
	public boolean update(HttpEntity<String> httpEntity) {
		Connection connection = null;
		PreparedStatement ps = null;
		int result = 0;
		String json = httpEntity.getBody();
	    System.out.println("update " + json);
	    Pet pet = ((PetStr) new Gson().fromJson(json, PetStr.class)).parsePet();
	    
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
			connection = DriverManager.getConnection(SERVER, USERNAME, PASSWORD);
			ps = connection.prepareStatement("UPDATE pet SET name=?, dob=?, race=?, vaccinated=? WHERE id=?");
			ps.setString(1,  pet.getName());
			ps.setDate(2, Pet.convertJavaDateToSql(pet.getDob()));
			ps.setString(3, pet.getRace());
			ps.setInt(4, pet.isVaccinated() ? 1 : 0);
			ps.setInt(5,  Integer.valueOf(pet.getId()));
			result = ps.executeUpdate();
			ps.close();
			return true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return false;
	}
}
