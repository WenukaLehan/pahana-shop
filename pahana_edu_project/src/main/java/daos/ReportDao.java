package daos;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import util.DbCon;

import models.*;

public class ReportDao {
	

    public ReportDao() {
      
    }
	
	   private Connection getConnection()  {
	        try {
				return DbCon.getConnection();
			} catch (ClassNotFoundException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				}
	        return null;
	    }

	    

	   public List<SalesReportItem> getSalesReports(String fromDate, String toDate) {
	        List<SalesReportItem> reportList = new ArrayList<>();
	        // Corrected SQL query to satisfy ONLY_FULL_GROUP_BY mode
	        String sql = "SELECT o.invoice_id, o.cus_id, o.date, o.total, o.method, c.full_name, COUNT(oi.product_id) AS items, 'Completed' as status " +
	                     "FROM orders o " +
	                     "LEFT JOIN Customers c ON o.cus_id = c.u_id " +
	                     "LEFT JOIN oder_items oi ON o.invoice_id = oi.order_id " +
	                     "WHERE o.date BETWEEN ? AND ? " +
	                     "GROUP BY o.invoice_id, o.cus_id, o.date, o.total, o.method, c.full_name " + // All non-aggregated columns from SELECT must be here
	                     "ORDER BY o.date DESC";
	        
	        try (Connection conn = getConnection();
	             PreparedStatement ps = conn.prepareStatement(sql)) {
	            ps.setString(1, fromDate);
	            ps.setString(2, toDate);
	            try (ResultSet rs = ps.executeQuery()) {
	                while (rs.next()) {
	                    reportList.add(new SalesReportItem(
	                        rs.getInt("invoice_id"),
	                        rs.getString("cus_id"),
	                        rs.getString("full_name"),
	                        rs.getDate("date"),
	                        rs.getDouble("total"),
	                        rs.getString("method"),
	                        rs.getString("status"),
	                        rs.getInt("items")
	                    ));
	                }
	            }
	        } catch (SQLException e) {
	            e.printStackTrace();
	        }
	        return reportList;
	    }

	    public List<ProductReportItem> getProductReports() {
	        List<ProductReportItem> reportList = new ArrayList<>();
	        String sql = "SELECT b.book_id, b.b_name, b.cat_id, b.price, b.stock, SUM(oi.quantity) AS sold_qty " +
	                     "FROM books b " +
	                     "LEFT JOIN oder_items oi ON b.book_id = oi.product_id " +
	                     "GROUP BY b.book_id " +
	                     "ORDER BY sold_qty DESC";

	        try (Connection conn = getConnection();
	             PreparedStatement ps = conn.prepareStatement(sql);
	             ResultSet rs = ps.executeQuery()) {
	            while (rs.next()) {
	                reportList.add(new ProductReportItem(
	                    rs.getInt("book_id"),
	                    rs.getString("b_name"),
	                    rs.getInt("cat_id"),
	                    rs.getInt("sold_qty"),
	                    rs.getDouble("price"),
	                    rs.getInt("stock")
	                ));
	            }
	        } catch (SQLException e) {
	            e.printStackTrace();
	        }
	        return reportList;
	    }

	    public List<CustomerReportItem> getCustomerReports() {
	        List<CustomerReportItem> reportList = new ArrayList<>();
	        String sql = "SELECT c.u_id, c.full_name, c.email, c.status, COUNT(o.invoice_id) AS total_orders, " +
	                     "SUM(o.total) AS total_spent, MAX(o.date) AS last_order_date " +
	                     "FROM Customers c " +
	                     "LEFT JOIN orders o ON c.u_id = o.cus_id " +
	                     "GROUP BY c.u_id, c.full_name, c.email, c.status " + // Added c.full_name, c.email, c.status to GROUP BY
	                     "ORDER BY total_spent DESC";

	        try (Connection conn = getConnection();
	             PreparedStatement ps = conn.prepareStatement(sql);
	             ResultSet rs = ps.executeQuery()) {
	            while (rs.next()) {
	                reportList.add(new CustomerReportItem(
	                    rs.getString("u_id"),
	                    rs.getString("full_name"),
	                    rs.getString("email"),
	                    rs.getDate("last_order_date"),
	                    rs.getInt("total_orders"),
	                    rs.getDouble("total_spent"),
	                    rs.getString("status")
	                ));
	            }
	        } catch (SQLException e) {
	            e.printStackTrace();
	        }
	        return reportList;
	    }

	    public List<ProductReportItem> getInventoryReports() {
	        // Inventory report is essentially the same as product report but might be sorted differently or include more info.
	        // For simplicity, we'll reuse the product query.
	        return getProductReports();
	    }

}
