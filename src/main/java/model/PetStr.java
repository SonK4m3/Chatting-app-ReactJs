package model;

import java.sql.Date;

public class PetStr {
	int id;
	String name;
	String dob;
	String race;
	boolean vaccinated;
	
	public PetStr() {
		this.id = -1;
		this.name = "";
		this.dob = "";
		this.race = "";
		this.vaccinated = false;
	}

	public PetStr(int id, String name, String dob, String race, boolean vaccinated) {
		this.id = id;
		this.name = name;
		this.dob = dob;
		this.race = race;
		this.vaccinated = vaccinated;
	}
	
	public Pet parsePet() {
		return new Pet(this.id, this.name, Date.valueOf(this.dob), this.race, this.vaccinated);
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

	public String getDob() {
		return dob;
	}

	public void setDob(String dob) {
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
	
	
}
