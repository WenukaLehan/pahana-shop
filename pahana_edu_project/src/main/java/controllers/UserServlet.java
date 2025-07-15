package controllers;

import com.google.gson.Gson;

import daos.UserDao;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import models.User;

import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;



//import org.mindrot.jbcrypt.BCrypt;

@WebServlet("/user")
public class UserServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private UserDao userModel = new UserDao();
    
 

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String action = request.getParameter("action");

        try {
            switch (action) {
                case "login":
                    loginUser(request, response);
                    break;
                case "send_code":
                    sendResetCode(request, response);
                    break;
                case "forgot_password":
                    changePassword(request, response);
                    break;
                default:
                    response.sendRedirect("Login.jsp");
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new ServletException("Error handling action: " + action, e);
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String action = request.getParameter("action");
        if ("logout".equals(action)) {
            HttpSession session = request.getSession(false);
            if (session != null) {
                session.invalidate();
            }
            response.sendRedirect("Login.jsp");
        }
    }
    


    private void loginUser(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String username = request.getParameter("username");
        String password = request.getParameter("password");

        try {
            User user = userModel.loginUser(username, password);
            if (user != null) {
                HttpSession session = request.getSession();
                session.setAttribute("auth", user.getId());
                response.sendRedirect("./admin/a_dashboard.jsp");
            } else {
                request.setAttribute("loginError", "Invalid username or password.");
                request.getRequestDispatcher("Login.jsp").forward(request, response);
            }
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            throw new ServletException("Database error during login", e);
        }
    }

    private void sendResetCode(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String email = request.getParameter("email");
        Map<String, String> jsonResponse = new HashMap<>();
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            if (userModel.sendResetCode(email, request)) {
            	//send();
                jsonResponse.put("status", "success");
                jsonResponse.put("message", "A reset code has been sent. (Check Email).");
            } else {
                jsonResponse.put("status", "error");
                jsonResponse.put("message", "Email not found.");
            }
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            jsonResponse.put("status", "error");
            jsonResponse.put("message", "A database error occurred.");
        }

        response.getWriter().write(new Gson().toJson(jsonResponse));
    }

    private void changePassword(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String code = request.getParameter("code");
        String newPassword = request.getParameter("newPassword");

        HttpSession session = request.getSession();
        String sessionCode = (String) session.getAttribute("resetCode");
        String email = (String) session.getAttribute("resetEmail");

        try {
            if (code != null && sessionCode != null && code.equals(sessionCode)) {
                if (userModel.changePassword(email, newPassword)) {
                    session.removeAttribute("resetCode");
                    session.removeAttribute("resetEmail");
                    request.setAttribute("passwordSuccess", "Password changed successfully. Please log in.");
                } else {
                    request.setAttribute("loginError", "Password change failed. Try again.");
                }
            } else {
                request.setAttribute("loginError", "Invalid verification code.");
            }
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            request.setAttribute("loginError", "A database error occurred during password update.");
        }

        request.getRequestDispatcher("Login.jsp").forward(request, response);
    }
}