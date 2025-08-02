package controllers;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.servlet.http.Part;
import models.User;

import java.io.*;
import java.util.*;

import com.google.gson.Gson;

import daos.SettingDao;

@MultipartConfig(
		fileSizeThreshold = 1024 * 1024, // 1 MB
		maxFileSize = 1024 * 1024 * 10, // 10 MB
		maxRequestSize = 1024 * 1024 * 50 // 50 MB
)
@WebServlet("/SettingServlet")
public class SettingServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    
    public SettingServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		//get setting bool values from session and send it to front end
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		
		HttpSession session = request.getSession();
		
		Map<String, Boolean> settings = new HashMap<>();
		settings.put("LowStock", (Boolean) session.getAttribute("stockAlerts"));
		settings.put("EmailNot", (Boolean) session.getAttribute("email"));
		settings.put("AtuBackup", (Boolean) session.getAttribute("backup"));
		
		try (PrintWriter out = response.getWriter()) {
			out.print(new Gson().toJson(settings));
			out.flush();
		} catch (Exception e) {
			e.printStackTrace();
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
		}
	}

	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		String action = request.getParameter("action");
		
		switch (action) {
			case "getAllUsers":
				getAllUsers(request, response);
				break;
			case "updateUserStatus":
				updateUserStatus(request, response);
				break;
			case "updateUser":
				updateUser(request, response);
				break;
			case "addUser":
				addUser(request, response);
				break;
			case "updateSettings":
				updateSettings(request, response);
				break;
			default:
				response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid action");
				break;
		}
	}


	private void updateSettings(HttpServletRequest request, HttpServletResponse response) {
		
		String name = request.getParameter("name");
		boolean value = Boolean.parseBoolean(request.getParameter("value"));
		
		SettingDao settingDao = new SettingDao();
		
		try (PrintWriter out = response.getWriter()) {
			boolean isUpdated = settingDao.updateSetting(name, value);
			if (isUpdated) {
				response.setContentType("application/json");
				response.setCharacterEncoding("UTF-8");
				Map<String, Object> jsonResponse = new HashMap<>();
				jsonResponse.put("success", true);
				out.print(new Gson().toJson(jsonResponse));
			} else {
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				Map<String, Object> errorResponse = new HashMap<>();
				errorResponse.put("success", false);
				errorResponse.put("message", "Failed to update settings.");
				out.print(new Gson().toJson(errorResponse));
			}
			out.flush();
		} catch (Exception e) {
			e.printStackTrace();
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
		}
		
	}


	private void addUser(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
		String username = request.getParameter("username");
		String email = request.getParameter("email");
		String name = request.getParameter("name");
		int role = Integer.parseInt(request.getParameter("role"));
		String phone = request.getParameter("phone");
		InputStream image = null;
		Part filePart = request.getPart("image");
		if (filePart != null && filePart.getSize() > 0) {
			try {
				image = filePart.getInputStream();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		
		SettingDao settingDao = new SettingDao();
		User user = new User();
		user.setUsername(username);
		user.setEmail(email);
		user.setRole(role);
		user.setName(name);
		user.setPhone(phone);
		user.setImage(image);
		
		try (PrintWriter out = response.getWriter()) {
			boolean isAdded = settingDao.addUser(user, request);
			if (isAdded) {
				response.setContentType("application/json");
				response.setCharacterEncoding("UTF-8");
				Map<String, Object> jsonResponse = new HashMap<>();
				jsonResponse.put("success", true);
				out.print(new Gson().toJson(jsonResponse));
			} else {
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				Map<String, Object> errorResponse = new HashMap<>();
				errorResponse.put("success", false);
				errorResponse.put("message", "Failed to add user.");
				out.print(new Gson().toJson(errorResponse));
			}
			out.flush();
		} catch (Exception e) {
			e.printStackTrace();
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
		}
		
	}


	private void updateUser(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
		
		String userId = request.getParameter("userId");
		String username = request.getParameter("username");
		String email = request.getParameter("email");
		String name = request.getParameter("name");
		String phone = request.getParameter("phone");
		InputStream image = null;
		Part filePart = request.getPart("image");
		if (filePart != null && filePart.getSize() > 0) {
			try {
				image = filePart.getInputStream();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		
		SettingDao settingDao = new SettingDao();
		User user = new User();
		user.setId(userId);
		user.setUsername(username);
		user.setEmail(email);
		user.setName(name);
		user.setPhone(phone);
		user.setImage(image);
		
		
		try (PrintWriter out = response.getWriter()) {
			boolean isUpdated = settingDao.updateUser(user);
			if (isUpdated) {
				response.setContentType("application/json");
				response.setCharacterEncoding("UTF-8");
				Map<String, Object> jsonResponse = new HashMap<>();
				jsonResponse.put("success", true);
				out.print(new Gson().toJson(jsonResponse));
			} else {
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				Map<String, Object> errorResponse = new HashMap<>();
				errorResponse.put("success", false);
				errorResponse.put("message", "Failed to update user.");
				out.print(new Gson().toJson(errorResponse));
			}
			out.flush();
		} catch (Exception e) {
			e.printStackTrace();
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
		}
		
	}


	private void updateUserStatus(HttpServletRequest request, HttpServletResponse response) {
		
		String userId = request.getParameter("userId");
		String status = request.getParameter("status");
		
		SettingDao settingDao = new SettingDao();
		
		try (PrintWriter out = response.getWriter()) {
			boolean isUpdated = settingDao.updateUserStatus(userId, status);
			if (isUpdated) {
				response.setContentType("application/json");
				response.setCharacterEncoding("UTF-8");
				Map<String, Object> jsonResponse = new HashMap<>();
				jsonResponse.put("success", true);
				out.print(new Gson().toJson(jsonResponse));
			} else {
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				Map<String, Object> errorResponse = new HashMap<>();
				errorResponse.put("success", false);
				errorResponse.put("message", "Failed to update user status.");
				out.print(new Gson().toJson(errorResponse));
			}
			out.flush();
		} catch (Exception e) {
			e.printStackTrace();
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
		}
		
	}


	private void getAllUsers(HttpServletRequest request, HttpServletResponse response) {
		response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        SettingDao settingDao = new SettingDao();
        
        try(PrintWriter out = response.getWriter()) {
			List<User> users = settingDao.getAllUsers();
			if (users != null) {
				Map<String, Object> jsonResponse = new HashMap<>();
				jsonResponse.put("success", true);
				jsonResponse.put("data", users);
				out.print(new Gson().toJson(users));
			} else {
				Map<String, Object> errorResponse = new HashMap<>();
				errorResponse.put("success", false);
				errorResponse.put("message", "No users found.");
				response.setStatus(HttpServletResponse.SC_NOT_FOUND);
				out.print(new Gson().toJson(errorResponse));
				return;
			}
			out.flush();
		} catch (Exception e) {
			e.printStackTrace();
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
		}
		
	}

}
