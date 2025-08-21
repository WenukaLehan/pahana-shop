package com.example.tests;


import com.meterware.httpunit.*;
import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.*;

public class ReportServletTest {

    private WebConversation wc;
    private String baseUrl = "http://localhost:8080/pahana_edu_project/ReportServlet";

    private static final String VALID_FROM_DATE = "2025-01-01";
    private static final String VALID_TO_DATE = "2025-12-31";
    private static final String INVALID_REPORT_TYPE = "invalid_report";

    @Before
    public void setUp() throws Exception {
        try {
            HttpUnitOptions.setScriptingEnabled(false);
            wc = new WebConversation();
            wc.setExceptionsThrownOnErrorStatus(false);
            wc.getClientProperties().setAutoRedirect(false);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to initialize WebConversation", e);
        }
    }

    @Test
    public void testSalesReportSuccess() throws Exception {
        WebRequest request = new PostMethodWebRequest(baseUrl);
        request.setParameter("action", "sales");
        request.setParameter("fromDate", VALID_FROM_DATE);
        request.setParameter("toDate", VALID_TO_DATE);

        WebResponse response = wc.getResponse(request);
        System.out.println("testSalesReportSuccess Response Code: " + response.getResponseCode());
        System.out.println("testSalesReportSuccess Response Text: " + response.getText());

        assertEquals("Expected 200 OK for successful sales report", 200, response.getResponseCode());
        assertTrue("Expected JSON array response", response.getText().startsWith("["));
        assertFalse("Expected non-empty JSON array", response.getText().equals("[]"));
    }

    @Test
    public void testProductsReportSuccess() throws Exception {
        WebRequest request = new PostMethodWebRequest(baseUrl);
        request.setParameter("action", "products");

        WebResponse response = wc.getResponse(request);
        System.out.println("testProductsReportSuccess Response Code: " + response.getResponseCode());
        System.out.println("testProductsReportSuccess Response Text: " + response.getText());

        assertEquals("Expected 200 OK for successful products report", 200, response.getResponseCode());
        assertTrue("Expected JSON array response", response.getText().startsWith("["));
        assertFalse("Expected non-empty JSON array", response.getText().equals("[]"));
    }

    @Test
    public void testCustomersReportSuccess() throws Exception {
        WebRequest request = new PostMethodWebRequest(baseUrl);
        request.setParameter("action", "customers");

        WebResponse response = wc.getResponse(request);
        System.out.println("testCustomersReportSuccess Response Code: " + response.getResponseCode());
        System.out.println("testCustomersReportSuccess Response Text: " + response.getText());

        assertEquals("Expected 200 OK for successful customers report", 200, response.getResponseCode());
        assertTrue("Expected JSON array response", response.getText().startsWith("["));
        assertFalse("Expected non-empty JSON array", response.getText().equals("[]"));
    }

    @Test
    public void testInventoryReportSuccess() throws Exception {
        WebRequest request = new PostMethodWebRequest(baseUrl);
        request.setParameter("action", "inventory");

        WebResponse response = wc.getResponse(request);
        System.out.println("testInventoryReportSuccess Response Code: " + response.getResponseCode());
        System.out.println("testInventoryReportSuccess Response Text: " + response.getText());

        assertEquals("Expected 200 OK for successful inventory report", 200, response.getResponseCode());
        assertTrue("Expected JSON array response", response.getText().startsWith("["));
        assertFalse("Expected non-empty JSON array", response.getText().equals("[]"));
    }

    @Test
    public void testInvalidActionPost() throws Exception {
        WebRequest request = new PostMethodWebRequest(baseUrl);
        request.setParameter("action", "invalid_action");

        WebResponse response = wc.getResponse(request);
        System.out.println("testInvalidActionPost Response Code: " + response.getResponseCode());
        System.out.println("testInvalidActionPost Response Text: " + response.getText());

        assertEquals("Expected 400 Bad Request for invalid action", 400, response.getResponseCode());
        assertTrue("Expected JSON error message", response.getText().contains("\"error\":\"Invalid action specified.\""));
    }

    @Test
    public void testExportPdfSalesSuccess() throws Exception {
        WebRequest request = new GetMethodWebRequest(baseUrl);
        request.setParameter("action", "exportPdf");
        request.setParameter("reportType", "sales");
        request.setParameter("fromDate", VALID_FROM_DATE);
        request.setParameter("toDate", VALID_TO_DATE);

        WebResponse response = wc.getResponse(request);
        System.out.println("testExportPdfSalesSuccess Response Code: " + response.getResponseCode());
        System.out.println("testExportPdfSalesSuccess Content-Type: " + response.getContentType());
        System.out.println("testExportPdfSalesSuccess Content-Disposition: " + response.getHeaderField("Content-Disposition"));

        assertEquals("Expected 200 OK for successful PDF export", 200, response.getResponseCode());
        assertEquals("Expected application/pdf content type", "application/pdf", response.getContentType());
        assertTrue("Expected Content-Disposition with sales_report.pdf", response.getHeaderField("Content-Disposition").contains("filename=\"sales_report.pdf\""));
    }

    @Test
    public void testExportPdfInvalidReportType() throws Exception {
        WebRequest request = new GetMethodWebRequest(baseUrl);
        request.setParameter("action", "exportPdf");
        request.setParameter("reportType", INVALID_REPORT_TYPE);
        request.setParameter("fromDate", VALID_FROM_DATE);
        request.setParameter("toDate", VALID_TO_DATE);

        WebResponse response = wc.getResponse(request);
        System.out.println("testExportPdfInvalidReportType Response Code: " + response.getResponseCode());
        System.out.println("testExportPdfInvalidReportType Response Text: " + response.getText());

        assertEquals("Expected 400 Bad Request for invalid report type", 400, response.getResponseCode());
        assertTrue("Expected error message for invalid report type", response.getText().contains("Invalid report type for PDF export"));
    }

    @Test
    public void testExportExcelSalesSuccess() throws Exception {
        WebRequest request = new GetMethodWebRequest(baseUrl);
        request.setParameter("action", "exportExcel");
        request.setParameter("reportType", "sales");
        request.setParameter("fromDate", VALID_FROM_DATE);
        request.setParameter("toDate", VALID_TO_DATE);

        WebResponse response = wc.getResponse(request);
        System.out.println("testExportExcelSalesSuccess Response Code: " + response.getResponseCode());
        System.out.println("testExportExcelSalesSuccess Content-Type: " + response.getContentType());
        System.out.println("testExportExcelSalesSuccess Content-Disposition: " + response.getHeaderField("Content-Disposition"));
        System.out.println("testExportExcelSalesSuccess Response Text: " + response.getText());

        assertEquals("Expected 200 OK for successful Excel export", 200, response.getResponseCode());
        assertEquals("Expected application/vnd.ms-excel content type", "application/vnd.ms-excel", response.getContentType());
        assertTrue("Expected Content-Disposition with sales_report_", response.getHeaderField("Content-Disposition").contains("filename=\"sales_report_"));
        assertTrue("Expected HTML table in response", response.getText().contains("<table border=\"1\">"));
        assertTrue("Expected sales report headers", response.getText().contains("<th>Date</th>"));
    }

    @Test
    public void testExportExcelInvalidReportType() throws Exception {
        WebRequest request = new GetMethodWebRequest(baseUrl);
        request.setParameter("action", "exportExcel");
        request.setParameter("reportType", INVALID_REPORT_TYPE);
        request.setParameter("fromDate", VALID_FROM_DATE);
        request.setParameter("toDate", VALID_TO_DATE);

        WebResponse response = wc.getResponse(request);
        System.out.println("testExportExcelInvalidReportType Response Code: " + response.getResponseCode());
        System.out.println("testExportExcelInvalidReportType Response Text: " + response.getText());

        assertEquals("Expected 400 Bad Request for invalid report type", 400, response.getResponseCode());
        assertTrue("Expected error message for invalid report type", response.getText().contains("Invalid report type for Excel export"));
    }

    @Test
    public void testInvalidActionGet() throws Exception {
        WebRequest request = new GetMethodWebRequest(baseUrl);
        request.setParameter("action", "invalid_action");

        WebResponse response = wc.getResponse(request);
        System.out.println("testInvalidActionGet Response Code: " + response.getResponseCode());
        System.out.println("testInvalidActionGet Response Text: " + response.getText());

        assertEquals("Expected 400 Bad Request for invalid action", 400, response.getResponseCode());
        assertTrue("Expected JSON error message", response.getText().contains("\"error\":\"Invalid action specified.\""));
    }
}