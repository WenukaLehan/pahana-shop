package daos;

import java.sql.*;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import models.Order;
import models.OrderItem;
import models.User;
import util.DbCon;

public class OrderDao {
	
	private final Connection conn;
	
	public OrderDao() throws ClassNotFoundException, SQLException {
		
		this.conn = DbCon.getConnection();
	}
	
	public boolean placeOrder(Order order) {
		try {
			
			String query = "INSERT INTO orders (invoice_id,date, cus_id, total,method) VALUES (?,NOW(), ?, ?,?)";
			var stmt = conn.prepareStatement(query);
			// Assuming customer_id and total_amount are obtained from the request or order object
			stmt.setInt(1, order.getOrderId());
			stmt.setString(2, order.getCustomerId());
			stmt.setDouble(3, order.getTotalAmount());
			stmt.setString(4, order.getMethod());
			
			int rowsAffected = stmt.executeUpdate();
			
			if (rowsAffected > 0) {
				//get the order ID of the newly inserted order
				int orderId = getInvoice();
				
				for (var item : order.getOrderItems()) {
					String itemQuery = "INSERT INTO oder_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)";
					var itemStmt = conn.prepareStatement(itemQuery);
					itemStmt.setInt(1, orderId);
					itemStmt.setInt(2, item.getProductId());
					itemStmt.setInt(3, item.getQuantity());
					itemStmt.setDouble(4, item.getPrice());
					int x = itemStmt.executeUpdate();
					if (x > 0) {
						ManageInventory(item.getProductId(), item.getQuantity());
					}
					
				}
				return true; // Order placed successfully
			}
			return false; // Order placement failed
			
		} 
		catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	private void ManageInventory(int productId, int quantity) {
		try {
			String query = "UPDATE books SET stock = stock - ? WHERE book_id = ?";
			var stmt = conn.prepareStatement(query);
			stmt.setInt(1, quantity);
			stmt.setInt(2, productId);
			stmt.executeUpdate();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	public Order getOrderDetails(int orderId) {
		Order order = null;
		String orderQuery = "SELECT * FROM orders WHERE invoice_id = ?";
		String itemsQuery = "SELECT * FROM oder_items WHERE order_id = ?";

		try (PreparedStatement orderStmt = conn.prepareStatement(orderQuery);
			 PreparedStatement itemsStmt = conn.prepareStatement(itemsQuery)) {

			// Fetch order details
			orderStmt.setInt(1, orderId);
			ResultSet rs = orderStmt.executeQuery();
			if (rs.next()) {
				order = new Order();
				order.setOrderId(rs.getInt("invoice_id"));
				order.setCustomerId(rs.getString("cus_id"));
				order.setTotalAmount(rs.getDouble("total"));
				order.setOrderDate(rs.getString("date")); // Assuming date is a String
				order.setMethod(rs.getString("method"));
			}

			if (order != null) {
				// Fetch and add order items
				itemsStmt.setInt(1, orderId);
				ResultSet itemsRs = itemsStmt.executeQuery();
				List<OrderItem> items = new ArrayList<>();
				while (itemsRs.next()) {
					OrderItem item = new OrderItem();
					item.setOrderItemId(itemsRs.getInt("item_id"));
					item.setOrderId(itemsRs.getInt("order_id"));
					item.setProductId(itemsRs.getInt("product_id"));
					item.setQuantity(itemsRs.getInt("quantity"));
					item.setPrice(itemsRs.getDouble("price"));
					items.add(item);
				}
				order.setOrderItems(items);
			}

		} catch (SQLException e) {
			e.printStackTrace();
		}
		return order;
	}
	
	public int getInvoice() {
		try {
			String query = "SELECT COUNT(*) FROM orders";
			var stmt = conn.prepareStatement(query);
			var rs = stmt.executeQuery();
			if (rs.next()) {
				if (rs.getInt(1) > 0) {
					return rs.getInt(1);
				} else {
					return 1; // No orders found
				}
			}
			return 0; // Error in query execution
			
		} catch (Exception e) {
			e.printStackTrace();
			return 0;
		}
	}
	
	public List<Order> getAllOrders(String userId) {
		List<Order> orders = new ArrayList<>();
		String query = "SELECT * FROM orders WHERE cus_id = ?";

		try (PreparedStatement stmt = conn.prepareStatement(query)) {
			System.out.println("Fetching orders for user: " + userId);
			stmt.setString(1, userId);
			ResultSet rs = stmt.executeQuery();
			while (rs.next()) {
				Order order = new Order();
				order.setOrderId(rs.getInt("invoice_id"));
				order.setCustomerId(rs.getString("cus_id"));
				order.setTotalAmount(rs.getDouble("total"));
				order.setOrderDate(rs.getString("date"));
				order.setMethod(rs.getString("method"));
				
				// Fetch order items for each order
				String itemsQuery = "SELECT * FROM oder_items WHERE order_id = ?";
				try (PreparedStatement itemsStmt = conn.prepareStatement(itemsQuery)) {
					itemsStmt.setInt(1, order.getOrderId());
					ResultSet itemsRs = itemsStmt.executeQuery();
					List<OrderItem> items = new ArrayList<>();
					while (itemsRs.next()) {
						OrderItem item = new OrderItem();
						item.setOrderItemId(itemsRs.getInt("order_item_id"));
						item.setOrderId(itemsRs.getInt("order_id"));
						item.setProductId(itemsRs.getInt("product_id"));
						item.setQuantity(itemsRs.getInt("quantity"));
						item.setPrice(itemsRs.getDouble("price"));
						items.add(item);
					}
					order.setOrderItems(items);
				}
				
				orders.add(order);
				
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		System.out.println(orders);
		return orders;
		
	}

}
