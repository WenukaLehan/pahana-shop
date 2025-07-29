package models;

public class Category {
	
	private int id;
	private String name;
	private String description;
	private String status;

	public Category(int id, String name, String description, String status) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.status = status; // Default status
	}

	public int getId() {
		return id;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
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

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

}
