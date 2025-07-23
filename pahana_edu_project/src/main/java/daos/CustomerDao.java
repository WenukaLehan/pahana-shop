package daos;

import java.io.InputStream;
import java.sql.*;
import java.util.*;
import models.Customer;
import util.DbCon;

public class CustomerDao {

    private final Connection con;

    public CustomerDao() throws ClassNotFoundException, SQLException {
        this.con = DbCon.getConnection();
    }

 
    public boolean addCustomerWithUser(Customer customer) {
        Connection conn = null;
        PreparedStatement userStmt = null;
        PreparedStatement getIdStmt = null;
        PreparedStatement customerStmt = null;
        ResultSet rs = null;

        try {
            conn = DbCon.getConnection();
            conn.setAutoCommit(false); // Start transaction

            // 1. Insert into users
            String insertUserSQL = "INSERT INTO users (username, name, phone, email, password, role) VALUES (?, ?, ?, ?, ?, ?)";
            userStmt = conn.prepareStatement(insertUserSQL, Statement.RETURN_GENERATED_KEYS);
            userStmt.setString(1, customer.getEmail());
            userStmt.setString(2, customer.getName());
            userStmt.setString(3, customer.getPhone());
            userStmt.setString(4, customer.getEmail());
            userStmt.setString(5, getPassword()); // Make sure this generates a valid password
            userStmt.setInt(6, 3); // role = 3 for customer

            int userRows = userStmt.executeUpdate();
            if (userRows == 0) throw new SQLException("User insert failed.");

            rs = userStmt.getGeneratedKeys();
            int generatedId = -1;
            if (rs.next()) {
                generatedId = rs.getInt(1);
            } else {
                throw new SQLException("Failed to get generated user ID.");
            }

            // 2. Get u_id using the generated ID
            String getUIdSQL = "SELECT u_id FROM users WHERE id = ?";
            getIdStmt = conn.prepareStatement(getUIdSQL);
            getIdStmt.setInt(1, generatedId);
            ResultSet uidResult = getIdStmt.executeQuery();

            String u_id = null;
            if (uidResult.next()) {
                u_id = uidResult.getString("u_id");
            } else {
                throw new SQLException("u_id not found for inserted user.");
            }

            // 3. Insert into customers
            String insertCustomerSQL = "INSERT INTO customers (u_id, full_name, address, email, status, p_image, phone_nu) VALUES (?, ?, ?, ?, ?, ?, ?)";
            customerStmt = conn.prepareStatement(insertCustomerSQL);
            customerStmt.setString(1, u_id);
            customerStmt.setString(2, customer.getName());
            customerStmt.setString(3, customer.getAddress());
            customerStmt.setString(4, customer.getEmail());
            customerStmt.setString(5, customer.getStatus());
            customerStmt.setBlob(6, customer.getImage());
            customerStmt.setString(7, customer.getPhone());

            int customerRows = customerStmt.executeUpdate();
            if (customerRows == 0) throw new SQLException("Customer insert failed.");

            conn.commit();
            return true;

        } catch (Exception e) {
            e.printStackTrace();
            try {
                if (conn != null) conn.rollback();
            } catch (SQLException rollbackEx) {
                rollbackEx.printStackTrace();
            }
            return false;

        } finally {
            try { if (rs != null) rs.close(); } catch (Exception ignored) {}
            try { if (userStmt != null) userStmt.close(); } catch (Exception ignored) {}
            try { if (getIdStmt != null) getIdStmt.close(); } catch (Exception ignored) {}
            try { if (customerStmt != null) customerStmt.close(); } catch (Exception ignored) {}
            try { if (conn != null) { conn.setAutoCommit(true); conn.close(); } } catch (Exception ignored) {}
        }
    }



    private String getPassword() {
		// TODO Auto-generated method stub
		return "123";
	}

	// Update customer
    public boolean updateCustomer(Customer customer) {
        String sql = "UPDATE customers SET full_name=?, address=?, email=?, status=?, p_image=?, phone_nu=? WHERE u_id=?";
        try (PreparedStatement stmt = con.prepareStatement(sql)) {
            stmt.setString(1, customer.getName());
            stmt.setString(3, customer.getAddress());
            stmt.setString(4, customer.getEmail());
            stmt.setString(5, customer.getStatus());
            stmt.setBlob(6, customer.getImage());
            stmt.setString(7, customer.getPhone());
            stmt.setString(8, customer.getU_id());
            return stmt.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // Delete customer
    public boolean deleteCustomer(String customerId) {
        String sql = "DELETE FROM customers WHERE u_id=?";
        try (PreparedStatement stmt = con.prepareStatement(sql)) {
            stmt.setString(1, customerId);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    // Get one customer
    public Customer getCustomer(String customerId) {
        String sql = "SELECT * FROM customers WHERE u_id=?";
        try (PreparedStatement stmt = con.prepareStatement(sql)) {
            stmt.setString(1, customerId);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return mapRowToCustomer(rs);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    // Get all customers
    public List<Customer> getAllCustomers() {
        List<Customer> customers = new ArrayList<>();

        String sql = "SELECT * FROM customers";
        try (Connection con = DbCon.getConnection();
             PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Customer customer = new Customer();
                customer.setU_id(String.valueOf(rs.getString("u_id")));
                customer.setName(rs.getString("full_name"));
                customer.setEmail(rs.getString("email"));
                customer.setPhone(rs.getString("phone_nu"));
                customer.setAddress(rs.getString("address"));
                customer.setAcc_nu(rs.getString("acc_nu"));
                customer.setStatus(rs.getString("status"));
                customer.setImage(rs.getBinaryStream("p_image"));

                customers.add(customer);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return customers;
    }


    // Map database row to Customer object
    private Customer mapRowToCustomer(ResultSet rs) throws SQLException {
        Customer customer = new Customer();
        customer.setU_id(rs.getString("u_id"));
        customer.setName(rs.getString("full_name"));
        customer.setAcc_nu(rs.getString("acc_nu"));
        customer.setAddress(rs.getString("address"));
        customer.setEmail(rs.getString("email"));
        customer.setStatus(rs.getString("status"));
        customer.setPhone(rs.getString("phone_nu"));
        customer.setImage(rs.getBlob("p_image").getBinaryStream());
        return customer;
    }

	public InputStream getCustomerImage(String u_id) {
		String sql = "SELECT p_image FROM customers WHERE u_id=?";
		try (PreparedStatement stmt = con.prepareStatement(sql)) {
			stmt.setString(1, u_id);
			ResultSet rs = stmt.executeQuery();
			if (rs.next()) {
				return rs.getBinaryStream("p_image");
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return null;
	}
}
