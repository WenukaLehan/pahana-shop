package controllers;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Part;
import models.Customer;
import models.User;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.google.gson.Gson;

import daos.CustomerDao;

@MultipartConfig(
	    maxFileSize = 5 * 1024 * 1024, // 5MB
	    maxRequestSize = 10 * 1024 * 1024 // 10MB
	)
@WebServlet("/CustomerServlet")
public class CustomerServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    
    public CustomerServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String action = request.getParameter("action");
		
		switch (action) {
			case "addCustomer":
				addCustomer(request, response);
				break;
			case "updateCustomer":
				updateCustomer(request, response);
				break;
			case "updateCustomerUser":
				updateCustomerUser(request, response);
				break;
			case "deleteCustomer":
				deleteCustomer(request, response);
				break;
			case "getCustomer":
				getCustomer(request, response);
				break;
			case "getAllCustomers":
				try {
					getAllCustomers(request, response);
				} catch (ClassNotFoundException | SQLException | ServletException | IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				break;
			default:
				response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid action");
		}
	}


	private void getAllCustomers(HttpServletRequest request, HttpServletResponse response) throws ClassNotFoundException, SQLException, ServletException, IOException {
		
		CustomerDao customerDao = new CustomerDao();
		try {
			response.setContentType("application/json");
	        response.setCharacterEncoding("UTF-8");
	        
	        try (PrintWriter out = response.getWriter()){
	        	List<Customer> customers = customerDao.getAllCustomers();
	        	if(customers != null && !customers.isEmpty()) {
	        		
	        		 Map<String, Object> jsonResponse = new HashMap<>();
	                 jsonResponse.put("success", true);
	                 jsonResponse.put("data", customers);
	                 
	                 out.print(new Gson().toJson(jsonResponse));
	        		
	        	} else {
	        		Map<String, Object> errorResponse = new HashMap<>();
	                errorResponse.put("success", false);
	                errorResponse.put("message", "User not found or session expired.");

	                out.print(new Gson().toJson(errorResponse));
	                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
	        		
	        	}
	        	out.flush();
	        	
	        }
	        
		} catch (Exception e) {
			e.printStackTrace();
			response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error retrieving customers");
		}
		
	}
	
	private String getUid(String id) {
			
			int idInt;
			try {
				idInt = Integer.parseInt(id);
			} catch (NumberFormatException e) {
				throw new IllegalArgumentException("ID must be a non-negative integer");
			}
			
			if (id == null || id.isEmpty()) {
				throw new IllegalArgumentException("ID must be a non-negative integer");
			}
			return "p" + String.format("%03d", idInt); // Format ID as "pXX" where XX is the zero-padded integer
		}


	private void getCustomer(HttpServletRequest request, HttpServletResponse response) {
		try {
			response.setContentType("application/json");
	        response.setCharacterEncoding("UTF-8");
	        
	        CustomerDao customerDao = new CustomerDao();
	        User user = (User) request.getSession().getAttribute("user");
	        
	        Customer customer = customerDao.getCustomer(getUid(user.getId()));
	        
	        try (PrintWriter out = response.getWriter()) {
	        	if (customer != null) {
	        		out.print(new Gson().toJson(customer));
	        	} else {
	        		out.print("{\"success\": false, \"message\": \"Customer not found.\"}");
	        	}
	        	out.flush();
	        }
			
		}
		catch (Exception e) {
			e.printStackTrace();
			try {
				response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error retrieving customer");
			} catch (IOException ioException) {
				ioException.printStackTrace();
			}
		}
		
	}


	private void deleteCustomer(HttpServletRequest request, HttpServletResponse response) throws IOException {
		
		// TODO Auto-generated method stub
		try {
			response.setContentType("application/json");
	        response.setCharacterEncoding("UTF-8");
	        
	        CustomerDao customerDao = new CustomerDao();
	        String customerId = request.getParameter("id");
	        
	        boolean isDeleted = customerDao.deleteCustomerWithUser(customerId);
	        
	        try (PrintWriter out = response.getWriter()) {
	        	if (isDeleted) {
	        		out.print("{\"success\": true, \"message\": \"Customer deleted successfully.\"}");
	        	} else {
	        		out.print("{\"success\": false, \"message\": \"Failed to delete customer.\"}");
	        	}
	        	out.flush();
	        }
	        
		} catch (Exception e) {
			e.printStackTrace();
			response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error deleting customer");
		}
		
	}


	private void updateCustomer(HttpServletRequest request, HttpServletResponse response) throws IOException {
		// TODO Auto-generated method stub
		try {
			response.setContentType("application/json");
	        response.setCharacterEncoding("UTF-8");
	        
	        CustomerDao customerDao = new CustomerDao();
	        Customer customer = new Customer();
	        
	        // Assuming you have methods to get parameters from the request
	        customer.setU_id(request.getParameter("id"));
	        customer.setName(request.getParameter("name"));
	        customer.setEmail(request.getParameter("email"));
	        customer.setPhone(request.getParameter("phone"));
	        customer.setAddress(request.getParameter("address"));
	        customer.setStatus(request.getParameter("status"));
	        Part imagePart = request.getPart("image");
	        if (imagePart != null && imagePart.getSize() > 0) {
	            customer.setImage(imagePart.getInputStream());
	            System.out.println("Image part size: " + imagePart.getSize());
	        }else {
	        	System.out.println("Image part is null or empty");
	        }
	        
	        boolean isUpdated = customerDao.updateCustomerWithUser(customer, request);
	        
	        try (PrintWriter out = response.getWriter()) {
	        	if (isUpdated) {
	        		out.print("{\"success\": true, \"message\": \"Customer updated successfully.\"}");
	        	} else {
	        		out.print("{\"success\": false, \"message\": \"Failed to update customer.\"}");
	        	}
	        	out.flush();
	        }
	        
		} catch (Exception e) {
			e.printStackTrace();
			response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error updating customer");
		}
	}
	
	
	private void updateCustomerUser(HttpServletRequest request, HttpServletResponse response) throws IOException {
		// TODO Auto-generated method stub
		try {
			response.setContentType("application/json");
	        response.setCharacterEncoding("UTF-8");
	        User user = (User) request.getSession().getAttribute("user");
	        
	        CustomerDao customerDao = new CustomerDao();
	        Customer customer = new Customer();
	        
	        // Assuming you have methods to get parameters from the request
	        customer.setU_id(getUid(user.getId()));
	        customer.setName(request.getParameter("name"));
	        customer.setEmail(request.getParameter("email"));
	        customer.setPhone(request.getParameter("phone"));
	        customer.setAddress(request.getParameter("address"));
	        Part imagePart = request.getPart("image");
	        if (imagePart != null && imagePart.getSize() > 0) {
	            customer.setImage(imagePart.getInputStream());
	        }
	        
	        boolean isUpdated = customerDao.updateCustomerUserWithUser(customer, request);
	        
	        try (PrintWriter out = response.getWriter()) {
	        	if (isUpdated) {
	        		out.print("{\"success\": true, \"message\": \"Customer updated successfully.\"}");
	        	} else {
	        		out.print("{\"success\": false, \"message\": \"Failed to update customer.\"}");
	        	}
	        	out.flush();
	        }
	        
		} catch (Exception e) {
			e.printStackTrace();
			response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error updating customer");
		}
	}

	private void addCustomer(HttpServletRequest request, HttpServletResponse response) throws IOException {
		// TODO Auto-generated method stub
		try {
			response.setContentType("application/json");
	        response.setCharacterEncoding("UTF-8");
	        
	        CustomerDao customerDao = new CustomerDao();
	        Customer customer = new Customer();
	        
	        // Assuming you have methods to get parameters from the request
	        customer.setName(request.getParameter("name"));
	        customer.setEmail(request.getParameter("email"));
	        customer.setPhone(request.getParameter("phone"));
	        customer.setAddress(request.getParameter("address"));
	        customer.setStatus(request.getParameter("status"));
	        Part imagePart = request.getPart("image");
	        if (imagePart != null && imagePart.getSize() > 0) {
	            customer.setImage(imagePart.getInputStream());
	            System.out.println("Image part size: " + imagePart.getSize());
	        }else {
	        	System.out.println("Image part is null or empty");
	        }// Assuming image is uploaded as a part
	        
	        // Handle image upload if necessary
	        
	        boolean isAdded = customerDao.addCustomerWithUser(customer, request);
	        
	        try (PrintWriter out = response.getWriter()) {
	        	if (isAdded) {
	        		out.print("{\"success\": true, \"message\": \"Customer added successfully.\"}");
	        	} else {
	        		out.print("{\"success\": false, \"message\": \"Failed to add customer.\"}");
	        	}
	        	out.flush();
	        }
	        
		} catch (Exception e) {
			e.printStackTrace();
			response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error adding customer");
		}
	}

}












