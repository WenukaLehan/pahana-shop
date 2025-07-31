package daos;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

import models.Order;
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
		// Logic to retrieve order details from the database
		return null;
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
	
	public List<Order> getAllOrders() {
		// Logic to retrieve all orders from the database
		return null;
	}

}
