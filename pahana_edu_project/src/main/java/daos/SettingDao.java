package daos;

import java.security.SecureRandom;
import java.sql.*;
import java.util.*;

import jakarta.servlet.http.HttpServletRequest;
import models.User;
import util.DbCon;
import util.EmailSender;

public class SettingDao {
	
	private Connection conn;
	
	public SettingDao()  {
		try {
			conn = DbCon.getConnection();
		} catch (ClassNotFoundException | SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			conn = null;
		}
	}
	
	
	public List<User> getAllUsers() {
		List<User> users = new ArrayList<>();
		String query = "SELECT * FROM users";
		
		try (PreparedStatement ps = conn.prepareStatement(query);
			 ResultSet rs = ps.executeQuery()) {
			
			while (rs.next()) {
				User user = new User();
				user.setId(rs.getString("id"));
				user.setEmail(rs.getString("email"));
				user.setRole(rs.getInt("role"));
				user.setName(rs.getString("name"));
				user.setPhone(rs.getString("phone"));
				user.setStatus(rs.getString("status"));
				users.add(user);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return users;
	}
	
	public boolean updateUserStatus(String userId, String status) {
		String query = "UPDATE users SET status = ? WHERE id = ?";
		try (PreparedStatement ps = conn.prepareStatement(query)) {
			ps.setString(1, status);
			ps.setString(2, userId);
			int rowsUpdated = ps.executeUpdate();
			return rowsUpdated > 0;
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
	}
	
	public boolean updateUser(User user) {
		String query = "UPDATE users SET email = ?, p_image = ?, name = ?, phone = ?, username = ? WHERE id = ?";
		try (PreparedStatement ps = conn.prepareStatement(query)) {
			ps.setString(1, user.getEmail());
			ps.setBlob(2, user.getImage());
			ps.setString(3, user.getName());
			ps.setString(4, user.getPhone());
			ps.setString(5, user.getUsername());
			ps.setString(6, user.getId());
			int rowsUpdated = ps.executeUpdate();
			return rowsUpdated > 0;
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
		
	}
	
	public boolean addUser(User user, HttpServletRequest request) throws Exception {
		String query = "INSERT INTO users ( username, email, role, name, phone, p_image, status, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
		String password = getPassword();
		try (PreparedStatement ps = conn.prepareStatement(query)) {
			ps.setString(1, user.getUsername());
			ps.setString(2, user.getEmail());
			ps.setInt(3, user.getRole());
			ps.setString(4, user.getName());
			ps.setString(5, user.getPhone());
			ps.setBlob(6, user.getImage());
			ps.setString(7, "active");
			ps.setString(8, password); // Generate a random password
			int rowsInserted = ps.executeUpdate();
			if (rowsInserted > 0) {
				EmailSender.sendEmail(
	            	    user.getEmail(),
	            	    "Welcome to Pahana EDU",
	            	    "Dear " + user.getName() + ",<br/>" +
	            	    "Your account has been created successfully.<br/>" +
	            	    "Username: " + user.getEmail() + "<br/>" +
	            	    "Password: " + password + "<br/>" +
	            	    "Please log in and complete your profile.<br/><br/>" +
	            	    "Thank you for choosing Pahana EDU!",
	            	    request
	            	);
			}
			return rowsInserted > 0;
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
	}
	
	public boolean updateSetting(String settingName, boolean settingValue) {
		String query = "UPDATE settings SET value = ? WHERE name = ?";
		try (PreparedStatement ps = conn.prepareStatement(query)) {
			ps.setBoolean(1, settingValue);
			ps.setString(2, settingName);
			int rowsUpdated = ps.executeUpdate();
			return rowsUpdated > 0;
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
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
	
	

}
