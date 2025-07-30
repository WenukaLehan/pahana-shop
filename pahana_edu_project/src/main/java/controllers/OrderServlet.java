package controllers;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

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
			default:
				response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid action");
				return;
		}
		
	}


	private void GetAllOrders(HttpServletRequest request, HttpServletResponse response) {
		// TODO Auto-generated method stub
		
	}


	private void GetInvoice(HttpServletRequest request, HttpServletResponse response) throws IOException {
		try {
			response.setContentType("application/json");
	        response.setCharacterEncoding("UTF-8");
	        
			int invoiceNumber = 0; // Default value if no orders exist
			OrderDao orderDao = new OrderDao();
			invoiceNumber = orderDao.getInvoice();
			
			try (PrintWriter out = response.getWriter()) {
				if (invoiceNumber > 0) {
					
					 Map<String, Object> jsonResponse = new HashMap<>();
	                 jsonResponse.put("success", true);
	                 jsonResponse.put("invoiceNumber", invoiceNumber);
	                 out.print(jsonResponse);
					
				} else {
					Map<String, Object> jsonResponse = new HashMap<>();
					jsonResponse.put("success", false);
					jsonResponse.put("message", "No orders found");
					out.print(jsonResponse);
				}
				out.flush();
			}
			
		}
		catch (Exception e) {
			e.printStackTrace();
			response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error retrieving invoice");
			return;
		}
	}


	private void GetOrderDetails(HttpServletRequest request, HttpServletResponse response) {
		// TODO Auto-generated method stub
		
	}


	private void PlaceOrder(HttpServletRequest request, HttpServletResponse response) {
		// TODO Auto-generated method stub
		
	}

}
