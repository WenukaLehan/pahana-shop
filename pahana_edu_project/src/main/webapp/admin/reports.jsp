<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<link rel="stylesheet" href="../css/reports.css">
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<div class="reports-container">
    <div class="reports-header">
        <h2>Business Reports & Analytics</h2>
    </div>

    <!-- Filter Section -->
    <div class="filter-section">
        <div class="filter-row">
            <div class="filter-group">
                <label>Report Type</label>
                <select class="form-select" id="reportType">
                    <option value="sales">Sales Report</option>
                    <option value="products">Product Report</option>
                    <option value="customers">Customer Report</option>
                    <option value="inventory">Inventory Report</option>
                    <option value="payment">Payment Report</option>
                </select>
            </div>
            <div class="filter-group">
                <label>Date Range</label>
                <select class="form-select" id="dateRange">
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="quarter">This Quarter</option>
                    <option value="year">This Year</option>
                    <option value="custom">Custom Range</option>
                </select>
            </div>
            <div class="filter-group date-inputs" id="customDateInputs" style="display: none;">
                <div class="date-row">
                    <div class="date-field">
                        <label>From Date</label>
                        <input type="date" class="form-input" id="fromDate">
                    </div>
                    <div class="date-field">
                        <label>To Date</label>
                        <input type="date" class="form-input" id="toDate">
                    </div>
                </div>
            </div>
        </div>
        <div class="filter-actions">
            <button class="action-btn generate" id="generateReportBtn">
                <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
                    <path d="M3 3h18v2H3V3zm0 4h18v2H3V7zm0 4h18v2H3v-2zm0 4h18v2H3v-2zm0 4h18v2H3v-2z"/>
                </svg>
                Generate Report
            </button>
            <button class="action-btn export" id="exportReportBtn">
                <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
                </svg>
                Export PDF
            </button>
        </div>
    </div>

    <!-- Summary Cards -->
    <div class="summary-section">
        <div class="summary-card">
            <div class="card-icon sales-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                </svg>
            </div>
            <div class="card-content">
                <h3 id="totalSales">Rs: 0.00</h3>
                <p>Total Sales</p>
                <span class="trend positive" id="salesTrend">+12.5%</span>
            </div>
        </div>
        <div class="summary-card">
            <div class="card-icon orders-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
                    <path d="M7 4V2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h4z"/>
                    <path d="M4 8v13h16V8H4z"/>
                </svg>
            </div>
            <div class="card-content">
                <h3 id="totalOrders">0</h3>
                <p>Total Orders</p>
                <span class="trend positive" id="ordersTrend">+8.2%</span>
            </div>
        </div>
        <div class="summary-card">
            <div class="card-icon customers-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2C14.21 2 16 3.79 16 6S14.21 10 12 10 8 8.21 8 6 9.79 2 12 2zM21 9V7L17 4 13 7V9C13 9.55 13.45 10 14 10H20C20.55 10 21 9.55 21 9zM4 7V9C4 9.55 4.45 10 5 10H11C11.55 10 12 9.55 12 9V7L8 4 4 7z"/>
                </svg>
            </div>
            <div class="card-content">
                <h3 id="totalCustomers">0</h3>
                <p>Total Customers</p>
                <span class="trend positive" id="customersTrend">+5.7%</span>
            </div>
        </div>
        <div class="summary-card">
            <div class="card-icon profit-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2L13.09 6.26L18 4.27L16.18 8.53L21 9L17.64 12.36L19 17L14.18 15.73L12 20L9.82 15.73L5 17L6.36 12.36L3 9L7.82 8.53L6 4.27L10.91 6.26L12 2Z"/>
                </svg>
            </div>
            <div class="card-content">
                <h3 id="totalProfit">Rs: 0.00</h3>
                <p>Net Profit</p>
                <span class="trend positive" id="profitTrend">+15.3%</span>
            </div>
        </div>
    </div>

    <!-- Charts Section -->
    <div class="charts-section">
        <div class="chart-container">
            <div class="chart-header">
                <h3>Sales Trend</h3>
                <div class="chart-controls">
                    <button class="chart-btn active" data-period="daily">Daily</button>
                    <button class="chart-btn" data-period="weekly">Weekly</button>
                    <button class="chart-btn" data-period="monthly">Monthly</button>
                </div>
            </div>
            <div class="chart-content" id="salesChart">
                <!-- Chart will be rendered here -->
                <canvas id="salesChartCanvas"></canvas>
            </div>
        </div>
    </div>

    <!-- Reports Table -->
    <div class="reports-table-section">
        <div class="table-header">
            <h3 id="tableTitle">Sales Report</h3>
            <div class="table-controls">
                <input type="text" placeholder="Search..." class="search-input" id="searchInput">
                <select class="form-select small" id="entriesPerPage">
                    <option value="10">Show 10</option>
                    <option value="25">Show 25</option>
                    <option value="50">Show 50</option>
                    <option value="100">Show 100</option>
                </select>
            </div>
        </div>
        
        <div class="reports-table">
            <table id="reportsTable">
                <thead id="tableHead">
                    <tr>
                        <th>Date</th>
                        <th>Invoice ID</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Amount</th>
                        <th>Payment Method</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody id="tableBody">
                    <!-- Sample data rows -->
                    <tr class="empty-row">
                        <td colspan="7" style="text-align: center; color: #666; padding: 40px;">
                            No data available. Click "Generate Report" to load data.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="table-footer">
            <div class="pagination-info">
                <span id="paginationInfo">Showing 0 to 0 of 0 entries</span>
            </div>
            <div class="pagination-controls">
                <button class="pagination-btn" id="prevBtn" disabled>Previous</button>
                <div class="pagination-numbers" id="paginationNumbers">
                    <!-- Page numbers will be generated here -->
                </div>
                <button class="pagination-btn" id="nextBtn" disabled>Next</button>
            </div>
        </div>
    </div>
</div>

<!-- Loading Modal -->
<div class="modal" id="loadingModal">
    <div class="modal-content loading-content">
        <div class="loading-spinner"></div>
        <h3>Generating Report...</h3>
        <p>Please wait while we process your data.</p>
    </div>
</div>

<!-- Export Options Modal -->
<div class="modal" id="exportModal">
    <div class="modal-content">
        <div class="modal-header">
            <h3 class="modal-title">Export Report</h3>
            <button class="close-btn" onclick="closeModal('exportModal')">×</button>
        </div>
        <div class="export-options">
            <div class="export-option" data-type="pdf">
                <div class="option-icon pdf-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                    </svg>
                </div>
                <div class="option-content">
                    <h4>Export as PDF</h4>
                    <p>Generate a formatted PDF report</p>
                </div>
            </div>
            <div class="export-option" data-type="excel">
                <div class="option-icon excel-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                    </svg>
                </div>
                <div class="option-content">
                    <h4>Export as Excel</h4>
                    <p>Generate an Excel spreadsheet</p>
                </div>
            </div>
            <div class="export-option" data-type="csv">
                <div class="option-icon csv-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                    </svg>
                </div>
                <div class="option-content">
                    <h4>Export as CSV</h4>
                    <p>Generate a comma-separated values file</p>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="../js/reports.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Initialize reports functionality
    initReportsManagement();
});
</script>