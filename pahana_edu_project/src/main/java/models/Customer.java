package models;

import java.io.InputStream;

public class Customer {
	
	public String getU_id() {
		return u_id;
	}
	public void setU_id(String u_id) {
		this.u_id = u_id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getAcc_nu() {
		return acc_nu;
	}
	public void setAcc_nu(String acc_nu) {
		this.acc_nu = acc_nu;
	}
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
	private String u_id;
	private String name;
	private String email;
	private String phone;
	private String address;
	private String acc_nu;
	private String status;
	private InputStream image;
	
	public Customer() {
		
	}
	
	public Customer(String u_id, String name, String email, String phone, String address, String acc_nu, String status, InputStream image) {
		this.u_id = u_id;
		this.name = name;
		this.email = email;
		this.phone = phone;
		this.address = address;
		this.acc_nu = acc_nu;
		this.status = status;
		this.image = image;
	}

}
