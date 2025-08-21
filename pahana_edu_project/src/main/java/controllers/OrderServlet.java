package controllers;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import models.Order;
import models.OrderItem;
import models.User;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.mail.MessagingException;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import daos.OrderDao;

@MultipartConfig(
		fileSizeThreshold = 1024 * 1024, // 1MB
		maxFileSize = 1024 * 1024 * 10, // 10MB
		maxRequestSize = 1024 * 1024 * 50 // 50MB
)
@WebServlet("/OrderServlet")
public class OrderServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    
    public OrderServlet() {
        super();
        // TODO Auto-generated constructor stub
    }


	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		String action = request.getParameter("action");
		
		switch (action) {
			case "placeOrder":
				PlaceOrder(request, response);
				break;
			case "getOrderDetails":
				GetOrderDetails(request, response);
				break;
			case "getInvoice":
				GetInvoice(request, response);
				break;
			case "getAllOrders":
				GetAllOrders(request, response);
				break;
			case "sendBill":
				SendBill(request, response);
				break;
			default:
				response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid action");
				return;
		}
		
	}


	private void SendBill(HttpServletRequest request, HttpServletResponse response) throws IOException {
		 response.setContentType("application/json");
	        response.setCharacterEncoding("UTF-8");
	        Gson gson = new Gson();
	        Map<String, Object> jsonResponse = new HashMap<>();

	        try {
	            // Extract parameters from the request
	            String email = request.getParameter("email");
	            String invoiceNumber = request.getParameter("invoiceNumber");
	            String pdfData = request.getParameter("pdfData"); // Base64 encoded PDF data

	            // Validate parameters
	            if (email == null || email.trim().isEmpty() || !email.matches("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")) {
	                jsonResponse.put("success", false);
	                jsonResponse.put("message", "Invalid or missing email address");
	                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
	                try (PrintWriter out = response.getWriter()) {
	                    out.print(gson.toJson(jsonResponse));
	                    out.flush();
	                }
	                return;
	            }
	            if (invoiceNumber == null || invoiceNumber.trim().isEmpty()) {
	                jsonResponse.put("success", false);
	                jsonResponse.put("message", "Missing invoice number");
	                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
	                try (PrintWriter out = response.getWriter()) {
	                    out.print(gson.toJson(jsonResponse));
	                    out.flush();
	                }
	                return;
	            }
	            if (pdfData == null || pdfData.trim().isEmpty()) {
	                jsonResponse.put("success", false);
	                jsonResponse.put("message", "Missing PDF data");
	                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
	                try (PrintWriter out = response.getWriter()) {
	                    out.print(gson.toJson(jsonResponse));
	                    out.flush();
	                }
	                return;
	            }

	            // Decode base64 PDF data into a byte array
	            byte[] pdfBytes;
	            try {
	                pdfBytes = Base64.getDecoder().decode(pdfData);
	            } catch (IllegalArgumentException e) {
	                jsonResponse.put("success", false);
	                jsonResponse.put("message", "Invalid PDF data format");
	                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
	                try (PrintWriter out = response.getWriter()) {
	                    out.print(gson.toJson(jsonResponse));
	                    out.flush();
	                }
	                return;
	            }

	            // Define the email body content
	            String emailBody = "Dear Customer,\n\nPlease find your invoice #" + invoiceNumber + " attached.\n\nThank you for your purchase!\n\nBest regards,\nPahana Edu Project";
	            String emailSubject = "Your Invoice #" + invoiceNumber;
	            String pdfAttachmentFileName = "invoice_" + invoiceNumber + ".pdf";

	            // Call the EmailUtil to send the email
	            util.EmailSender.sendEmailWithAttachment(
	                email,
	                emailSubject,
	                emailBody,
	                pdfBytes,
	                pdfAttachmentFileName,
	                request // Pass the request to resolve the logo path
	            );

	            // Prepare success response
	            jsonResponse.put("success", true);
	            jsonResponse.put("message", "Invoice email sent successfully");
	            response.setStatus(HttpServletResponse.SC_OK); // Set status to OK for success

	        } catch (MessagingException e) {
	            // Catch specific MessagingException for email-related errors
	            e.printStackTrace(); // Log the full stack trace for debugging
	            jsonResponse.put("success", false);
	            jsonResponse.put("message", "Failed to send email: " + e.getMessage());
	            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
	        } catch (Exception e) {
	            // Catch any other unexpected exceptions
	            e.printStackTrace(); // Log the full stack trace for debugging
	            jsonResponse.put("success", false);
	            jsonResponse.put("message", "Unexpected error: " + e.getMessage());
	            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
	        } finally {
	            // Ensure the JSON response is always written to the client
	            try (PrintWriter out = response.getWriter()) {
	                out.print(gson.toJson(jsonResponse));
	                out.flush();
	            }
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


	private void GetAllOrders(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        Gson gson = new Gson();
        Map<String, Object> jsonResponse = new HashMap<>();
        User user = (User) request.getSession().getAttribute("user");
        
        try {
            OrderDao orderDao = new OrderDao();
            List<Order> orders = orderDao.getAllOrders(getUid(user.getId()));
            
            if (orders != null && !orders.isEmpty()) {
                jsonResponse.put("success", true);
                jsonResponse.put("orders", orders);
            } else {
                jsonResponse.put("success", false);
                jsonResponse.put("message", "No orders found.");
            }
        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();
            jsonResponse.put("success", false);
            jsonResponse.put("message", "Database error: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            e.printStackTrace();
            jsonResponse.put("success", false);
            jsonResponse.put("message", "Error retrieving orders: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
        
        try (PrintWriter out = response.getWriter()) {
            out.print(gson.toJson(jsonResponse));
            out.flush();
        }
    }


	private void GetInvoice(HttpServletRequest request, HttpServletResponse response) throws IOException {
	    response.setContentType("application/json");
	    response.setCharacterEncoding("UTF-8");
	    
	    // Initialize Gson for JSON serialization
	    Gson gson = new Gson();
	    Map<String, Object> jsonResponse = new HashMap<>();
	    
	    try {
	        OrderDao orderDao = new OrderDao();
	        int invoiceNumber = orderDao.getInvoice();
	        
	        if (invoiceNumber > 0) {
	            jsonResponse.put("success", true);
	            jsonResponse.put("invoiceNumber", invoiceNumber);
	        } else {
	            jsonResponse.put("success", false);
	            jsonResponse.put("message", "No orders found");
	        }
	    } catch (Exception e) {
	        e.printStackTrace();
	        jsonResponse.put("success", false);
	        jsonResponse.put("message", "Error retrieving invoice: " + e.getMessage());
	        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
	    }
	    
	    try (PrintWriter out = response.getWriter()) {
	        // Serialize the map to JSON and write to response
	        out.print(gson.toJson(jsonResponse));
	        out.flush();
	    }
	}


	private void GetOrderDetails(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        Gson gson = new Gson();
        Map<String, Object> jsonResponse = new HashMap<>();
        
        try {
            String orderIdStr = request.getParameter("orderId");
            if (orderIdStr == null || orderIdStr.trim().isEmpty()) {
                jsonResponse.put("success", false);
                jsonResponse.put("message", "Order ID is missing.");
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                try (PrintWriter out = response.getWriter()) {
                    out.print(gson.toJson(jsonResponse));
                    out.flush();
                }
                return;
            }
            
            int orderId = Integer.parseInt(orderIdStr);
            
            OrderDao orderDao = new OrderDao();
            Order order = orderDao.getOrderDetails(orderId);
            
            if (order != null) {
                jsonResponse.put("success", true);
                jsonResponse.put("order", order);
            } else {
                jsonResponse.put("success", false);
                jsonResponse.put("message", "Order not found for ID: " + orderId);
            }
        } catch (NumberFormatException e) {
            jsonResponse.put("success", false);
            jsonResponse.put("message", "Invalid Order ID format.");
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();
            jsonResponse.put("success", false);
            jsonResponse.put("message", "Database error: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            e.printStackTrace();
            jsonResponse.put("success", false);
            jsonResponse.put("message", "Error retrieving order details: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
        
        try (PrintWriter out = response.getWriter()) {
            out.print(gson.toJson(jsonResponse));
            out.flush();
        }
    }


	private void PlaceOrder(HttpServletRequest request, HttpServletResponse response) throws IOException {
	    response.setContentType("application/json");
	    response.setCharacterEncoding("UTF-8");
	    
	    Gson gson = new Gson();
	    Map<String, Object> jsonResponse = new HashMap<>();
	    
	    try {
	        // Extract and validate parameters
	        String customerIdStr = request.getParameter("customerId");
	        String totalStr = request.getParameter("total");
	        String method = request.getParameter("method");
	        String itemsJson = request.getParameter("items");
	        String invoiceId = request.getParameter("invoiceNumber");
	        
	        // Log parameters for debugging
	        System.out.println("Received parameters: customerId=" + customerIdStr + ", total=" + totalStr + ", method=" + method + ", items=" + itemsJson);
	        
	        // Validate parameters
	        if (invoiceId == null ||customerIdStr == null || customerIdStr.trim().isEmpty() || totalStr == null || totalStr.trim().isEmpty() || method == null || itemsJson == null) {
	            jsonResponse.put("success", false);
	            jsonResponse.put("message", "Missing required parameters");
	            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
	            try (PrintWriter out = response.getWriter()) {
	                out.print(gson.toJson(jsonResponse));
	                out.flush();
	            }
	            return;
	        }
	        
	        // Parse numeric parameters
	        int invoiceNumber;
	        double total;
	        try {
	            invoiceNumber = Integer.parseInt(invoiceId);
	            total = Double.parseDouble(totalStr);
	        } catch (NumberFormatException e) {
	            jsonResponse.put("success", false);
	            jsonResponse.put("message", "Invalid number format in parameters: customerId=" + customerIdStr + ", total=" + totalStr);
	            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
	            try (PrintWriter out = response.getWriter()) {
	                out.print(gson.toJson(jsonResponse));
	                out.flush();
	            }
	            return;
	        }
	        
	        // Validate parsed values
	        if (customerIdStr == null || total < 0) {
	            jsonResponse.put("success", false);
	            jsonResponse.put("message", "Invalid customer ID or total amount");
	            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
	            try (PrintWriter out = response.getWriter()) {
	                out.print(gson.toJson(jsonResponse));
	                out.flush();
	            }
	            return;
	        }
	        
	        // Parse order items
	        @SuppressWarnings("unused")
			List<OrderItem> orderItems = gson.fromJson(itemsJson, new TypeToken<List<OrderItem>>(){}.getType());
	        if (orderItems == null || orderItems.isEmpty()) {
	            jsonResponse.put("success", false);
	            jsonResponse.put("message", "No order items provided");
	            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
	            try (PrintWriter out = response.getWriter()) {
	                out.print(gson.toJson(jsonResponse));
	                out.flush();
	            }
	            return;
	        }
	        
	        // Create Order object
	        Order order = new Order();
	        order.setCustomerId(customerIdStr);
	        order.setOrderId(invoiceNumber);
	        order.setTotalAmount(total);
	        order.setMethod(method);
	        order.setOrderItems(orderItems);
	        
	        // Call OrderDao to place the order
	        OrderDao orderDao = new OrderDao();
	        boolean success = orderDao.placeOrder(order);
	        
	        // Prepare response
	        if (success) {
	            jsonResponse.put("success", true);
	            jsonResponse.put("message", "Order placed successfully");
	            jsonResponse.put("invoiceNumber", orderDao.getInvoice());
	        } else {
	            jsonResponse.put("success", false);
	            jsonResponse.put("message", "Failed to place order");
	            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
	        }
	    } catch (Exception e) {
	        e.printStackTrace();
	        jsonResponse.put("success", false);
	        jsonResponse.put("message", "Error placing order: " + e.getMessage());
	        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
	    }
	    
	    // Write JSON response
	    try (PrintWriter out = response.getWriter()) {
	        out.print(gson.toJson(jsonResponse));
	        out.flush();
	    }
	}

}
