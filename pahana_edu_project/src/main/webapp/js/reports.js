"use strict";

// Reports Management System
let reportsData = [];
let currentPage = 1;
let entriesPerPage = 10;
let currentReportType = 'sales';
let filteredData = [];
let salesChart = null;

// Initialize Reports Management
function initReportsManagement() {
    console.log('Initializing Reports Management System...');
    
    // Initialize event listeners for user interactions
    initEventListeners();
    
    // Set a default date range for the initial report
    setDefaultDateRange();

    // Initialize the chart, but it will be empty until the first report is generated
    initSalesChart();
    
    // Automatically generate the initial report on page load
    generateReport();
    
    console.log('Reports Management System initialized successfully!');
}

// Initialize Event Listeners
function initEventListeners() {
    document.getElementById('reportType').addEventListener('change', handleReportTypeChange);
    document.getElementById('dateRange').addEventListener('change', handleDateRangeChange);
    document.getElementById('generateReportBtn').addEventListener('click', generateReport);
    document.getElementById('exportReportBtn').addEventListener('click', () => showModal('exportModal'));
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    document.getElementById('entriesPerPage').addEventListener('change', handleEntriesPerPageChange);
    document.getElementById('prevBtn').addEventListener('click', () => changePage(currentPage - 1));
    document.getElementById('nextBtn').addEventListener('click', () => changePage(currentPage + 1));
    document.querySelectorAll('.chart-btn').forEach(btn => {
        btn.addEventListener('click', handleChartPeriodChange);
    });
    document.querySelectorAll('.export-option').forEach(option => {
        option.addEventListener('click', handleExportOption);
    });
}

// Handle Report Type Change
function handleReportTypeChange() {
    currentReportType = document.getElementById('reportType').value;
    updateTableHeaders();
    generateReport();
}

// Handle Date Range Change
function handleDateRangeChange() {
    const dateRange = document.getElementById('dateRange').value;
    const customInputs = document.getElementById('customDateInputs');
    
    if (dateRange === 'custom') {
        customInputs.style.display = 'block';
    } else {
        customInputs.style.display = 'none';
        setDateRangeValues(dateRange);
    }
}

// Set Default Date Range (Last 30 days)
function setDefaultDateRange() {
    const today = new Date();
    const fromDate = new Date(today);
    fromDate.setDate(today.getDate() - 30);
    
    document.getElementById('fromDate').value = fromDate.toISOString().split('T')[0];
    document.getElementById('toDate').value = today.toISOString().split('T')[0];
}

// Set Date Range Values based on pre-defined options
function setDateRangeValues(range) {
    const today = new Date();
    const fromDate = new Date();
    
    switch (range) {
        case 'today':
            fromDate.setDate(today.getDate());
            break;
        case 'week':
            fromDate.setDate(today.getDate() - 7);
            break;
        case 'month':
            fromDate.setMonth(today.getMonth() - 1);
            break;
        case 'quarter':
            fromDate.setMonth(today.getMonth() - 3);
            break;
        case 'year':
            fromDate.setFullYear(today.getFullYear() - 1);
            break;
    }
    
    document.getElementById('fromDate').value = fromDate.toISOString().split('T')[0];
    document.getElementById('toDate').value = today.toISOString().split('T')[0];
}

/**
 * Asynchronously generates a report using a POST request.
 * The function shows a loading modal, sends a POST request with date parameters,
 * and handles the success, failure, and completion of the request.
 */
function generateReport() {
    showModal('loadingModal');

    const fromDate = $('#fromDate').val();
    const toDate = $('#toDate').val();

    // The context path for the servlet is defined here.
    // Replace with your actual context path or define it globally in your HTML.
    const contextPath = window.contextPath || '';

    $.post(
        `${contextPath}/ReportServlet`,
        { action: currentReportType, fromDate: fromDate, toDate: toDate }
    )
    .done(function(reportsData) {
        if (typeof reportsData === 'string') {
            try {
                reportsData = JSON.parse(reportsData);
            } catch (e) {
                showNotification(`Error: Expected JSON, received unexpected text.`, 'error');
                console.error('Error parsing JSON:', e);
                return;
            }
        }
        
        filteredData = [...reportsData];
        
        updateSummaryCards();
        updateChart();
        updateReportsTable();
        
        showNotification('Report generated successfully!', 'success');
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        let errorMessage = 'An unknown error occurred.';
        if (jqXHR.responseJSON && jqXHR.responseJSON.error) {
            errorMessage = jqXHR.responseJSON.error;
        } else if (errorThrown) {
            errorMessage = errorThrown;
        }

        console.error('Error generating report:', textStatus, errorThrown, jqXHR.responseText);
        showNotification(`Error generating report: ${errorMessage}`, 'error');
    })
    .always(function() {
        closeModal('loadingModal');
    });
}

// Updates the summary cards with data from the filtered report data
function updateSummaryCards() {
    let totalSales = 0;
    let totalOrders = 0;
    let uniqueCustomers = 0;
    let totalProfit = 0;
    
    switch (currentReportType) {
        case 'sales':
            totalSales = filteredData.reduce((sum, item) => sum + item.total, 0);
            totalOrders = filteredData.length;
            uniqueCustomers = new Set(filteredData.map(item => item.customerId)).size;
            totalProfit = totalSales * 0.2;
            break;
        case 'products':
            totalSales = filteredData.reduce((sum, item) => sum + (item.sold_qty || 0) * item.price, 0);
            totalOrders = filteredData.reduce((sum, item) => sum + (item.sold_qty || 0), 0);
            uniqueCustomers = filteredData.length; // Number of unique products
            totalProfit = totalSales * 0.2;
            break;
        case 'customers':
            totalSales = filteredData.reduce((sum, item) => sum + (item.total_spent || 0), 0);
            totalOrders = filteredData.reduce((sum, item) => sum + (item.total_orders || 0), 0);
            uniqueCustomers = filteredData.length;
            totalProfit = totalSales * 0.2;
            break;
        case 'inventory':
            totalSales = filteredData.reduce((sum, item) => sum + item.stock * item.price, 0);
            totalOrders = filteredData.reduce((sum, item) => sum + (item.sold_qty || 0), 0);
            uniqueCustomers = filteredData.length;
            totalProfit = totalSales * 0.2;
            break;
    }
    
    document.getElementById('totalSales').textContent = `Rs: ${totalSales.toFixed(2)}`;
    document.getElementById('totalOrders').textContent = totalOrders;
    document.getElementById('totalCustomers').textContent = uniqueCustomers;
    document.getElementById('totalProfit').textContent = `Rs: ${totalProfit.toFixed(2)}`;
    
    updateTrendIndicators();
}

// Updates trend indicators with simulated data
function updateTrendIndicators() {
    const trends = [
        { id: 'salesTrend', value: Math.random() * 20 - 10 },
        { id: 'ordersTrend', value: Math.random() * 15 - 5 },
        { id: 'customersTrend', value: Math.random() * 10 - 3 },
        { id: 'profitTrend', value: Math.random() * 25 - 10 }
    ];
    
    trends.forEach(trend => {
        const element = document.getElementById(trend.id);
        const isPositive = trend.value > 0;
        element.textContent = `${isPositive ? '+' : ''}${trend.value.toFixed(1)}%`;
        element.className = `trend ${isPositive ? 'positive' : 'negative'}`;
    });
}

// Updates the chart with new data
function updateChart() {
    const chartData = generateChartData();
    
    if (salesChart) {
        salesChart.data = chartData;
        salesChart.update();
    } else {
        initSalesChart(chartData);
    }
}

// Initializes the Chart.js chart instance
function initSalesChart(data = null) {
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded. Please include the Chart.js library.');
        return;
    }
    const canvas = document.getElementById('salesChartCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const chartData = data || generateChartData();
    
    if (salesChart) {
        salesChart.destroy();
    }
    
    salesChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true, position: 'top' }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => 'Rs: ' + value
                    }
                }
            },
            elements: {
                line: { tension: 0.4 },
                point: { radius: 5, hoverRadius: 8 }
            }
        }
    });
}

/**
 * Dynamically generates chart data from the `filteredData` array.
 * This function handles different aggregation logic for each report type.
 */
// Generate Chart Data
function generateChartData() {
    // Determine the active period button, defaulting to 'daily'
    const period = document.querySelector('.chart-btn.active')?.dataset.period || 'daily';
    let labels = [];
    let salesData = [];
    let ordersData = [];
    
    // Object to hold aggregated data, grouped by date or product name
    const groupedData = {};
    
    // Iterate over the filtered data to aggregate values
    filteredData.forEach(item => {
        let key; // Key for grouping (e.g., date string, product name)
        let valueForSales = 0; // Value to add to sales/revenue
        let valueForOrders = 0; // Value to add to orders/quantity

        // Determine the key and values based on the current report type
        switch (currentReportType) {
            case 'sales':
                // For sales reports, group by date
                if (!item.date) return; // Skip items without a date
                valueForSales = item.total || 0;
                valueForOrders = 1; // Each sales item is one order/transaction

                const salesDate = new Date(item.date);
                if (isNaN(salesDate.getTime())) return; // Skip invalid dates

                switch (period) {
                    case 'daily':
                        key = formatDate(salesDate); // e.g., "01/08/2025"
                        break;
                    case 'weekly':
                        // Calculate the start of the week (Monday)
                        const day = salesDate.getDay(); // 0 for Sunday, 1 for Monday, etc.
                        const diff = salesDate.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday being 0
                        const weekStart = new Date(salesDate.setDate(diff));
                        key = `Week starting ${formatDate(weekStart)}`;
                        break;
                    case 'monthly':
                        key = salesDate.toLocaleString('default', { month: 'long', year: 'numeric' }); // e.g., "August 2025"
                        break;
                }
                break;

            case 'products':
            case 'inventory':
                // For product/inventory reports, group by product name
                key = item.bookName || `Product ID: ${item.bookId}`;
                valueForSales = (item.sold_qty || 0) * (item.price || 0); // Revenue
                valueForOrders = item.sold_qty || 0; // Quantity sold
                break;

            case 'customers':
                // For customer reports, group by date (last order date)
                if (!item.date) return; // Use last order date
                valueForSales = item.total_spent || 0;
                valueForOrders = item.total_orders || 0;

                const customerDate = new Date(item.date);
                if (isNaN(customerDate.getTime())) return;

                switch (period) {
                    case 'daily':
                        key = formatDate(customerDate);
                        break;
                    case 'weekly':
                        const day = customerDate.getDay();
                        const diff = customerDate.getDate() - day + (day === 0 ? -6 : 1);
                        const weekStart = new Date(customerDate.setDate(diff));
                        key = `Week starting ${formatDate(weekStart)}`;
                        break;
                    case 'monthly':
                        key = customerDate.toLocaleString('default', { month: 'long', year: 'numeric' });
                        break;
                }
                break;
            default:
                // Fallback or error handling for unknown report types
                return;
        }

        // Initialize group if it doesn't exist
        if (!groupedData[key]) {
            groupedData[key] = { sales: 0, orders: 0 };
        }
        // Aggregate values
        groupedData[key].sales += valueForSales;
        groupedData[key].orders += valueForOrders;
    });

    // Sort labels for chronological order if they are dates
    if (currentReportType === 'sales' || currentReportType === 'customers') {
        labels = Object.keys(groupedData).sort((a, b) => {
            if (period === 'daily') {
                // Parse DD/MM/YYYY to create comparable dates
                const [dayA, monthA, yearA] = a.split('/').map(Number);
                const [dayB, monthB, yearB] = b.split('/').map(Number);
                const dateA = new Date(yearA, monthA - 1, dayA);
                const dateB = new Date(yearB, monthB - 1, dayB);
                return dateA.getTime() - dateB.getTime();
            } else if (period === 'weekly') {
                // Extract date from "Week starting DD/MM/YYYY"
                const datePartA = a.substring(a.indexOf('starting ') + 9);
                const datePartB = b.substring(b.indexOf('starting ') + 9);
                const [dayA, monthA, yearA] = datePartA.split('/').map(Number);
                const [dayB, monthB, yearB] = datePartB.split('/').map(Number);
                const dateA = new Date(yearA, monthA - 1, dayA);
                const dateB = new Date(yearB, monthB - 1, dayB);
                return dateA.getTime() - dateB.getTime();
            } else if (period === 'monthly') {
                // Parse "Month Year" (e.g., "August 2025")
                const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                const [monthAStr, yearAStr] = a.split(' ');
                const [monthBStr, yearBStr] = b.split(' ');
                const dateA = new Date(parseInt(yearAStr), monthNames.indexOf(monthAStr), 1);
                const dateB = new Date(parseInt(yearBStr), monthNames.indexOf(monthBStr), 1);
                return dateA.getTime() - dateB.getTime();
            }
            return 0; // Should not happen for these report types
        });
    } else {
        // For product/inventory, just use the keys as labels
        labels = Object.keys(groupedData);
    }

    // Populate salesData and ordersData based on the sorted labels
    salesData = labels.map(key => groupedData[key].sales);
    ordersData = labels.map(key => groupedData[key].orders);
    
    return {
        labels: labels,
        datasets: [
            {
                label: (currentReportType === 'products' || currentReportType === 'inventory') ? 'Revenue (Rs)' : 'Sales (Rs)',
                data: salesData,
                borderColor: 'rgb(39, 174, 96)',
                backgroundColor: 'rgba(39, 174, 96, 0.1)',
                fill: true
            },
            {
                label: (currentReportType === 'products' || currentReportType === 'inventory') ? 'Quantity Sold' : 'Orders',
                data: ordersData,
                borderColor: 'rgb(52, 152, 219)',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                yAxisID: 'y1' // Use a secondary Y-axis if needed (defined in Chart.js options)
            }
        ]
    };
}

// Handle Chart Period Change
function handleChartPeriodChange(e) {
    document.querySelectorAll('.chart-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    updateChart();
}

// Update Table Headers
function updateTableHeaders() {
    const tableHead = document.getElementById('tableHead');
    const tableTitle = document.getElementById('tableTitle');
    
    let headers = [];
    let title = '';
    
    switch (currentReportType) {
        case 'sales':
            title = 'Sales Report';
            headers = ['Date', 'Invoice ID', 'Customer', 'Items', 'Amount', 'Payment Method', 'Status'];
            break;
        case 'products':
            title = 'Product Report';
            headers = ['Product ID', 'Product Name', 'Category', 'Sold Qty', 'Revenue', 'Profit', 'Stock'];
            break;
        case 'customers':
            title = 'Customer Report';
            headers = ['Customer ID', 'Name', 'Email', 'Total Orders', 'Total Spent', 'Last Order', 'Status'];
            break;
        case 'inventory':
            title = 'Inventory Report';
            headers = ['Product ID', 'Product Name', 'Current Stock', 'Status'];
            break;
    }
    
    tableTitle.textContent = title;
    tableHead.innerHTML = `<tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr>`;
}

// Update Reports Table
function updateReportsTable() {
    const tableBody = document.getElementById('tableBody');
    
    let displayData = filteredData;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (searchTerm) {
        displayData = displayData.filter(item => 
            Object.values(item).some(value => 
                value && value.toString().toLowerCase().includes(searchTerm)
            )
        );
    }
    
    const totalEntries = displayData.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = Math.min(startIndex + entriesPerPage, totalEntries);
    const pageData = displayData.slice(startIndex, endIndex);
    
    tableBody.innerHTML = '';
    
    if (pageData.length === 0) {
        tableBody.innerHTML = `
            <tr class="empty-row">
                <td colspan="7" style="text-align: center; color: #666; padding: 40px;">
                    No data found for the selected criteria.
                </td>
            </tr>
        `;
    } else {
        pageData.forEach(item => {
            const row = createTableRow(item);
            tableBody.appendChild(row);
        });
    }
    
    updatePagination(totalEntries, startIndex + 1, endIndex, totalPages);
}

// Create Table Row for the current report type
function createTableRow(item) {
    const row = document.createElement('tr');
    
    switch (currentReportType) {
        case 'sales':
            row.innerHTML = `
                <td>${formatDate(item.date)}</td>
                <td>${item.invoiceId}</td>
                <td>${item.fullName || 'N/A'}</td>
                <td>${item.items || 'N/A'}</td>
                <td>Rs: ${item.total.toFixed(2)}</td>
                <td>${item.method}</td>
                <td><span class="status-badge status-${(item.status || 'completed').toLowerCase()}">${item.status || 'Completed'}</span></td>
            `;
            break;
        case 'products':
            row.innerHTML = `
                <td>${item.bookId}</td>
                <td>${item.bookName}</td>
                <td>${item.categoryId}</td>
                <td>${item.sold_qty || 0}</td>
                <td>Rs: ${((item.sold_qty || 0) * item.price).toFixed(2)}</td>
                <td>Rs: ${((item.sold_qty || 0) * item.price * 0.2).toFixed(2)}</td>
                <td>${item.stock}</td>
            `;
            break;
        case 'customers':
            row.innerHTML = `
                <td>${item.userId}</td>
                <td>${item.fullName}</td>
                <td>${item.email}</td>
                <td>${item.total_orders || 0}</td>
                <td>Rs: ${(item.total_spent || 0).toFixed(2)}</td>
                <td>${formatDate(item.date)}</td>
                <td><span class="status-badge status-${(item.status || 'active').toLowerCase()}">${item.status || 'Active'}</span></td>
            `;
            break;
        case 'inventory':
            row.innerHTML = `
                <td>${item.bookId}</td>
                <td>${item.bookName}</td>
                <td>${item.stock}</td>
                <td><span class="status-badge status-${item.stock > 10 ? 'active' : 'low'}">${item.stock > 10 ? 'Active' : 'Low'}</span></td>
            `;
            break;
    }
    
    return row;
}

// Handle Search
function handleSearch() {
    currentPage = 1;
    updateReportsTable();
}

// Handle Entries Per Page Change
function handleEntriesPerPageChange() {
    entriesPerPage = parseInt(document.getElementById('entriesPerPage').value);
    currentPage = 1;
    updateReportsTable();
}

// Change Page
function changePage(page) {
    const totalPages = Math.ceil(filteredData.length / entriesPerPage);
    
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        updateReportsTable();
    }
}

// Update Pagination
function updatePagination(totalEntries, startIndex, endIndex, totalPages) {
    document.getElementById('paginationInfo').textContent = 
        `Showing ${startIndex} to ${endIndex} of ${totalEntries} entries`;
    
    document.getElementById('prevBtn').disabled = currentPage <= 1;
    document.getElementById('nextBtn').disabled = currentPage >= totalPages;
    
    const paginationNumbers = document.getElementById('paginationNumbers');
    paginationNumbers.innerHTML = '';
    
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-number ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => changePage(i));
        paginationNumbers.appendChild(pageBtn);
    }
}

// Handle Export Option
function handleExportOption(e) {
    const exportType = e.currentTarget.dataset.type;
    
    closeModal('exportModal');
    showModal('loadingModal');
    
    setTimeout(() => {
        closeModal('loadingModal');
        
        switch (exportType) {
            case 'pdf':
                exportToPDF();
                break;
            case 'excel':
                exportToExcel();
                break;
            case 'csv':
                exportToCSV();
                break;
        }
        
        showNotification(`Report exported as ${exportType.toUpperCase()} successfully!`, 'success');
    }, 2000);
}

// Export Functions
function exportToPDF() {
	const fromDate = $('#fromDate').val();
	const toDate = $('#toDate').val();
	const contextPath = window.contextPath || '';
	const url = `${contextPath}/ReportServlet?action=exportPdf&reportType=${currentReportType}&fromDate=${fromDate}&toDate=${toDate}`;
	window.location.href = url; // Redirects browser to download the file
}

function exportToExcel() {
	const fromDate = $('#fromDate').val();
	    const toDate = $('#toDate').val();
	    const contextPath = window.contextPath || '';
	    const url = `${contextPath}/ReportServlet?action=exportExcel&reportType=${currentReportType}&fromDate=${fromDate}&toDate=${toDate}`;
	    window.location.href = url; // Redirects browser to download the file
}

// Exports filtered data to a CSV file
function exportToCSV() {
    let headers, dataMapper;
    
    switch (currentReportType) {
        case 'sales':
            headers = ['Date', 'Invoice ID', 'Customer', 'Items', 'Amount', 'Payment Method', 'Status'];
            dataMapper = item => [
                formatDate(item.date),
                item.invoiceId,
                `"${item.fullName || 'N/A'}"`,
                item.items || 'N/A',
                item.total,
                item.method,
                item.status || 'Completed'
            ];
            break;
        case 'products':
            headers = ['Product ID', 'Product Name', 'Category', 'Sold Qty', 'Revenue', 'Profit', 'Stock'];
            dataMapper = item => [
                item.bookId,
                `"${item.bookName}"`,
                item.categoryId,
                item.sold_qty || 0,
                ((item.sold_qty || 0) * item.price).toFixed(2),
                ((item.sold_qty || 0) * item.price * 0.2).toFixed(2),
                item.stock
            ];
            break;
        case 'customers':
            headers = ['Customer ID', 'Name', 'Email', 'Total Orders', 'Total Spent', 'Last Order', 'Status'];
            dataMapper = item => [
                item.userId,
                `"${item.fullName}"`,
                item.email,
                item.total_orders || 0,
                (item.total_spent || 0).toFixed(2),
                formatDate(item.date),
                item.status || 'Active'
            ];
            break;
        case 'inventory':
            headers = ['Product ID', 'Product Name', 'Current Stock', 'Min Stock', 'Max Stock', 'Reorder Level', 'Status'];
            dataMapper = item => [
                item.bookId,
                `"${item.bookName}"`,
                item.stock,
                Math.floor(item.stock * 0.2),
                Math.floor(item.stock * 2),
                Math.floor(item.stock * 0.3),
                item.stock > 10 ? 'Active' : 'Low'
            ];
            break;
    }
    
    let csvContent = headers.join(',') + '\n';
    filteredData.forEach(item => {
        csvContent += dataMapper(item).join(',') + '\n';
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentReportType}_report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Utility Functions
function formatDate(date) {
    if (!date) return 'N/A';
    if (typeof date === 'string') {
        date = new Date(date);
    }
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-GB');
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.innerHTML = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 20px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 10px;
                animation: slideInRight 0.3s ease;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            .notification-success { background: linear-gradient(135deg, #27ae60, #2ecc71); }
            .notification-error { background: linear-gradient(135deg, #e74c3c, #c0392b); }
            .notification-info { background: linear-gradient(135deg, #3498db, #2980b9); }
            .notification button {
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initReportsManagement();
});