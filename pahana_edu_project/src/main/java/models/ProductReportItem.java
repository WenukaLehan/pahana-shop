package models;

public class ProductReportItem {
 private int bookId;
 private String bookName;
 private int categoryId; // Corresponds to `cat_id` in `books`
 private int sold_qty; // This will be calculated
 private double price;
 private int stock;

 public ProductReportItem(int bookId, String bookName, int categoryId, int sold_qty, double price, int stock) {
     this.bookId = bookId;
     this.bookName = bookName;
     this.categoryId = categoryId;
     this.sold_qty = sold_qty;
     this.price = price;
     this.stock = stock;
 }

 // Getters and Setters
 public int getBookId() { return bookId; }
 public void setBookId(int bookId) { this.bookId = bookId; }
 public String getBookName() { return bookName; }
 public void setBookName(String bookName) { this.bookName = bookName; }
 public int getCategoryId() { return categoryId; }
 public void setCategoryId(int categoryId) { this.categoryId = categoryId; }
 public int getSold_qty() { return sold_qty; }
 public void setSold_qty(int sold_qty) { this.sold_qty = sold_qty; }
 public double getPrice() { return price; }
 public void setPrice(double price) { this.price = price; }
 public int getStock() { return stock; }
 public void setStock(int stock) { this.stock = stock; }
}