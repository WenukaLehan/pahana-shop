package models;

import java.io.InputStream;

public class Book {
	
	private String title;
	private String author;
	private Double price;
	private int stock;
	private int id;
	private InputStream coverImage;
	private String description;
	private int categoryId;
	
	public Book() {
		// Default constructor
	}
	
	public Book(String title, String author, Double price, int stock, int id, InputStream coverImage, String description, int categoryId) {
		this.title = title;
		this.author = author;
		this.price = price;
		this.stock = stock;
		this.id = id;
		this.coverImage = coverImage;
		this.description = description;
		this.categoryId = categoryId;
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
	public Double getPrice() {
		return price;
	}
	public void setPrice(Double price) {
		this.price = price;
	}
	public int getStock() {
		return stock;
	}
	public void setStock(int stock) {
		this.stock = stock;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public InputStream getCoverImage() {
		return coverImage;
	}
	public void setCoverImage(InputStream coverImage) {
		this.coverImage = coverImage;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public int getCategoryId() {
		return categoryId;
	}
	public void setCategoryId(int categoryId) {
		this.categoryId = categoryId;
	}
	

}
