package model;

import java.time.ZoneId;
import java.util.Date;

public class Pet {
	int id;
	String name;
	Date dob;
	String race;
	boolean vaccinated;
	
	public Pet() {
		this.id = -1;
		this.name = "";
		this.dob = new Date();
		this.race = "";
		this.vaccinated = false;
	}

	public Pet(int id, String name, Date dob, String race, boolean vaccinated) {
		this.id = id;
		this.name = name;
		this.dob = dob;
		this.race = race;
		this.vaccinated = vaccinated;
	}
	
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Date getDob() {
		return dob;
	}

	public void setDob(Date dob) {
		this.dob = dob;
	}
	
	public String getRace() {
		return race;
	}

	public void setRace(String race) {
		this.race = race;
	}

	public boolean isVaccinated() {
		return vaccinated;
	}

	public void setVaccinated(boolean vaccinated) {
		this.vaccinated = vaccinated;
	}
	
	public static Date convertDateSqlToJava(java.sql.Date d) {
		return Date.from(d.toLocalDate().atStartOfDay().atZone(ZoneId.systemDefault()).toInstant());
	}
	
	public static java.sql.Date convertJavaDateToSql(Date d) {
		return new java.sql.Date(d.getTime());
	}
	
}
