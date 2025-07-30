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
	
	public boolean placeOrder() {
		// Logic to place an order in the database
		return false; // Return true if order is placed successfully, otherwise false
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
