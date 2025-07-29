package controllers;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import models.Category;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.google.gson.Gson;

import daos.CategoryDao;

@MultipartConfig(
	    maxFileSize = 5 * 1024 * 1024, // 5MB
	    maxRequestSize = 10 * 1024 * 1024 // 10MB
	)
@WebServlet("/CategoryServlet")
public class CategoryServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
   
    public CategoryServlet() {
        super();
        // TODO Auto-generated constructor stub
    }


	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// Handle POST requests for category operations
		String action = request.getParameter("action");
		
		switch (action) {
			case "create":
				CreateCategory(request, response);
				break;
			case "update":
				UpdateCategory(request, response);
				break;
			case "delete":
				DeleteCategory(request, response);
				break;
			case "changeStatus":
				ChangeStatus(request, response);
				break;
			case "list":
				ListCategories(request, response);
				break;
			default:
				response.sendRedirect("error.jsp"); // Handle unknown actions
		}
	}


	private void ListCategories(HttpServletRequest request, HttpServletResponse response) throws IOException {
	    try {
	        response.setContentType("application/json");
	        response.setCharacterEncoding("UTF-8");

	        CategoryDao categoryDao = new CategoryDao();
	        List<Category> categories = categoryDao.getAllCategories();

	        try (PrintWriter out = response.getWriter()) {
	            if (categories != null && !categories.isEmpty()) {
	                Map<String, Object> jsonResponse = new HashMap<>();
	                jsonResponse.put("success", true);
	                jsonResponse.put("categories", categories);
	                out.print(new Gson().toJson(jsonResponse));
	            } else {
	                Map<String, Object> errorResponse = new HashMap<>();
	                errorResponse.put("success", false);
	                errorResponse.put("message", "Categories not found");
	                out.print(new Gson().toJson(errorResponse));
	                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
	            }
	            out.flush();
	        }
	    } catch (SQLException | ClassNotFoundException e) {
	        e.printStackTrace();
	        Map<String, Object> errorResponse = new HashMap<>();
	        errorResponse.put("success", false);
	        errorResponse.put("message", "Database error: " + e.getMessage());
	        try (PrintWriter out = response.getWriter()) {
	            out.print(new Gson().toJson(errorResponse));
	            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
	            out.flush();
	        }
	    } catch (Exception e) {
	        e.printStackTrace();
	        Map<String, Object> errorResponse = new HashMap<>();
	        errorResponse.put("success", false);
	        errorResponse.put("message", "Error retrieving category list: " + e.getMessage());
	        try (PrintWriter out = response.getWriter()) {
	            out.print(new Gson().toJson(errorResponse));
	            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
	            out.flush();
	        }
	    }
	}


	private void ChangeStatus(HttpServletRequest request, HttpServletResponse response) throws IOException {
		try {
			int categoryId = Integer.parseInt(request.getParameter("cat_id"));
			String status = request.getParameter("status");

			CategoryDao categoryDao = new CategoryDao();
			boolean isUpdated = categoryDao.ChangeStatus(categoryId, status);

			response.setContentType("application/json");
			PrintWriter out = response.getWriter();
			if (isUpdated) {
				out.print("{\"success\": true, \"message\": \"Category status updated successfully.\"}");
			} else {
				out.print("{\"success\": false, \"message\": \"Failed to update category status.\"}");
			}
			out.flush();
		} catch (NumberFormatException e) {
			response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid category ID.");
		} catch (SQLException | ClassNotFoundException e) {
			e.printStackTrace();
			response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Database error: " + e.getMessage());
		}
	}


	private void DeleteCategory(HttpServletRequest request, HttpServletResponse response) throws IOException {
		// TODO Auto-generated method stub
		try {
			int categoryId = Integer.parseInt(request.getParameter("cat_id"));
			CategoryDao categoryDao = new CategoryDao();
			boolean isDeleted = categoryDao.deleteCategory(categoryId);
			
			response.setContentType("application/json");
			PrintWriter out = response.getWriter();
			if (isDeleted) {
				out.print("{\"success\": true, \"message\": \"Category deleted successfully.\"}");
			} else {
				out.print("{\"success\": false, \"message\": \"Failed to delete category.\"}");
			}
			out.flush();
		} catch (NumberFormatException e) {
			response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid category ID.");
		} catch (SQLException | ClassNotFoundException e) {
			e.printStackTrace();
			response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Database error: " + e.getMessage());
		}
	}


	private void UpdateCategory(HttpServletRequest request, HttpServletResponse response) throws IOException {
		// TODO Auto-generated method stub
		try {
			int categoryId = Integer.parseInt(request.getParameter("cat_id"));
			String name = request.getParameter("name");
			String description = request.getParameter("description");
			String status = request.getParameter("status");

			Category category = new Category(categoryId, name, description, status);
			CategoryDao categoryDao = new CategoryDao();
			boolean isUpdated = categoryDao.updateCategory(category);

			response.setContentType("application/json");
			PrintWriter out = response.getWriter();
			if (isUpdated) {
				out.print("{\"success\": true, \"message\": \"Category updated successfully.\"}");
			} else {
				out.print("{\"success\": false, \"message\": \"Failed to update category.\"}");
			}
			out.flush();
		} catch (NumberFormatException e) {
			response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid category ID.");
		} catch (SQLException | ClassNotFoundException e) {
			e.printStackTrace();
			response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Database error: " + e.getMessage());
		}
	}


	private void CreateCategory(HttpServletRequest request, HttpServletResponse response) throws IOException {
		try {
			String name = request.getParameter("name");
			String description = request.getParameter("description");

			Category category = new Category(0, name, description, "active"); // Default status is "active"
			CategoryDao categoryDao = new CategoryDao();
			boolean isCreated = categoryDao.createCategory(category);

			response.setContentType("application/json");
			PrintWriter out = response.getWriter();
			if (isCreated) {
				out.print("{\"success\": true, \"message\": \"Category created successfully.\"}");
			} else {
				out.print("{\"success\": false, \"message\": \"Failed to create category.\"}");
			}
			out.flush();
		} catch (SQLException | ClassNotFoundException e) {
			e.printStackTrace();
			response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Database error: " + e.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
			response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid input: " + e.getMessage());
		}
	}

}
