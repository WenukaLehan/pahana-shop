package com.example.tests;

import com.google.gson.Gson; // Import Gson for JSON parsing if you modify the servlet to return the code
import com.meterware.httpunit.*;
import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.*;

import java.util.Map; // Required for Gson parsing

public class UserServletTest {
    private WebConversation wc;
    // !! IMPORTANT: Replace 'http://localhost:8080/pahana_edu_project/user' with your actual servlet URL !!
    private String baseUrl = "http://localhost:8080/pahana_edu_project/user";

    // --- TEST DATA CONSTANTS ---
    // !! IMPORTANT: These values MUST EXIST in your database for successful tests,
    // !! and NON_EXISTENT_EMAIL MUST NOT exist for the failure test.
    // !! Adjust these values to match your specific test environment setup.
    private static final String VALID_LOGIN_USERNAME = "admin";
    private static final String VALID_LOGIN_PASSWORD = "123"; // Ensure this is the *plaintext* password used for login

    private static final String INVALID_LOGIN_USERNAME = "nonexistent_user";
    private static final String INVALID_LOGIN_PASSWORD = "wrong_password";

    private static final String VALID_RESET_EMAIL = "imashaananda020@gmail.com"; // Email that exists in your DB for password reset
    private static final String NON_EXISTENT_EMAIL = "nonexistent@example.com"; // Email that DOES NOT exist in your DB

    // !! IMPORTANT: This test is inherently flaky if your server-side
    // !! sendResetCode method generates a *random* code and doesn't return
    // !! it in the JSON response. For reliable testing of forgot_password,
    // !! you should modify your UserServlet to return the generated reset code
    // !! in the JSON response of the "send_code" action.
    // !! If your server generates random codes, the value below will likely
    // !! NOT match, causing testForgotPasswordSuccess to fail.
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

    /**
     * Test successful user login.
     * Expects a 302 redirect to a_dashboard.jsp and user/role cookies to be set.
     */
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

        assertEquals("Expected 302 Found for successful login redirect", 302, response.getResponseCode());
        assertTrue("Expected redirect to a_dashboard.jsp", response.getHeaderField("Location").contains("a_dashboard.jsp"));
        assertNotNull("Expected 'user' cookie to be set", wc.getCookieValue("user"));
        assertNotNull("Expected 'role' cookie to be set", wc.getCookieValue("role"));
    }

    /**
     * Test failed user login with invalid credentials.
     * Expects a 200 OK and the login error message in the response body.
     */
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

    /**
     * Test successful sending of a reset code to a valid email.
     * Expects a 200 OK and a JSON response indicating success.
     */
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

    /**
     * Test failed sending of a reset code to a non-existent email.
     * Expects a 200 OK and a JSON response indicating an error and "Email not found".
     *
     * !! IMPORTANT: This test requires your UserDao.sendResetCode to return `false`
     * !! when the email does not exist in the database, leading to the "Email not found" message.
     */
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

    /**
     * Test retrieving user information with a valid active session.
     * First logs in, then requests user info.
     * Expects a 200 OK and a JSON response with user data.
     */
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

    /**
     * Test retrieving user information without an active session.
     * Expects a 401 Unauthorized status and a JSON response indicating failure.
     */
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

    /**
     * Test user logout functionality.
     * Expects a 200 OK, JSON success status, and 'user' cookie to be nullified.
     */
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
        assertTrue("Expected JSON success status 'true'", response.getText().contains("\"success\":true"));
        // After session invalidation, the cookie value for 'user' should be effectively gone or invalid
        // HttpUnit's getCookieValue might still return something if the cookie path/domain doesn't exactly match
        // or if it's set with a maxAge=0, but session.invalidate() is the server-side action.
        // A more robust check here would be to try to access a session-dependent resource and expect failure.
        // For simplicity, asserting null, though it might depend on browser/cookie behavior nuances not fully replicated by HttpUnit.
        // If this fails consistently, remove this line and rely on a post-logout session check test.
        assertNull("Expected 'user' cookie to be null after logout", wc.getCookieValue("user"));
    }

    /**
     * Test successful password change after receiving a valid reset code.
     * Requires the 'send_code' action to correctly populate session attributes for 'forgot_password'.
     *
     * !! IMPORTANT: This test is highly dependent on how your server-side `sendResetCode`
     * !! method interacts with the session and how the reset code is generated/validated.
     * !! It will likely fail if the HARDCODED_TEST_RESET_CODE does not match the
     * !! server-generated code in the session.
     */
    @Test
    public void testForgotPasswordSuccess() throws Exception {
        // Step 1: Request a reset code (this should set the code in the session on the server)
        WebRequest resetRequest = new PostMethodWebRequest(baseUrl);
        resetRequest.setParameter("action", "send_code");
        resetRequest.setParameter("email", VALID_RESET_EMAIL);
        WebResponse resetResponse = wc.getResponse(resetRequest);
        System.out.println("testForgotPasswordSuccess - Reset Code Request Response Text: " + resetResponse.getText());

        // If your servlet returns the code in the JSON, you'd parse it here:
        // Gson gson = new Gson();
        // Map<String, String> responseMap = gson.fromJson(resetResponse.getText(), Map.class);
        // String actualResetCode = responseMap.get("code");
        // if (actualResetCode == null) throw new RuntimeException("Server did not return reset code!");

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
        assertTrue("Expected success message 'Password changed successfully'", response.getText().contains("Password changed successfully"));
    }

    /**
     * Test failed password change due to an invalid verification code.
     * Requires the 'send_code' action to correctly populate session attributes.
     *
     * !! IMPORTANT: Same dependency as testForgotPasswordSuccess regarding the reset code.
     */
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

    /**
     * Test an unrecognized action.
     * Expects a 302 redirect to Login.jsp as per servlet's default case.
     */
    @Test
    public void testInvalidAction() throws Exception {
        WebRequest request = new PostMethodWebRequest(baseUrl);
        request.setParameter("action", "some_non_existent_action");

        WebResponse response = wc.getResponse(request);
        System.out.println("testInvalidAction Response Code: " + response.getResponseCode());
        System.out.println("testInvalidAction Response Location: " + response.getHeaderField("Location"));
        System.out.println("testInvalidAction Response Text: " + response.getText()); // Debug output

        assertEquals("Expected 302 Found for invalid action redirect", 302, response.getResponseCode());
        assertTrue("Expected redirect to Login.jsp", response.getHeaderField("Location").contains("Login.jsp"));
    }
}
