package controllers;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import com.google.gson.Gson;

import daos.ReportDao;
import models.*;

import com.itextpdf.text.*;
import com.itextpdf.text.Font;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;

import java.io.OutputStream;


@WebServlet("/ReportServlet")
public class ReportServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	private ReportDao reportDAO = new ReportDao();
    private Gson gson = new Gson();
       

    
    public ReportServlet() {
        super();
        // TODO Auto-generated constructor stub
    }
    

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
      

        String action = request.getParameter("action");
        String fromDate = request.getParameter("fromDate");
        String toDate = request.getParameter("toDate");
        
        if ("sales".equals(action) || "products".equals(action) || "customers".equals(action) || "inventory".equals(action)) {
        	
        	 response.setContentType("application/json");
             response.setCharacterEncoding("UTF-8");
             PrintWriter out = response.getWriter();
             Object data = null;
	
	        try {
	            switch (action) {
	                case "sales":
	                    List<SalesReportItem> salesData = reportDAO.getSalesReports(fromDate, toDate);
	                    data = salesData;
	                    break;
	                case "products":
	                    List<ProductReportItem> productData = reportDAO.getProductReports();
	                    data = productData;
	                    break;
	                case "customers":
	                    List<CustomerReportItem> customerData = reportDAO.getCustomerReports();
	                    data = customerData;
	                    break;
	                case "inventory":
	                    List<ProductReportItem> inventoryData = reportDAO.getInventoryReports();
	                    data = inventoryData;
	                    break;
	                default:
	                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
	                    out.print("{\"error\":\"Invalid report type specified.\"}");
	                    return;
	            }
	            out.print(gson.toJson(data));
	
	        } catch (Exception e) {
	            e.printStackTrace();
	            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
	            out.print("{\"error\":\"An internal server error occurred.\"}");
	        }
        }else {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().print("{\"error\":\"Invalid action specified.\"}");
        }
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	String action = request.getParameter("action");
        String fromDate = request.getParameter("fromDate");
        String toDate = request.getParameter("toDate");

         if ("exportPdf".equals(action)) {
            exportToPDF(request, response, fromDate, toDate);
        }else if ("exportExcel".equals(action)) {
            // Call the HTML-based Excel export method
            exportToExcelHtml(request, response, fromDate, toDate);
        } else {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().print("{\"error\":\"Invalid action specified.\"}");
        }
	}
    

    
    private void exportToPDF(HttpServletRequest request, HttpServletResponse response, String fromDate, String toDate) throws IOException {
        String reportType = request.getParameter("reportType");
        List<?> data = null;
        String fileName = reportType + "_report.pdf";
        String title = reportType.substring(0, 1).toUpperCase() + reportType.substring(1) + " Report";

        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=\"" + fileName + "\"");

        try (OutputStream os = response.getOutputStream()) {
            Document document = new Document(PageSize.A4.rotate()); // Landscape for wider tables
            PdfWriter.getInstance(document, os);
            document.open();

            // Add Title
            Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD, BaseColor.BLACK);
            Paragraph reportTitle = new Paragraph(title, titleFont);
            reportTitle.setAlignment(Element.ALIGN_CENTER);
            reportTitle.setSpacingAfter(20);
            document.add(reportTitle);

            // Get data
            switch (reportType) {
                case "sales":
                    data = reportDAO.getSalesReports(fromDate, toDate);
                    break;
                case "products":
                    data = reportDAO.getProductReports();
                    break;
                case "customers":
                    data = reportDAO.getCustomerReports();
                    break;
                case "inventory":
                    data = reportDAO.getInventoryReports();
                    break;
                default:
                    response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid report type for PDF export.");
                    return;
            }

            // Create table
            String[] headers = getPdfHeaders(reportType);
            PdfPTable pdfTable = new PdfPTable(headers.length);
            pdfTable.setWidthPercentage(100); // Table width 100%
            pdfTable.setSpacingBefore(10f);
            pdfTable.setSpacingAfter(10f);

            // Add table headers
            Font headerFont = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD, BaseColor.WHITE);
            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(header, headerFont));
                cell.setBackgroundColor(new BaseColor(52, 152, 219)); // Blue color
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setPadding(5);
                pdfTable.addCell(cell);
            }

            // Add table data
            Font dataFont = new Font(Font.FontFamily.HELVETICA, 9, Font.NORMAL, BaseColor.BLACK);
            for (Object item : data) {
                populatePdfRow(pdfTable, item, reportType, dataFont);
            }

            document.add(pdfTable);
            document.close();

        } catch (DocumentException e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error generating PDF report: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error generating PDF report.");
        }
    }

    // Helper method to get Excel headers based on report type
    private String[] getExcelHeaders(String reportType) {
        switch (reportType) {
            case "sales":
                return new String[]{"Date", "Invoice ID", "Customer", "Items", "Amount", "Payment Method", "Status"};
            case "products":
                return new String[]{"Product ID", "Product Name", "Category", "Sold Qty", "Revenue", "Profit", "Stock"};
            case "customers":
                return new String[]{"Customer ID", "Name", "Email", "Total Orders", "Total Spent", "Last Order", "Status"};
            case "inventory":
                return new String[]{"Product ID", "Product Name", "Current Stock", "Min Stock", "Max Stock", "Reorder Level", "Status"};
            default:
                return new String[]{};
        }
    }

  

    // Helper method to get PDF headers based on report type
    private String[] getPdfHeaders(String reportType) {
        // PDF headers can be the same as Excel headers for simplicity
        return getExcelHeaders(reportType);
    }

    // Helper method to populate a PDF table row based on report type
    private void populatePdfRow(PdfPTable table, Object item, String reportType, Font font) {
        PdfPCell cell;
        switch (reportType) {
            case "sales":
                SalesReportItem salesItem = (SalesReportItem) item;
                cell = new PdfPCell(new Phrase(salesItem.getDate() != null ? salesItem.getDate().toString() : "N/A", font)); table.addCell(cell);
                cell = new PdfPCell(new Phrase(String.valueOf(salesItem.getInvoiceId()), font)); table.addCell(cell);
                cell = new PdfPCell(new Phrase(salesItem.getFullName() != null ? salesItem.getFullName() : "N/A", font)); table.addCell(cell);
                cell = new PdfPCell(new Phrase(String.valueOf(salesItem.getItems()), font)); table.addCell(cell);
                cell = new PdfPCell(new Phrase(String.format("Rs: %.2f", salesItem.getTotal()), font)); table.addCell(cell);
                cell = new PdfPCell(new Phrase(salesItem.getMethod(), font)); table.addCell(cell);
                cell = new PdfPCell(new Phrase(salesItem.getStatus() != null ? salesItem.getStatus() : "Completed", font)); table.addCell(cell);
                break;
            case "products":
                ProductReportItem productItem = (ProductReportItem) item;
                cell = new PdfPCell(new Phrase(String.valueOf(productItem.getBookId()), font)); table.addCell(cell);
                cell = new PdfPCell(new Phrase(productItem.getBookName(), font)); table.addCell(cell);
                cell = new PdfPCell(new Phrase(String.valueOf(productItem.getCategoryId()), font)); table.addCell(cell);
                cell = new PdfPCell(new Phrase(String.valueOf(productItem.getSold_qty()), font)); table.addCell(cell);
                cell = new PdfPCell(new Phrase(String.format("Rs: %.2f", productItem.getSold_qty() * productItem.getPrice()), font)); table.addCell(cell);
                cell = new PdfPCell(new Phrase(String.format("Rs: %.2f", productItem.getSold_qty() * productItem.getPrice() * 0.2), font)); table.addCell(cell);
                cell = new PdfPCell(new Phrase(String.valueOf(productItem.getStock()), font)); table.addCell(cell);
                break;
            case "customers":
                CustomerReportItem customerItem = (CustomerReportItem) item;
                cell = new PdfPCell(new Phrase(customerItem.getUserId(), font)); table.addCell(cell);
                cell = new PdfPCell(new Phrase(customerItem.getFullName(), font)); table.addCell(cell);
                cell = new PdfPCell(new Phrase(customerItem.getEmail(), font)); table.addCell(cell);
                cell = new PdfPCell(new Phrase(String.valueOf(customerItem.getTotal_orders()), font)); table.addCell(cell);
                cell = new PdfPCell(new Phrase(String.format("Rs: %.2f", customerItem.getTotal_spent()), font)); table.addCell(cell);
                cell = new PdfPCell(new Phrase(customerItem.getDate() != null ? customerItem.getDate().toString() : "N/A", font)); table.addCell(cell);
                cell = new PdfPCell(new Phrase(customerItem.getStatus() != null ? customerItem.getStatus() : "Active", font)); table.addCell(cell);
                break;
            case "inventory":
                ProductReportItem inventoryItem = (ProductReportItem) item;
                cell = new PdfPCell(new Phrase(String.valueOf(inventoryItem.getBookId()), font)); table.addCell(cell);
                cell = new PdfPCell(new Phrase(inventoryItem.getBookName(), font)); table.addCell(cell);
                cell = new PdfPCell(new Phrase(String.valueOf(inventoryItem.getStock()), font)); table.addCell(cell);
                cell = new PdfPCell(new Phrase(String.valueOf(Math.floor(inventoryItem.getStock() * 0.2)), font)); table.addCell(cell);
                cell = new PdfPCell(new Phrase(String.valueOf(Math.floor(inventoryItem.getStock() * 2)), font)); table.addCell(cell);
                cell = new PdfPCell(new Phrase(String.valueOf(Math.floor(inventoryItem.getStock() * 0.3)), font)); table.addCell(cell);
                cell = new PdfPCell(new Phrase(inventoryItem.getStock() > 10 ? "Active" : "Low", font)); table.addCell(cell);
                break;
        }
    }
    
    // NEW METHOD: Export to Excel using HTML table
    private void exportToExcelHtml(HttpServletRequest request, HttpServletResponse response, String fromDate, String toDate) throws IOException {
        String reportType = request.getParameter("reportType");
        List<?> data = null;
        String fileName = reportType + "_report_" + new java.text.SimpleDateFormat("yyyyMMdd").format(new java.util.Date()) + ".xls"; // Use .xls extension
        String title = reportType.substring(0, 1).toUpperCase() + reportType.substring(1) + " Report";

        response.setContentType("application/vnd.ms-excel"); // Important MIME type for Excel
        response.setHeader("Content-Disposition", "attachment; filename=\"" + fileName + "\"");
        response.setCharacterEncoding("UTF-8");

        PrintWriter out = response.getWriter();

        try {
            // Get data based on report type
            switch (reportType) {
                case "sales":
                    data = reportDAO.getSalesReports(fromDate, toDate);
                    break;
                case "products":
                    data = reportDAO.getProductReports();
                    break;
                case "customers":
                    data = reportDAO.getCustomerReports();
                    break;
                case "inventory":
                    data = reportDAO.getInventoryReports();
                    break;
                default:
                    response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid report type for Excel export.");
                    return;
            }

            // Start HTML document
            out.println("<html>");
            out.println("<head><meta charset=\"UTF-8\"></head>");
            out.println("<body>");
            out.println("<h2>" + title + "</h2>");
            out.println("<table border=\"1\">");

            // Add table headers
            out.println("<thead><tr>");
            String[] headers = getHtmlExcelHeaders(reportType);
            for (String header : headers) {
                out.println("<th>" + header + "</th>");
            }
            out.println("</tr></thead>");

            // Add table body
            out.println("<tbody>");
            for (Object item : data) {
                out.println("<tr>");
                populateHtmlExcelRow(out, item, reportType);
                out.println("</tr>");
            }
            out.println("</tbody>");

            out.println("</table>");
            out.println("</body>");
            out.println("</html>");

        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error generating Excel (HTML) report.");
        } finally {
            if (out != null) {
                out.close();
            }
        }
    }

    
    // Helper method to get HTML Excel headers based on report type
    private String[] getHtmlExcelHeaders(String reportType) {
        // These headers should match your JavaScript's CSV headers
        switch (reportType) {
            case "sales":
                return new String[]{"Date", "Invoice ID", "Customer", "Items", "Amount", "Payment Method", "Status"};
            case "products":
                return new String[]{"Product ID", "Product Name", "Category", "Sold Qty", "Revenue", "Profit", "Stock"};
            case "customers":
                return new String[]{"Customer ID", "Name", "Email", "Total Orders", "Total Spent", "Last Order", "Status"};
            case "inventory":
                return new String[]{"Product ID", "Product Name", "Current Stock", "Min Stock", "Max Stock", "Reorder Level", "Status"};
            default:
                return new String[]{};
        }
    }

    // Helper method to populate an HTML Excel row based on report type
    private void populateHtmlExcelRow(PrintWriter out, Object item, String reportType) {
        switch (reportType) {
            case "sales":
                SalesReportItem salesItem = (SalesReportItem) item;
                out.println("<td>" + (salesItem.getDate() != null ? salesItem.getDate().toString() : "N/A") + "</td>");
                out.println("<td>" + salesItem.getInvoiceId() + "</td>");
                out.println("<td>" + (salesItem.getFullName() != null ? salesItem.getFullName() : "N/A") + "</td>");
                out.println("<td>" + salesItem.getItems() + "</td>");
                out.println("<td>" + String.format("%.2f", salesItem.getTotal()) + "</td>");
                out.println("<td>" + salesItem.getMethod() + "</td>");
                out.println("<td>" + (salesItem.getStatus() != null ? salesItem.getStatus() : "Completed") + "</td>");
                break;
            case "products":
                ProductReportItem productItem = (ProductReportItem) item;
                out.println("<td>" + productItem.getBookId() + "</td>");
                out.println("<td>" + productItem.getBookName() + "</td>");
                out.println("<td>" + productItem.getCategoryId() + "</td>");
                out.println("<td>" + productItem.getSold_qty() + "</td>");
                out.println("<td>" + String.format("%.2f", productItem.getSold_qty() * productItem.getPrice()) + "</td>");
                out.println("<td>" + String.format("%.2f", productItem.getSold_qty() * productItem.getPrice() * 0.2) + "</td>");
                out.println("<td>" + productItem.getStock() + "</td>");
                break;
            case "customers":
                CustomerReportItem customerItem = (CustomerReportItem) item;
                out.println("<td>" + customerItem.getUserId() + "</td>");
                out.println("<td>" + customerItem.getFullName() + "</td>");
                out.println("<td>" + customerItem.getEmail() + "</td>");
                out.println("<td>" + customerItem.getTotal_orders() + "</td>");
                out.println("<td>" + String.format("%.2f", customerItem.getTotal_spent()) + "</td>");
                out.println("<td>" + (customerItem.getDate() != null ? customerItem.getDate().toString() : "N/A") + "</td>");
                out.println("<td>" + (customerItem.getStatus() != null ? customerItem.getStatus() : "Active") + "</td>");
                break;
            case "inventory":
                ProductReportItem inventoryItem = (ProductReportItem) item;
                out.println("<td>" + inventoryItem.getBookId() + "</td>");
                out.println("<td>" + inventoryItem.getBookName() + "</td>");
                out.println("<td>" + inventoryItem.getStock() + "</td>");
                out.println("<td>" + Math.floor(inventoryItem.getStock() * 0.2) + "</td>");
                out.println("<td>" + Math.floor(inventoryItem.getStock() * 2) + "</td>");
                out.println("<td>" + Math.floor(inventoryItem.getStock() * 0.3) + "</td>");
                out.println("<td>" + (inventoryItem.getStock() > 10 ? "Active" : "Low") + "</td>");
                break;
        }
    }
	
}
