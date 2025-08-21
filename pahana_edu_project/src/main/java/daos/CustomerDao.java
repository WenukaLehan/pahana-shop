package daos;

import java.io.InputStream;
import java.sql.*;
import java.util.*;

import jakarta.servlet.http.HttpServletRequest;
import models.Customer;
import util.DbCon;
import util.EmailSender;

import java.security.SecureRandom;

public class CustomerDao {

    private final Connection con;

    public CustomerDao() throws ClassNotFoundException, SQLException {
        this.con = DbCon.getConnection();
    }

 
    public boolean addCustomerWithUser(Customer customer, HttpServletRequest request) {
        Connection conn = null;
        PreparedStatement userStmt = null;
        PreparedStatement getIdStmt = null;
        PreparedStatement customerStmt = null;
        ResultSet rs = null;

        try {
            conn = DbCon.getConnection();
            conn.setAutoCommit(false); // Start transaction
            
            String password = getPassword(); // Generate a secure password
            
            // 1. Insert into users
            String insertUserSQL = "INSERT INTO users (username, name, phone, email, password, role, p_image) VALUES (?, ?, ?, ?, ?, ?, ?)";
            userStmt = conn.prepareStatement(insertUserSQL, Statement.RETURN_GENERATED_KEYS);
            userStmt.setString(1, customer.getEmail());
            userStmt.setString(2, customer.getName());
            userStmt.setString(3, customer.getPhone());
            userStmt.setString(4, customer.getEmail());
            userStmt.setString(5, password); // Make sure this generates a valid password
            userStmt.setInt(6, 3); // role = 3 for customer
            userStmt.setBlob(7, customer.getImage()); // Assuming customer.getImage() returns InputStream or Blob

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
            
            EmailSender.sendEmail(
            	    customer.getEmail(),
            	    "Welcome to Pahana EDU",
            	    "Dear " + customer.getName() + ",<br/>" +
            	    "Your account has been created successfully.<br/>" +
            	    "Username: " + customer.getEmail() + "<br/>" +
            	    "Password: " + password + "<br/>" +
            	    "Please log in and complete your profile.<br/><br/>" +
            	    "Thank you for choosing Pahana EDU!",
            	    request
            	);
            
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
        final int length = 12;
        final String upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        final String lower = "abcdefghijklmnopqrstuvwxyz";
        final String digits = "0123456789";
        final String special = "!@#$%^&*()-_=+[]{}|;:,.<>?";

        final String allChars = upper + lower + digits + special;
        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder();

        // Ensure at least one character from each group is included
        password.append(upper.charAt(random.nextInt(upper.length())));
        password.append(lower.charAt(random.nextInt(lower.length())));
        password.append(digits.charAt(random.nextInt(digits.length())));
        password.append(special.charAt(random.nextInt(special.length())));

        // Fill the rest with random characters
        for (int i = 4; i < length; i++) {
            password.append(allChars.charAt(random.nextInt(allChars.length())));
        }

        // Shuffle the characters to avoid predictable pattern
        char[] pwdArray = password.toString().toCharArray();
        for (int i = pwdArray.length - 1; i > 0; i--) {
            int j = random.nextInt(i + 1);
            char temp = pwdArray[i];
            pwdArray[i] = pwdArray[j];
            pwdArray[j] = temp;
        }

        return new String(pwdArray);
    }


	// Update customer
    public boolean updateCustomerWithUser(Customer customer, HttpServletRequest request) {
        Connection conn = null;
        PreparedStatement userStmt = null;
        PreparedStatement customerStmt = null;

        try {
            conn = DbCon.getConnection();
            conn.setAutoCommit(false); // Begin transaction

         // 1. Update users table
            String updateUserSQL;
            if (customer.getImage() != null) {
            					System.out.println("Updating user with image.");
                updateUserSQL = "UPDATE users SET name = ?, phone = ?, email = ?, p_image = ? WHERE u_id = ?";
                userStmt = conn.prepareStatement(updateUserSQL);
                userStmt.setString(1, customer.getName());
                userStmt.setString(2, customer.getPhone());
                userStmt.setString(3, customer.getEmail());
                userStmt.setBlob(4, customer.getImage());
                userStmt.setString(5, customer.getU_id());
                if (customer.getImage() == null) {
					System.out.println("Image is null, not updating image in users table.");
				}
            } else {
            	System.out.println("No image provided, updating without image.");
                updateUserSQL = "UPDATE users SET name = ?, phone = ?, email = ? WHERE u_id = ?";
                userStmt = conn.prepareStatement(updateUserSQL);
                userStmt.setString(1, customer.getName());
                userStmt.setString(2, customer.getPhone());
                userStmt.setString(3, customer.getEmail());
                userStmt.setString(4, customer.getU_id());
            }


            int userRows = userStmt.executeUpdate();
            if (userRows == 0) throw new SQLException("User update failed.");

            String updateCustomerSQL;
            if (customer.getImage() != null) {
                updateCustomerSQL = "UPDATE customers SET full_name = ?, address = ?, email = ?, status = ?, p_image = ?, phone_nu = ? WHERE u_id = ?";
                customerStmt = conn.prepareStatement(updateCustomerSQL);
                customerStmt.setString(1, customer.getName());
                customerStmt.setString(2, customer.getAddress());
                customerStmt.setString(3, customer.getEmail());
                customerStmt.setString(4, customer.getStatus());
                customerStmt.setBlob(5, customer.getImage());
                customerStmt.setString(6, customer.getPhone());
                customerStmt.setString(7, customer.getU_id());
            } else {
                updateCustomerSQL = "UPDATE customers SET full_name = ?, address = ?, email = ?, status = ?, phone_nu = ? WHERE u_id = ?";
                customerStmt = conn.prepareStatement(updateCustomerSQL);
                customerStmt.setString(1, customer.getName());
                customerStmt.setString(2, customer.getAddress());
                customerStmt.setString(3, customer.getEmail());
                customerStmt.setString(4, customer.getStatus());
                customerStmt.setString(5, customer.getPhone());
                customerStmt.setString(6, customer.getU_id());
            }

            int customerRows = customerStmt.executeUpdate();
            if (customerRows == 0) throw new SQLException("Customer update failed.");

            conn.commit();

            // Optional: Send update notification email
            EmailSender.sendEmail(
                customer.getEmail(),
                "Your Pahana EDU Profile Has Been Updated",
                "Dear " + customer.getName() + ",<br/>" +
                "Your account information has been updated successfully.<br/>" +
                "If you didn't request this change, please contact support immediately.<br/><br/>" +
                "Thank you,<br/>Pahana EDU",
                request
            );

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
            try { if (userStmt != null) userStmt.close(); } catch (Exception ignored) {}
            try { if (customerStmt != null) customerStmt.close(); } catch (Exception ignored) {}
            try { if (conn != null) { conn.setAutoCommit(true); conn.close(); } } catch (Exception ignored) {}
        }
    }
    
    
    public boolean updateCustomerUserWithUser(Customer customer, HttpServletRequest request) {
        Connection conn = null;
        PreparedStatement userStmt = null;
        PreparedStatement customerStmt = null;

        try {
            conn = DbCon.getConnection();
            conn.setAutoCommit(false); // Begin transaction

         // 1. Update users table
            String updateUserSQL;
            if (customer.getImage() != null) {
                updateUserSQL = "UPDATE users SET name = ?, phone = ?, email = ?, p_image = ? WHERE u_id = ?";
                userStmt = conn.prepareStatement(updateUserSQL);
                userStmt.setString(1, customer.getName());
                userStmt.setString(2, customer.getPhone());
                userStmt.setString(3, customer.getEmail());
                userStmt.setBlob(4, customer.getImage());
                userStmt.setString(5, customer.getU_id());
            } else {
                updateUserSQL = "UPDATE users SET name = ?, phone = ?, email = ? WHERE u_id = ?";
                userStmt = conn.prepareStatement(updateUserSQL);
                userStmt.setString(1, customer.getName());
                userStmt.setString(2, customer.getPhone());
                userStmt.setString(3, customer.getEmail());
                userStmt.setString(4, customer.getU_id());
            }


            int userRows = userStmt.executeUpdate();
            if (userRows == 0) throw new SQLException("User update failed.");

            String updateCustomerSQL;
            if (customer.getImage() != null) {
                updateCustomerSQL = "UPDATE customers SET full_name = ?, address = ?, email = ?, p_image = ?, phone_nu = ? WHERE u_id = ?";
                customerStmt = conn.prepareStatement(updateCustomerSQL);
                customerStmt.setString(1, customer.getName());
                customerStmt.setString(2, customer.getAddress());
                customerStmt.setString(3, customer.getEmail());
                customerStmt.setBlob(4, customer.getImage());
                customerStmt.setString(5, customer.getPhone());
                customerStmt.setString(6, customer.getU_id());
            } else {
                updateCustomerSQL = "UPDATE customers SET full_name = ?, address = ?, email = ?, phone_nu = ? WHERE u_id = ?";
                customerStmt = conn.prepareStatement(updateCustomerSQL);
                customerStmt.setString(1, customer.getName());
                customerStmt.setString(2, customer.getAddress());
                customerStmt.setString(3, customer.getEmail());
                customerStmt.setString(4, customer.getPhone());
                customerStmt.setString(5, customer.getU_id());
            }

            int customerRows = customerStmt.executeUpdate();
            if (customerRows == 0) throw new SQLException("Customer update failed.");

            conn.commit();

            // Optional: Send update notification email
            EmailSender.sendEmail(
                customer.getEmail(),
                "Your Pahana EDU Profile Has Been Updated",
                "Dear " + customer.getName() + ",<br/>" +
                "Your account information has been updated successfully.<br/>" +
                "If you didn't request this change, please contact support immediately.<br/><br/>" +
                "Thank you,<br/>Pahana EDU",
                request
            );

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
            try { if (userStmt != null) userStmt.close(); } catch (Exception ignored) {}
            try { if (customerStmt != null) customerStmt.close(); } catch (Exception ignored) {}
            try { if (conn != null) { conn.setAutoCommit(true); conn.close(); } } catch (Exception ignored) {}
        }
    }


    // Delete customer
    public boolean deleteCustomerWithUser(String u_id) {
        Connection conn = null;
        PreparedStatement deleteCustomerStmt = null;
        PreparedStatement deleteUserStmt = null;

        try {
            conn = DbCon.getConnection();
            conn.setAutoCommit(false); // Begin transaction

            // 1. Delete from customers table
            String deleteCustomerSQL = "DELETE FROM customers WHERE u_id = ?";
            deleteCustomerStmt = conn.prepareStatement(deleteCustomerSQL);
            deleteCustomerStmt.setString(1, u_id);
            int customerRows = deleteCustomerStmt.executeUpdate();

            if (customerRows == 0) throw new SQLException("Customer deletion failed or not found.");

            // 2. Delete from users table
            String deleteUserSQL = "DELETE FROM users WHERE u_id = ?";
            deleteUserStmt = conn.prepareStatement(deleteUserSQL);
            deleteUserStmt.setString(1, u_id);
            int userRows = deleteUserStmt.executeUpdate();

            if (userRows == 0) throw new SQLException("User deletion failed or not found.");

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
            try { if (deleteCustomerStmt != null) deleteCustomerStmt.close(); } catch (Exception ignored) {}
            try { if (deleteUserStmt != null) deleteUserStmt.close(); } catch (Exception ignored) {}
            try { if (conn != null) { conn.setAutoCommit(true); conn.close(); } } catch (Exception ignored) {}
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
