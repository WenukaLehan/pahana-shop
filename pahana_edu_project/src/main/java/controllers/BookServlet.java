package controllers;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Part;
import models.Book;

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.google.gson.Gson;

import daos.BooksDao;

@MultipartConfig(
	    maxFileSize = 5 * 1024 * 1024, // 5MB
	    maxRequestSize = 10 * 1024 * 1024 // 10MB
	)
@WebServlet("/BookServlet")
public class BookServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
   
    public BookServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
	}

	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		String action = request.getParameter("action");
		
		switch (action) {
			case "addBook":
				addBook(request, response);
				break;
			case "updateBook":
				updateBook(request, response);
				break;
			case "deleteBook":
				deleteBook(request, response);
				break;
			case "viewBook":
				try {
					viewBook(request, response);
				} catch (ClassNotFoundException | SQLException | IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				break;
			case "listBooks":
				try {
					listBooks(request, response);
				} catch (ClassNotFoundException | SQLException | IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				break;
			default:
				// Handle unknown action
				response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Unknown action: " + action);
				break;
		}
	}


	private void listBooks(HttpServletRequest request, HttpServletResponse response) throws ClassNotFoundException, SQLException, IOException {
		BooksDao booksDao = new BooksDao();
		try {
			response.setContentType("application/json");
	        response.setCharacterEncoding("UTF-8");
	        
			List<Book> books = booksDao.listBooks();
			
			try (PrintWriter out = response.getWriter()) {
				if (books != null && !books.isEmpty()) {
					
					 Map<String, Object> jsonResponse = new HashMap<>();
					 jsonResponse.put("success", true);
	                 jsonResponse.put("books", books);
	                 
	                 out.print(new Gson().toJson(jsonResponse));
	                 
				} else {
					Map<String, Object> errorResponse = new HashMap<>();
	                errorResponse.put("success", false);
	                errorResponse.put("message", "Books not found or session expired.");

	                out.print(new Gson().toJson(errorResponse));
	                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
				}
				out.flush();
			}
			
		} catch (Exception e) {
			e.printStackTrace();
			response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error retrieving book list");
		}
		
	}


	private void viewBook(HttpServletRequest request, HttpServletResponse response) throws ClassNotFoundException, SQLException, IOException {
		// TODO Auto-generated method stub
		// This method should retrieve a specific book's details based on the book ID
		// and return it in JSON format.
		
		int bookId = Integer.parseInt(request.getParameter("bookId"));
		BooksDao booksDao = new BooksDao();
		
		try {
			Book book = booksDao.getBook(bookId);
			PrintWriter out = response.getWriter();
			if (book != null) {
				response.setContentType("application/json");
				response.setCharacterEncoding("UTF-8");
				
					Map<String, Object> jsonResponse = new HashMap<>();
					jsonResponse.put("success", true);
					jsonResponse.put("data", book);
					
					out.print(new Gson().toJson(jsonResponse));
				
			} else {
				Map<String, Object> errorResponse = new HashMap<>();
				errorResponse.put("success", false);
				errorResponse.put("message", "Book not found");

				out.print(new Gson().toJson(errorResponse));
				response.setStatus(HttpServletResponse.SC_NOT_FOUND);
				response.sendError(HttpServletResponse.SC_NOT_FOUND, "Book not found");
			}
			out.flush();
		} catch (Exception e) {
			e.printStackTrace();
			response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error retrieving book details");
		}
	}


	private void deleteBook(HttpServletRequest request, HttpServletResponse response) throws IOException {
		// TODO Auto-generated method stub
		try {
			response.setContentType("application/json");
	        response.setCharacterEncoding("UTF-8");
	        
	        BooksDao booksDao = new BooksDao();
	        int bookId = Integer.parseInt(request.getParameter("bookId"));
	        
	        boolean isDeleted = booksDao.deleteBook(bookId);
	        
	        try (PrintWriter out = response.getWriter()) {
	        	if (isDeleted) {
	        		Map<String, Object> jsonResponse = new HashMap<>();
	                jsonResponse.put("success", true);
	                jsonResponse.put("message", "Book deleted successfully");
	                
	                out.print(new Gson().toJson(jsonResponse));
	        	} else {
	        		Map<String, Object> errorResponse = new HashMap<>();
	                errorResponse.put("success", false);
	                errorResponse.put("message", "Failed to delete book or book not found");

	                out.print(new Gson().toJson(errorResponse));
	                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
	        	}
	        	out.flush();
	        }
	        
		} catch (Exception e) {
			e.printStackTrace();
			response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error deleting book");
		}
	}


	private void updateBook(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
	    try {
	        response.setContentType("application/json");
	        response.setCharacterEncoding("UTF-8");

	        BooksDao booksDao = new BooksDao();
	        Book book = extractBookFromRequest(request);
	        String idParam = request.getParameter("id");
	        
	        // Validate ID
	        if (idParam == null || idParam.trim().isEmpty()) {
	            Map<String, Object> errorResponse = new HashMap<>();
	            errorResponse.put("success", false);
	            errorResponse.put("message", "Book ID is required for update");
	            try (PrintWriter out = response.getWriter()) {
	                out.print(new Gson().toJson(errorResponse));
	                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
	                out.flush();
	            }
	            return;
	        }

	        try {
	            book.setId(Integer.parseInt(idParam));
	        } catch (NumberFormatException e) {
	            Map<String, Object> errorResponse = new HashMap<>();
	            errorResponse.put("success", false);
	            errorResponse.put("message", "Invalid book ID format");
	            try (PrintWriter out = response.getWriter()) {
	                out.print(new Gson().toJson(errorResponse));
	                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
	                out.flush();
	            }
	            return;
	        }

	        boolean isUpdated = booksDao.updateBook(book);

	        try (PrintWriter out = response.getWriter()) {
	            if (isUpdated) {
	                Map<String, Object> jsonResponse = new HashMap<>();
	                jsonResponse.put("success", true);
	                jsonResponse.put("message", "Book updated successfully");
	                out.print(new Gson().toJson(jsonResponse));
	            } else {
	                Map<String, Object> errorResponse = new HashMap<>();
	                errorResponse.put("success", false);
	                errorResponse.put("message", "Book not found or update failed");
	                out.print(new Gson().toJson(errorResponse));
	                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
	            }
	            out.flush();
	        }
	    } catch (SQLException e) {
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
	        errorResponse.put("message", "Error updating book: " + e.getMessage());
	        try (PrintWriter out = response.getWriter()) {
	            out.print(new Gson().toJson(errorResponse));
	            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
	            out.flush();
	        }
	    }
	}


    private Book extractBookFromRequest(HttpServletRequest request) throws IOException, ServletException {
        Book book = new Book();
        book.setTitle(request.getParameter("title"));
        book.setAuthor(request.getParameter("author"));
        book.setPrice(Double.parseDouble(request.getParameter("price")));
        book.setDescription(request.getParameter("description"));
        book.setStock(Integer.parseInt(request.getParameter("stock")));
        book.setCategoryId(Integer.parseInt(request.getParameter("categoryId")));

        Part filePart = request.getPart("image");
        if (filePart != null && filePart.getSize() > 0) {
            InputStream inputStream = filePart.getInputStream();
            book.setCoverImage(inputStream);
        }

        return book;
    }


	private void addBook(HttpServletRequest request, HttpServletResponse response) {
		
		try {
			response.setContentType("application/json");
	        response.setCharacterEncoding("UTF-8");
	        
	        BooksDao booksDao = new BooksDao();
	        Book book = extractBookFromRequest(request);
	        
	        boolean isAdded = booksDao.addBook(book);
	        
	        try (PrintWriter out = response.getWriter()) {
	        	if (isAdded) {
	        		Map<String, Object> jsonResponse = new HashMap<>();
	                jsonResponse.put("success", true);
	                jsonResponse.put("message", "Book added successfully");
	                
	                out.print(new Gson().toJson(jsonResponse));
	        	} else {
	        		Map<String, Object> errorResponse = new HashMap<>();
	                errorResponse.put("success", false);
	                errorResponse.put("message", "Failed to add book");

	                out.print(new Gson().toJson(errorResponse));
	                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
	        	}
	        	out.flush();
	        }
			
		}catch (Exception e) {
			e.printStackTrace();
			try {
				response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error adding book");
			} catch (IOException ioException) {
				ioException.printStackTrace();
			}
		}
		
	}

}
