package models;

import java.util.List;

public class Order {
	
	private int orderId;
	private String customerId;
	private String orderDate;
	private double totalAmount;
	private String method;
	private List<OrderItem> orderItems;
	
	public int getOrderId() {
		return orderId;
	}
	public void setOrderId(int orderId) {
		this.orderId = orderId;
	}
	public String getCustomerId() {
		return customerId;
	}
	public void setCustomerId(String customerId) {
		this.customerId = customerId;
	}
	public String getOrderDate() {
		return orderDate;
	}
	public void setOrderDate(String orderDate) {
		this.orderDate = orderDate;
	}
	public double getTotalAmount() {
		return totalAmount;
	}
	public void setTotalAmount(double totalAmount) {
		this.totalAmount = totalAmount;
	}
	public String getMethod() {
		return method;
	}
	public void setMethod(String status) {
		this.method = status;
	}
	public List<OrderItem> getOrderItems() {
		return orderItems;
	}
	public void setOrderItems(List<OrderItem> orderItems) {
		this.orderItems = orderItems;
	}
	public Order(int orderId, String customerId, String orderDate, double totalAmount, String status, List<OrderItem> orderItems) {
		this.orderId = orderId;
		this.customerId = customerId;
		this.orderDate = orderDate;
		this.totalAmount = totalAmount;
		this.method = status;
		this.orderItems = orderItems;
	}
	public Order() {
		// Default constructor
	}
}


