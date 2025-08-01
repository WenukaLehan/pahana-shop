package models;

import java.sql.Date;

public class SalesReportItem {
 private int invoiceId;
 private String customerId;
 private String fullName; // Added to match frontend's expectation
 private Date date;
 private double total;
 private String method;
 private String status; // Assuming 'orders' table has a status
 private int items; // Assuming we can calculate or fetch this

 public SalesReportItem(int invoiceId, String customerId, String fullName, Date date, double total, String method, String status, int items) {
     this.invoiceId = invoiceId;
     this.customerId = customerId;
     this.fullName = fullName;
     this.date = date;
     this.total = total;
     this.method = method;
     this.status = status;
     this.items = items;
 }

 // Getters and Setters
 public int getInvoiceId() { return invoiceId; }
 public void setInvoiceId(int invoiceId) { this.invoiceId = invoiceId; }
 public String getCustomerId() { return customerId; }
 public void setCustomerId(String customerId) { this.customerId = customerId; }
 public String getFullName() { return fullName; }
 public void setFullName(String fullName) { this.fullName = fullName; }
 public Date getDate() { return date; }
 public void setDate(Date date) { this.date = date; }
 public double getTotal() { return total; }
 public void setTotal(double total) { this.total = total; }
 public String getMethod() { return method; }
 public void setMethod(String method) { this.method = method; }
 public String getStatus() { return status; }
 public void setStatus(String status) { this.status = status; }
 public int getItems() { return items; }
 public void setItems(int items) { this.items = items; }
}