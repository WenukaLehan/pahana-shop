package models;

import java.sql.Date;

public class CustomerReportItem {
 private String userId; // u_id from Customers table
 private String fullName;
 private String email;
 private Date date; // last order date
 private int total_orders; // Calculated
 private double total_spent; // Calculated
 private String status;

 public CustomerReportItem(String userId, String fullName, String email, Date date, int total_orders, double total_spent, String status) {
     this.userId = userId;
     this.fullName = fullName;
     this.email = email;
     this.date = date;
     this.total_orders = total_orders;
     this.total_spent = total_spent;
     this.status = status;
 }

 // Getters and Setters
 public String getUserId() { return userId; }
 public void setUserId(String userId) { this.userId = userId; }
 public String getFullName() { return fullName; }
 public void setFullName(String fullName) { this.fullName = fullName; }
 public String getEmail() { return email; }
 public void setEmail(String email) { this.email = email; }
 public Date getDate() { return date; }
 public void setDate(Date date) { this.date = date; }
 public int getTotal_orders() { return total_orders; }
 public void setTotal_orders(int total_orders) { this.total_orders = total_orders; }
 public double getTotal_spent() { return total_spent; }
 public void setTotal_spent(double total_spent) { this.total_spent = total_spent; }
 public String getStatus() { return status; }
 public void setStatus(String status) { this.status = status; }
}