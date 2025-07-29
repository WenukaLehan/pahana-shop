package daos;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import models.Category;
import util.DbCon;

public class CategoryDao {
	
	private final Connection conn;
	
	public CategoryDao() throws ClassNotFoundException, SQLException {
		this.conn = DbCon.getConnection();
	}
	
	// Example method to get a category by ID
	public Category getCategoryById(int id) {
		try {
			String sql = "SELECT * FROM category WHERE cat_id = ?";
			try (var stmt = conn.prepareStatement(sql)) {
				stmt.setInt(1, id);
				try (var rs = stmt.executeQuery()) {
					if (rs.next()) {
						return new Category(rs.getInt("cat_id"), rs.getString("cat_name"), rs.getString("description"), rs.getString("status"));
					}
					return null; // No category found with the given ID
				}
			}
			
		} catch (Exception e) {
			e.printStackTrace();
			return null; // Handle exceptions appropriately
		}
	}
	
	// Example method to create a new category
	public boolean createCategory(Category category) {
		// Logic to insert a new category into the database
		String sql = "INSERT INTO category (cat_name, description) VALUES (?, ?)";
		try (var stmt = conn.prepareStatement(sql)) {
			stmt.setString(1, category.getName());
			stmt.setString(2, category.getDescription());
			return stmt.executeUpdate() > 0; // Returns true if the insert was successful
		} catch (SQLException e) {
			e.printStackTrace();
			return false; // Handle exceptions appropriately
		}
	}
	
	// Additional methods for updating and deleting categories can be added here.
	public boolean updateCategory(Category category) {
		// Logic to update an existing category in the database
		String sql = "UPDATE category SET cat_name = ?, description = ?, status =? WHERE cat_id = ?";
		try (var stmt = conn.prepareStatement(sql)) {
			stmt.setString(1, category.getName());
			stmt.setString(2, category.getDescription());
			stmt.setString(3, category.getStatus());
			stmt.setInt(4, category.getId());
			
			return stmt.executeUpdate() > 0; // Returns true if the update was successful
		} catch (SQLException e) {
			e.printStackTrace();
			return false; // Handle exceptions appropriately
		}
	}
	
	public boolean deleteCategory(int id) {
		// Logic to delete a category from the database by ID
		String sql = "DELETE FROM category WHERE cat_id = ?";
		try (var stmt = conn.prepareStatement(sql)) {
			stmt.setInt(1, id);
			return stmt.executeUpdate() > 0; // Returns true if the delete was successful
		} catch (SQLException e) {
			e.printStackTrace();
			return false; // Handle exceptions appropriately
		}
	}
	
	public List<Category> getAllCategories() {
		// Logic to retrieve all categories from the database
		List<Category> categories = new ArrayList<>();
		String sql = "SELECT * FROM category";
		try (var stmt = conn.prepareStatement(sql);
			 var rs = stmt.executeQuery()) {
			while (rs.next()) {
				categories.add(new Category(rs.getInt("cat_id"), rs.getString("cat_name"), rs.getString("description"), rs.getString("status")));
			}
			return categories; // Returns the list of all categories
		} catch (SQLException e) {
			e.printStackTrace(); // Handle exceptions appropriately
			return new ArrayList<>(); // Return an empty list in case of an error
		}
	}
	
	public boolean ChangeStatus(int id, String status) {
		// Logic to change the status of a category
		String sql = "UPDATE category SET status = ? WHERE cat_id = ?";
		try (var stmt = conn.prepareStatement(sql)) {
			stmt.setString(1, status);
			stmt.setInt(2, id);
			return stmt.executeUpdate() > 0; // Returns true if the status change was successful
		} catch (SQLException e) {
			e.printStackTrace(); // Handle exceptions appropriately
			return false; // Return false in case of an error
		}
	}

}
