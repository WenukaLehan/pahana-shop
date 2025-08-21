package com.example.tests;

import com.google.gson.Gson; // Import Gson for JSON parsing if you modify the servlet to return the code
import com.meterware.httpunit.*;
import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.*;

import java.util.Map; // Required for Gson parsing

public class UserServletTest {
	
    private WebConversation wc;
    private String baseUrl = "http://localhost:8080/pahana_edu_project/user";

    private static final String VALID_LOGIN_USERNAME = "admin";
    private static final String VALID_LOGIN_PASSWORD = "123"; // Ensure this is the *plaintext* password used for login

    private static final String INVALID_LOGIN_USERNAME = "nonexistent_user";
    private static final String INVALID_LOGIN_PASSWORD = "wrong_password";

    private static final String VALID_RESET_EMAIL = "imashaananda020@gmail.com"; // Email that exists in your DB for password reset
    private static final String NON_EXISTENT_EMAIL = "nonexistent@example.com"; // Email that DOES NOT exist in your DB

    private static final String HARDCODED_TEST_RESET_CODE = "123456"; // Use if your server *can* be configured to issue this code for testing, or if you modify the servlet to return the actual code.

    @Before
    public void setUp() throws Exception {
        try {
            // Disable JavaScript to avoid issues with HttpUnit's Rhino engine (if not needed for your tests)
            HttpUnitOptions.setScriptingEnabled(false);
            wc = new WebConversation();
            // Allow HttpUnit to handle non-200 responses gracefully for assertions
            wc.setExceptionsThrownOnErrorStatus(false);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to initialize WebConversation", e);
        }
    }

    
    @Test
    public void testLoginSuccess() throws Exception {
        WebRequest request = new PostMethodWebRequest(baseUrl);
        request.setParameter("action", "login");
        request.setParameter("username", VALID_LOGIN_USERNAME);
        request.setParameter("password", VALID_LOGIN_PASSWORD);

        WebResponse response = wc.getResponse(request);
        System.out.println("testLoginSuccess Response Code: " + response.getResponseCode());
        System.out.println("testLoginSuccess Response Location: " + response.getHeaderField("Location"));
        System.out.println("testLoginSuccess Response Text: " + response.getText()); // Debug output

        assertEquals("Expected 200 Found for successful login redirect", 200, response.getResponseCode());
    }

    
    @Test
    public void testLoginFailure() throws Exception {
        WebRequest request = new PostMethodWebRequest(baseUrl);
        request.setParameter("action", "login");
        request.setParameter("username", INVALID_LOGIN_USERNAME);
        request.setParameter("password", INVALID_LOGIN_PASSWORD);

        WebResponse response = wc.getResponse(request);
        System.out.println("testLoginFailure Response Code: " + response.getResponseCode());
        System.out.println("testLoginFailure Response Text: " + response.getText()); // Debug output

        assertEquals("Expected 200 OK for login failure (forward to JSP)", 200, response.getResponseCode());
        assertTrue("Expected error message 'Invalid username or password' in response", response.getText().contains("Invalid username or password"));
    }

   
    @Test
    public void testSendResetCodeSuccess() throws Exception {
        WebRequest request = new PostMethodWebRequest(baseUrl);
        request.setParameter("action", "send_code");
        request.setParameter("email", VALID_RESET_EMAIL);

        WebResponse response = wc.getResponse(request);
        System.out.println("testSendResetCodeSuccess Response Code: " + response.getResponseCode());
        System.out.println("testSendResetCodeSuccess Response Text: " + response.getText()); // Debug output

        assertEquals("Expected 200 OK for successful code send", 200, response.getResponseCode());
        assertTrue("Expected JSON status 'success'", response.getText().contains("\"status\":\"success\""));
        assertTrue("Expected success message about code being sent", response.getText().contains("A reset code has been sent"));
    }

    
    @Test
    public void testSendResetCodeFailure() throws Exception {
        WebRequest request = new PostMethodWebRequest(baseUrl);
        request.setParameter("action", "send_code");
        request.setParameter("email", NON_EXISTENT_EMAIL); // This email MUST NOT exist in your database

        WebResponse response = wc.getResponse(request);
        System.out.println("testSendResetCodeFailure Response Code: " + response.getResponseCode());
        System.out.println("testSendResetCodeFailure Response Text: " + response.getText()); // Debug output

        assertEquals("Expected 200 OK for failed code send (email not found)", 200, response.getResponseCode());
        assertTrue("Expected JSON status 'error'", response.getText().contains("\"status\":\"error\""));
        assertTrue("Expected error message 'Email not found'", response.getText().contains("Email not found"));
    }

    
    @Test
    public void testGetUserInfoWithValidSession() throws Exception {
        // First, log in to establish a session
        WebRequest loginRequest = new PostMethodWebRequest(baseUrl);
        loginRequest.setParameter("action", "login");
        loginRequest.setParameter("username", VALID_LOGIN_USERNAME); // Use valid user for session
        loginRequest.setParameter("password", VALID_LOGIN_PASSWORD);
        wc.getResponse(loginRequest); // Execute login, session and cookies are maintained by wc

        // Then, request user info
        WebRequest request = new PostMethodWebRequest(baseUrl);
        request.setParameter("action", "getUserInfo");

        WebResponse response = wc.getResponse(request);
        System.out.println("testGetUserInfoWithValidSession Response Code: " + response.getResponseCode());
        System.out.println("testGetUserInfoWithValidSession Response Text: " + response.getText()); // Debug output

        assertEquals("Expected 200 OK for successful user info retrieval", 200, response.getResponseCode());
        assertTrue("Expected JSON success status", response.getText().contains("\"success\":true"));
        assertTrue("Expected 'data' field in JSON response", response.getText().contains("data"));
        // Further assertions could be added to check specific user data within the 'data' field
    }

    
    @Test
    public void testGetUserInfoWithoutSession() throws Exception {
        // Ensure no active session from previous tests
        wc = new WebConversation(); // Reset WebConversation to clear any existing session cookies

        WebRequest request = new PostMethodWebRequest(baseUrl);
        request.setParameter("action", "getUserInfo");

        WebResponse response = wc.getResponse(request);
        System.out.println("testGetUserInfoWithoutSession Response Code: " + response.getResponseCode());
        System.out.println("testGetUserInfoWithoutSession Response Text: " + response.getText()); // Debug output

        assertEquals("Expected 401 Unauthorized when no session", 401, response.getResponseCode());
        assertTrue("Expected JSON success status 'false'", response.getText().contains("\"success\":false"));
        assertTrue("Expected message 'User not found or session expired'", response.getText().contains("User not found or session expired"));
    }

   
    @Test
    public void testLogout() throws Exception {
        // First, log in to establish a session to be logged out from
        WebRequest loginRequest = new PostMethodWebRequest(baseUrl);
        loginRequest.setParameter("action", "login");
        loginRequest.setParameter("username", VALID_LOGIN_USERNAME);
        loginRequest.setParameter("password", VALID_LOGIN_PASSWORD);
        wc.getResponse(loginRequest); // Establish session

        // Then, send logout request
        WebRequest request = new PostMethodWebRequest(baseUrl);
        request.setParameter("action", "logout");

        WebResponse response = wc.getResponse(request);
        System.out.println("testLogout Response Code: " + response.getResponseCode());
        System.out.println("testLogout Response Text: " + response.getText()); // Debug output

        assertEquals("Expected 200 OK for logout", 200, response.getResponseCode());
    }

    
    @Test
    public void testForgotPasswordSuccess() throws Exception {
        // Step 1: Request a reset code (this should set the code in the session on the server)
        WebRequest resetRequest = new PostMethodWebRequest(baseUrl);
        resetRequest.setParameter("action", "send_code");
        resetRequest.setParameter("email", VALID_RESET_EMAIL);
        WebResponse resetResponse = wc.getResponse(resetRequest);
        System.out.println("testForgotPasswordSuccess - Reset Code Request Response Text: " + resetResponse.getText());

        
        // Step 2: Attempt to change password using the code
        WebRequest request = new PostMethodWebRequest(baseUrl);
        request.setParameter("action", "forgot_password");
        // Use the hardcoded code for testing. If server generates random, this will fail.
        request.setParameter("code", HARDCODED_TEST_RESET_CODE); // Or actualResetCode if parsed
        request.setParameter("newPassword", "newStrongPass123");

        WebResponse response = wc.getResponse(request);
        System.out.println("testForgotPasswordSuccess - Change Password Response Code: " + response.getResponseCode());
        System.out.println("testForgotPasswordSuccess - Change Password Response Text: " + response.getText());

        assertEquals("Expected 200 OK for successful password change (forward to JSP)", 200, response.getResponseCode());
    }

    
    @Test
    public void testForgotPasswordInvalidCode() throws Exception {
        // Step 1: Request a reset code (to ensure a code exists in session, even if we use a wrong one)
        WebRequest resetRequest = new PostMethodWebRequest(baseUrl);
        resetRequest.setParameter("action", "send_code");
        resetRequest.setParameter("email", VALID_RESET_EMAIL);
        WebResponse resetResponse = wc.getResponse(resetRequest);
        System.out.println("testForgotPasswordInvalidCode - Reset Code Request Response Text: " + resetResponse.getText());

        // Step 2: Attempt to change password with a wrong code
        WebRequest request = new PostMethodWebRequest(baseUrl);
        request.setParameter("action", "forgot_password");
        request.setParameter("code", "WRONGCODE123"); // Intentionally incorrect code
        request.setParameter("newPassword", "anotherNewPass");

        WebResponse response = wc.getResponse(request);
        System.out.println("testForgotPasswordInvalidCode - Change Password Response Code: " + response.getResponseCode());
        System.out.println("testForgotPasswordInvalidCode - Change Password Response Text: " + response.getText());

        assertEquals("Expected 200 OK for failed password change (forward to JSP)", 200, response.getResponseCode());
        assertTrue("Expected error message 'Invalid verification code'", response.getText().contains("Invalid verification code"));
    }

    
    @Test
    public void testInvalidAction() throws Exception {
        WebRequest request = new PostMethodWebRequest(baseUrl);
        request.setParameter("action", "some_non_existent_action");

        WebResponse response = wc.getResponse(request);
        System.out.println("testInvalidAction Response Code: " + response.getResponseCode());
        System.out.println("testInvalidAction Response Location: " + response.getHeaderField("Location"));
        System.out.println("testInvalidAction Response Text: " + response.getText()); // Debug output

        assertEquals("Expected 200 Found for invalid action redirect", 200, response.getResponseCode());
    }
}
