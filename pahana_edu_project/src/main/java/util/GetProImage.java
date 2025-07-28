package util;

import jakarta.servlet.ServletException;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import daos.BooksDao;
import daos.CustomerDao;
import daos.UserDao;

import java.io.IOException;
import java.io.InputStream;

@WebServlet("/GetProImage")
public class GetProImage extends HttpServlet {
    private static final long serialVersionUID = 1L;

    public GetProImage() {
        super();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        String userId = request.getParameter("id");
        String action = request.getParameter("action");
        if(action == null) {
	        if (userId == null || userId.trim().isEmpty()) {
	            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid customer ID");
	            return;
	        }
	
	        try {
	            CustomerDao customerDao = new CustomerDao();
	
	            // Fetch image stream from database
	            InputStream imageStream = customerDao.getCustomerImage(userId);
	
	            if (imageStream != null) {
	                response.setContentType("image/png"); // or image/jpeg, depending on your stored type
	
	                try (ServletOutputStream out = response.getOutputStream()) {
	                    byte[] buffer = new byte[4096];
	                    int bytesRead;
	                    while ((bytesRead = imageStream.read(buffer)) != -1) {
	                        out.write(buffer, 0, bytesRead);
	                    }
	                    out.flush();
	                }
	
	                imageStream.close();
	            } else {
	                response.sendError(HttpServletResponse.SC_NOT_FOUND, "Image not found for ID: " + userId);
	            }
	
	        } catch (Exception e) {
	            e.printStackTrace();
	            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error retrieving image");
	        }
        }else if (action.equals("user")) {
			if (userId == null || userId.trim().isEmpty()) {
	            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid customer ID");
	            return;
	        }
	
	        try {
	            UserDao userDao = new UserDao();
	            // Fetch image stream from database
	            InputStream imageStream = userDao.getUserImage(userId);
	            if (imageStream != null) {
	                response.setContentType("image/png"); // or image/jpeg, depending on your stored type
	
	                try (ServletOutputStream out = response.getOutputStream()) {
	                    byte[] buffer = new byte[4096];
	                    int bytesRead;
	                    while ((bytesRead = imageStream.read(buffer)) != -1) {
	                        out.write(buffer, 0, bytesRead);
	                    }
	                    out.flush();
	                }
	
	                imageStream.close();
	            } else {
	                response.sendError(HttpServletResponse.SC_NOT_FOUND, "Image not found for ID: " + userId);
	            }
	
	           
	
	        } catch (Exception e) {
	            e.printStackTrace();
	            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error deleting image");
	        }
		}
        else if (action.equals("book")) {
			String bookId = request.getParameter("bookId");
			if (bookId == null || bookId.trim().isEmpty()) {
				response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid book ID");
				return;
			}

			try {
				BooksDao booksDao = new BooksDao();
				InputStream imageStream = booksDao.getBookCoverImage(Integer.parseInt(bookId));

				if (imageStream != null) {
					response.setContentType("image/png"); // or image/jpeg, depending on your stored type

					try (ServletOutputStream out = response.getOutputStream()) {
						byte[] buffer = new byte[4096];
						int bytesRead;
						while ((bytesRead = imageStream.read(buffer)) != -1) {
							out.write(buffer, 0, bytesRead);
						}
						out.flush();
					}

					imageStream.close();
				} else {
					response.sendError(HttpServletResponse.SC_NOT_FOUND, "Image not found for book ID: " + bookId);
				}

			} catch (Exception e) {
				e.printStackTrace();
				response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error retrieving book cover image");
			}
        	
        }
    }
}
