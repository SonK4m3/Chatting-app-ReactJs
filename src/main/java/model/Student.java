package model;

import java.time.ZoneId;
import java.util.Date;

public class Student {
	int id;
	String name;
	Date dob;
	String major;
	boolean vaccinated;
	
	public Student() {
		this.id = -1;
		this.name = "";
		this.dob = new Date();
		this.major = "";
		this.vaccinated = false;
	}

	public Student(int id, String name, Date dob, String major, boolean vaccinated) {
		this.id = id;
		this.name = name;
		this.dob = dob;
		this.major = major;
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
	
	public String getMajor() {
		return major;
	}

	public void setMajor(String major) {
		this.major = major;
	}

	public boolean isVaccinated() {
		return vaccinated;
	}

	public void setVaccinated(boolean vaccinated) {
		this.vaccinated = vaccinated;
	}
	
	public Date convertDateSqlToJava(java.sql.Date d) {
		return Date.from(d.toLocalDate().atStartOfDay().atZone(ZoneId.systemDefault()).toInstant());
	}
	
	public java.sql.Date convertJavaDateToSql(Date d) {
		return new java.sql.Date(d.getTime());
	}
}
