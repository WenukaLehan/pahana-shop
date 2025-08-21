package com.example.tests;

import com.meterware.httpunit.*;
import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.*;
import com.google.gson.Gson;
import java.util.Map;

public class BookServletTest {

    private WebConversation wc;
    private String baseUrl = "http://localhost:8080/pahana_edu_project/BookServlet";

    private static final String VALID_BOOK_TITLE = "Test Book";
    private static final String VALID_BOOK_AUTHOR = "Test Author";
    private static final double VALID_BOOK_PRICE = 29.99;
    private static final String VALID_BOOK_DESCRIPTION = "A test book description";
    private static final int VALID_BOOK_STOCK = 10;
    private static final int VALID_BOOK_CATEGORY_ID = 1;
    private static final int VALID_BOOK_ID = 9; // Assume this book ID exists in the database

    private static final int NON_EXISTENT_BOOK_ID = 9999; // Assume this book ID does not exist

    @Before
    public void setUp() throws Exception {
        try {
            HttpUnitOptions.setScriptingEnabled(false);
            wc = new WebConversation();
            wc.setExceptionsThrownOnErrorStatus(false);
            // Simulate a session with stockAlerts enabled
            wc.getClientProperties().setAutoRedirect(false);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to initialize WebConversation", e);
        }
    }

    @Test
    public void testListBooksSuccess() throws Exception {
        WebRequest request = new PostMethodWebRequest(baseUrl);
        request.setParameter("action", "listBooks");

        WebResponse response = wc.getResponse(request);
        System.out.println("testListBooksSuccess Response Code: " + response.getResponseCode());
        System.out.println("testListBooksSuccess Response Text: " + response.getText());

        assertEquals("Expected 200 OK for successful book list retrieval", 200, response.getResponseCode());
        assertTrue("Expected JSON success status", response.getText().contains("\"success\":true"));
        assertTrue("Expected 'books' field in JSON response", response.getText().contains("books"));
    }

   

    @Test
    public void testViewBookSuccess() throws Exception {
        WebRequest request = new PostMethodWebRequest(baseUrl);
        request.setParameter("action", "viewBook");
        request.setParameter("bookId", String.valueOf(VALID_BOOK_ID));

        WebResponse response = wc.getResponse(request);
        System.out.println("testViewBookSuccess Response Code: " + response.getResponseCode());
        System.out.println("testViewBookSuccess Response Text: " + response.getText());

        assertEquals("Expected 200 OK for successful book retrieval", 200, response.getResponseCode());
        assertTrue("Expected JSON success status", response.getText().contains("\"success\":true"));
        assertTrue("Expected 'data' field in JSON response", response.getText().contains("data"));
    }

    @Test
    public void testViewBookNotFound() throws Exception {
        WebRequest request = new PostMethodWebRequest(baseUrl);
        request.setParameter("action", "viewBook");
        request.setParameter("bookId", String.valueOf(NON_EXISTENT_BOOK_ID));

        WebResponse response = wc.getResponse(request);
        System.out.println("testViewBookNotFound Response Code: " + response.getResponseCode());
        System.out.println("testViewBookNotFound Response Text: " + response.getText());

        assertEquals("Expected 404 Not Found for non-existent book", 404, response.getResponseCode());
    }

    

    @Test
    public void testAddBookFailure() throws Exception {
        // Missing required parameters to simulate failure
        WebRequest request = new PostMethodWebRequest(baseUrl);
        request.setParameter("action", "addBook");
        // Intentionally omit required fields like title, author, etc.

        WebResponse response = wc.getResponse(request);
        System.out.println("testAddBookFailure Response Code: " + response.getResponseCode());
        System.out.println("testAddBookFailure Response Text: " + response.getText());

        assertEquals("Expected 500 Bad Request for invalid book data", 500, response.getResponseCode());
    }

    

    @Test
    public void testUpdateBookInvalidId() throws Exception {
        WebRequest request = new PostMethodWebRequest(baseUrl);
        request.setParameter("action", "updateBook");
        request.setParameter("id", String.valueOf(NON_EXISTENT_BOOK_ID));
        request.setParameter("title", VALID_BOOK_TITLE);
        request.setParameter("author", VALID_BOOK_AUTHOR);
        request.setParameter("price", String.valueOf(VALID_BOOK_PRICE));
        request.setParameter("description", VALID_BOOK_DESCRIPTION);
        request.setParameter("stock", String.valueOf(VALID_BOOK_STOCK));
        request.setParameter("categoryId", String.valueOf(VALID_BOOK_CATEGORY_ID));

        WebResponse response = wc.getResponse(request);
        System.out.println("testUpdateBookInvalidId Response Code: " + response.getResponseCode());
        System.out.println("testUpdateBookInvalidId Response Text: " + response.getText());

        assertEquals("Expected 500 Not Found for non-existent book", 500, response.getResponseCode());
        assertTrue("Expected JSON success status 'false'", response.getText().contains("\"success\":false"));
    }

    @Test
    public void testDeleteBookSuccess() throws Exception {
        WebRequest request = new PostMethodWebRequest(baseUrl);
        request.setParameter("action", "deleteBook");
        request.setParameter("bookId", String.valueOf(VALID_BOOK_ID));

        WebResponse response = wc.getResponse(request);
        System.out.println("testDeleteBookSuccess Response Code: " + response.getResponseCode());
        System.out.println("testDeleteBookSuccess Response Text: " + response.getText());

        assertEquals("Expected 200 OK for successful book deletion", 200, response.getResponseCode());
        assertTrue("Expected JSON success status", response.getText().contains("\"success\":true"));
        assertTrue("Expected message 'Book deleted successfully'", response.getText().contains("Book deleted successfully"));
    }

    @Test
    public void testDeleteBookNotFound() throws Exception {
        WebRequest request = new PostMethodWebRequest(baseUrl);
        request.setParameter("action", "deleteBook");
        request.setParameter("bookId", String.valueOf(NON_EXISTENT_BOOK_ID));

        WebResponse response = wc.getResponse(request);
        System.out.println("testDeleteBookNotFound Response Code: " + response.getResponseCode());
        System.out.println("testDeleteBookNotFound Response Text: " + response.getText());

        assertEquals("Expected 404 Not Found for non-existent book", 404, response.getResponseCode());
        assertTrue("Expected JSON success status 'false'", response.getText().contains("\"success\":false"));
        assertTrue("Expected message 'Failed to delete book or book not found'", response.getText().contains("Failed to delete book or book not found"));
    }

    @Test
    public void testGetLowStockAlertsWithSession() throws Exception {
        // Simulate a session with stockAlerts enabled
        wc.getResponse(new GetMethodWebRequest("http://localhost:8080/pahana_edu_project/setStockAlerts")); // Assume an endpoint sets stockAlerts to true
        WebRequest request = new GetMethodWebRequest(baseUrl);

        WebResponse response = wc.getResponse(request);
        System.out.println("testGetLowStockAlertsWithSession Response Code: " + response.getResponseCode());
        System.out.println("testGetLowStockAlertsWithSession Response Text: " + response.getText());

        assertEquals("Expected 200 OK for low stock alerts", 200, response.getResponseCode());
        assertTrue("Expected JSON array response", response.getText().startsWith("["));
        // Optionally, parse and verify low stock items if specific data is expected
    }

    @Test
    public void testGetLowStockAlertsWithoutSession() throws Exception {
        WebRequest request = new GetMethodWebRequest(baseUrl);

        WebResponse response = wc.getResponse(request);
        System.out.println("testGetLowStockAlertsWithoutSession Response Code: " + response.getResponseCode());
        System.out.println("testGetLowStockAlertsWithoutSession Response Text: " + response.getText());

        assertEquals("Expected 200 OK for no stock alerts", 200, response.getResponseCode());
        assertEquals("Expected empty JSON array for no stock alerts", "[]", response.getText());
    }

    @Test
    public void testInvalidAction() throws Exception {
        WebRequest request = new PostMethodWebRequest(baseUrl);
        request.setParameter("action", "invalid_action");

        WebResponse response = wc.getResponse(request);
        System.out.println("testInvalidAction Response Code: " + response.getResponseCode());
        System.out.println("testInvalidAction Response Text: " + response.getText());

        assertEquals("Expected 400 Bad Request for invalid action", 400, response.getResponseCode());
        assertTrue("Expected error message for unknown action", response.getText().contains("Unknown action"));
    }
}
