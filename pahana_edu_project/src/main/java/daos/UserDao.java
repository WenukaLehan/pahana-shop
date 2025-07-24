package daos;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import models.User;
import util.DbCon;
import util.EmailSender;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Random;

//import org.mindrot.jbcrypt.BCrypt;

public class UserDao {

    public User loginUser(String username, String password) throws SQLException, ClassNotFoundException {
        try (Connection con = DbCon.getConnection()) {
            String query = "SELECT * FROM users WHERE username = ? AND password = ?";
            PreparedStatement pst = con.prepareStatement(query);
            pst.setString(1, username);
            pst.setString(2, password); // In production, compare hashed password
            ResultSet rs = pst.executeQuery();

            if (rs.next()) {
                return new User( 
						rs.getString("id"),
						rs.getString("username"),
						rs.getString("email"),
						rs.getInt("role"),
						rs.getString("name"),
						rs.getString("phone")
				);
            }
            return null;
        }
    }

    public boolean sendResetCode(String email, HttpServletRequest request) throws SQLException, ClassNotFoundException {
        try (Connection con = DbCon.getConnection()) {
            String query = "SELECT id FROM users WHERE email = ?";
            PreparedStatement pst = con.prepareStatement(query);
            pst.setString(1, email);
            ResultSet rs = pst.executeQuery();

            if (rs.next()) {
                Random rand = new Random();
                int code = 100000 + rand.nextInt(900000); // Generate 6-digit code

                HttpSession session = request.getSession();
                session.setAttribute("resetCode", String.valueOf(code));
                session.setAttribute("resetEmail", email);

                // Send email with reset code
                try {
					EmailSender.sendEmail(email, "Password Reset Code", "Your password reset code is: " + code, request);
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
                System.out.println("Password Reset Code for " + email + " is: " + code);
                return true;
            }
            return false;
        }
    }

    public boolean changePassword(String email, String newPassword) throws SQLException, ClassNotFoundException {
        try (Connection con = DbCon.getConnection()) {
            // SECURITY NOTE: Hash the new password before storing
            // String hashedPassword = BCrypt.hashpw(newPassword, BCrypt.gensalt());
            String query = "UPDATE users SET password = ? WHERE email = ?";
            PreparedStatement pst = con.prepareStatement(query);
            pst.setString(1, newPassword); // Use hashedPassword in production
            pst.setString(2, email);

            int rowCount = pst.executeUpdate();
            return rowCount > 0;
        }
    }

	public InputStream getUserImage(String userId) {
				try (Connection con = DbCon.getConnection()) {
			String query = "SELECT p_image FROM users WHERE id = ?";
			PreparedStatement pst = con.prepareStatement(query);
			pst.setString(1, userId);
			ResultSet rs = pst.executeQuery();

			if (rs.next()) {
				return rs.getBinaryStream("p_image");
			}
		} catch (SQLException | ClassNotFoundException e) {
			e.printStackTrace();
			return null;
		}
		return null;
	}
    
}