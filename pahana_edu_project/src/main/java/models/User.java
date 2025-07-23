package models;

public class User {
	
	private String id;
    private String username;
    private String email;
    private int role;
    private String name;
    private String phone;
    
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