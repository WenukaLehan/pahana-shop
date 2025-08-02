package models;

import java.io.InputStream;

public class User {
	
	private String id;
    private String username;
    private String email;
    private int role;
    private String name;
    private String phone;
    private InputStream image;
    private String status;
    
    public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}
	
    public InputStream getImage() {
		return image;
	}

	public void setImage(InputStream image) {
		this.image = image;
	}

	public User() {
    	
    }
    
    public User(String id, String username, String email, int role, String name, String phone) {
    	this.id = id;
    	this.username = username;
    	this.email = email;
    	this.role = role;
    	this.name = name;
    	this.phone = phone;
    			 							
    }
    
    public User(String id, String username, String email, int role, String name, String phone, InputStream image, String status) {
    	this.id = id;
    	this.username = username;
    	this.email = email;
    	this.role = role;
    	this.name = name;
    	this.phone = phone;
    	this.image = image;
    	this.status = status;
    			 							
    }
	
    public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public int getRole() {
		return role;
	}
	public void setRole(int role) {
		this.role = role;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}


   
}