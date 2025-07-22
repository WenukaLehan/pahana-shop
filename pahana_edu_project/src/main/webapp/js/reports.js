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
    
    // Initialize event listeners
    initEventListeners();
    
    // Load default data
    loadSampleData();
    
    // Initialize chart
    initSalesChart();
    
    // Set default date range
    setDefaultDateRange();
    
    console.log('Reports Management System initialized successfully!');
}

// Initialize Event Listeners
function initEventListeners() {
    // Report type change
    document.getElementById('reportType').addEventListener('change', handleReportTypeChange);
    
    // Date range change
    document.getElementById('dateRange').addEventListener('change', handleDateRangeChange);
    
    // Generate report button
    document.getElementById('generateReportBtn').addEventListener('click', generateReport);
    
    // Export report button
    document.getElementById('exportReportBtn').addEventListener('click', () => showModal('exportModal'));
    
    // Search functionality
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    
    // Entries per page change
    document.getElementById('entriesPerPage').addEventListener('change', handleEntriesPerPageChange);
    
    // Pagination
    document.getElementById('prevBtn').addEventListener('click', () => changePage(currentPage - 1));
    document.getElementById('nextBtn').addEventListener('click', () => changePage(currentPage + 1));
    
    // Chart period buttons
    document.querySelectorAll('.chart-btn').forEach(btn => {
        btn.addEventListener('click', handleChartPeriodChange);
    });
    
    // Export options
    document.querySelectorAll('.export-option').forEach(option => {
        option.addEventListener('click', handleExportOption);
    });
}

// Handle Report Type Change
function handleReportTypeChange() {
    currentReportType = document.getElementById('reportType').value;
    updateTableHeaders();
    
    // Auto-generate report if data exists
    if (reportsData.length > 0) {
        generateReport();
    }
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

// Set Default Date Range
function setDefaultDateRange() {
    const today = new Date();
    const fromDate = new Date(today);
    fromDate.setDate(today.getDate() - 30); // Last 30 days
    
    document.getElementById('fromDate').value = fromDate.toISOString().split('T')[0];
    document.getElementById('toDate').value = today.toISOString().split('T')[0];
}

// Set Date Range Values
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

// Generate Report
async function generateReport() {
    showModal('loadingModal');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
        // Filter data based on current settings
        filterDataByDateRange();
        filterDataByReportType();
        
        // Update summary cards
        updateSummaryCards();
        
        // Update chart
        updateChart();
        
        // Update table
        updateReportsTable();
        
        // Close loading modal
        closeModal('loadingModal');
        
        showNotification('Report generated successfully!', 'success');
        
    } catch (error) {
        console.error('Error generating report:', error);
        closeModal('loadingModal');
        showNotification('Error generating report. Please try again.', 'error');
    }
}

// Filter Data by Date Range
function filterDataByDateRange() {
    const fromDate = new Date(document.getElementById('fromDate').value);
    const toDate = new Date(document.getElementById('toDate').value);
    
    filteredData = reportsData.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= fromDate && itemDate <= toDate;
    });
}

// Filter Data by Report Type
function filterDataByReportType() {
    // This would typically filter based on the report type
    // For now, we'll use the same data for all report types
    // In a real application, you'd have different data structures for different reports
}

// Update Summary Cards
function updateSummaryCards() {
    // Calculate totals from filtered data
    const totalSales = filteredData.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    const totalOrders = filteredData.length;
    const uniqueCustomers = new Set(filteredData.map(item => item.customer)).size;
    const totalProfit = totalSales * 0.2; // Assuming 20% profit margin
    
    // Update DOM
    document.getElementById('totalSales').textContent = `Rs: ${totalSales.toFixed(2)}`;
    document.getElementById('totalOrders').textContent = totalOrders;
    document.getElementById('totalCustomers').textContent = uniqueCustomers;
    document.getElementById('totalProfit').textContent = `Rs: ${totalProfit.toFixed(2)}`;
    
    // Update trends (simulated)
    updateTrendIndicators();
}

// Update Trend Indicators
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

// Update Chart
function updateChart() {
    // Generate chart data from filtered data
    const chartData = generateChartData();
    
    if (salesChart) {
        salesChart.data = chartData;
        salesChart.update();
    } else {
        initSalesChart(chartData);
    }
}

// Initialize Sales Chart
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
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'Rs: ' + value;
                        }
                    }
                }
            },
            elements: {
                line: {
                    tension: 0.4
                },
                point: {
                    radius: 5,
                    hoverRadius: 8
                }
            }
        }
    });
}

// Generate Chart Data
function generateChartData() {
    // Generate sample chart data based on current period
    const period = document.querySelector('.chart-btn.active').dataset.period;
    let labels = [];
    let salesData = [];
    let ordersData = [];
    
    switch (period) {
        case 'daily':
            labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            salesData = [12000, 15000, 18000, 14000, 22000, 28000, 25000];
            ordersData = [45, 52, 68, 51, 78, 89, 82];
            break;
        case 'weekly':
            labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            salesData = [85000, 92000, 78000, 105000];
            ordersData = [320, 345, 298, 412];
            break;
        case 'monthly':
            labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
            salesData = [320000, 385000, 295000, 445000, 520000, 478000];
            ordersData = [1250, 1480, 1120, 1680, 1950, 1820];
            break;
    }
    
    return {
        labels: labels,
        datasets: [
            {
                label: 'Sales (Rs)',
                data: salesData,
                borderColor: 'rgb(39, 174, 96)',
                backgroundColor: 'rgba(39, 174, 96, 0.1)',
                fill: true
            },
            {
                label: 'Orders',
                data: ordersData,
                borderColor: 'rgb(52, 152, 219)',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                yAxisID: 'y1'
            }
        ]
    };
}

// Handle Chart Period Change
function handleChartPeriodChange(e) {
    // Update active button
    document.querySelectorAll('.chart-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    // Update chart
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
            headers = ['Product ID', 'Product Name', 'Current Stock', 'Min Stock', 'Max Stock', 'Reorder Level', 'Status'];
            break;
        case 'payment':
            title = 'Payment Report';
            headers = ['Date', 'Invoice ID', 'Customer', 'Amount', 'Method', 'Status', 'Reference'];
            break;
    }
    
    tableTitle.textContent = title;
    tableHead.innerHTML = `<tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr>`;
}

// Update Reports Table
function updateReportsTable() {
    const tableBody = document.getElementById('tableBody');
    
    // Apply search filter
    let displayData = filteredData;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (searchTerm) {
        displayData = displayData.filter(item => 
            Object.values(item).some(value => 
                value.toString().toLowerCase().includes(searchTerm)
            )
        );
    }
    
    // Calculate pagination
    const totalEntries = displayData.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = Math.min(startIndex + entriesPerPage, totalEntries);
    const pageData = displayData.slice(startIndex, endIndex);
    
    // Clear existing rows
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
    
    // Update pagination
    updatePagination(totalEntries, startIndex + 1, endIndex, totalPages);
}

// Create Table Row
function createTableRow(item) {
    const row = document.createElement('tr');
    
    switch (currentReportType) {
        case 'sales':
            row.innerHTML = `
                <td>${formatDate(item.date)}</td>
                <td>${item.invoiceId}</td>
                <td>${item.customer}</td>
                <td>${item.items}</td>
                <td>Rs: ${parseFloat(item.amount).toFixed(2)}</td>
                <td>${item.paymentMethod}</td>
                <td><span class="status-badge status-${item.status.toLowerCase()}">${item.status}</span></td>
            `;
            break;
        case 'products':
            row.innerHTML = `
                <td>${item.productId || 'P' + Math.floor(Math.random() * 1000)}</td>
                <td>${item.product || 'Sample Product'}</td>
                <td>${item.category || 'Electronics'}</td>
                <td>${Math.floor(Math.random() * 100)}</td>
                <td>Rs: ${parseFloat(item.amount).toFixed(2)}</td>
                <td>Rs: ${(parseFloat(item.amount) * 0.2).toFixed(2)}</td>
                <td>${Math.floor(Math.random() * 50)}</td>
            `;
            break;
        case 'customers':
            row.innerHTML = `
                <td>${item.customerId || 'C' + Math.floor(Math.random() * 1000)}</td>
                <td>${item.customer}</td>
                <td>${item.email || item.customer.toLowerCase().replace(' ', '.') + '@email.com'}</td>
                <td>${Math.floor(Math.random() * 20) + 1}</td>
                <td>Rs: ${parseFloat(item.amount).toFixed(2)}</td>
                <td>${formatDate(item.date)}</td>
                <td><span class="status-badge status-${item.status.toLowerCase()}">${item.status}</span></td>
            `;
            break;
        default:
            // Default sales format
            row.innerHTML = `
                <td>${formatDate(item.date)}</td>
                <td>${item.invoiceId}</td>
                <td>${item.customer}</td>
                <td>${item.items}</td>
                <td>Rs: ${parseFloat(item.amount).toFixed(2)}</td>
                <td>${item.paymentMethod}</td>
                <td><span class="status-badge status-${item.status.toLowerCase()}">${item.status}</span></td>
            `;
    }
    
    return row;
}

// Handle Search
function handleSearch() {
    currentPage = 1; // Reset to first page
    updateReportsTable();
}

// Handle Entries Per Page Change
function handleEntriesPerPageChange() {
    entriesPerPage = parseInt(document.getElementById('entriesPerPage').value);
    currentPage = 1; // Reset to first page
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
    // Update pagination info
    document.getElementById('paginationInfo').textContent = 
        `Showing ${startIndex} to ${endIndex} of ${totalEntries} entries`;
    
    // Update pagination buttons
    document.getElementById('prevBtn').disabled = currentPage <= 1;
    document.getElementById('nextBtn').disabled = currentPage >= totalPages;
    
    // Generate page numbers
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
    
    // Simulate export process
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
    // In a real application, you would use a library like jsPDF
    console.log('Exporting to PDF...');
}

function exportToExcel() {
    // In a real application, you would use a library like SheetJS
    console.log('Exporting to Excel...');
}

function exportToCSV() {
    const headers = ['Date', 'Invoice ID', 'Customer', 'Items', 'Amount', 'Payment Method', 'Status'];
    let csvContent = headers.join(',') + '\n';
    
    filteredData.forEach(item => {
        const row = [
            formatDate(item.date),
            item.invoiceId,
            `"${item.customer}"`,
            item.items,
            item.amount,
            item.paymentMethod,
            item.status
        ];
        csvContent += row.join(',') + '\n';
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

// Load Sample Data
function loadSampleData() {
    // Generate sample data for demonstration
    const customers = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown', 'Lisa Davis', 'Tom Anderson', 'Emily Clark'];
    const paymentMethods = ['Cash', 'Card', 'Bank Transfer'];
    const statuses = ['Completed', 'Pending', 'Cancelled'];
    
    reportsData = [];
    
    for (let i = 0; i < 150; i++) {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 90)); // Last 90 days
        
        reportsData.push({
            id: i + 1,
            date: date,
            invoiceId: `INV-${String(i + 1).padStart(4, '0')}`,
            customer: customers[Math.floor(Math.random() * customers.length)],
            items: Math.floor(Math.random() * 10) + 1,
            amount: (Math.random() * 10000 + 500).toFixed(2),
            paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
            status: statuses[Math.floor(Math.random() * statuses.length)]
        });
    }
    
    // Set initial filtered data
    filteredData = [...reportsData];
    
    console.log('Sample data loaded:', reportsData.length, 'records');
}

// Utility Functions
function formatDate(date) {
    if (typeof date === 'string') {
        date = new Date(date);
    }
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
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add styles if not already added
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
                from { transform: translateX(100%); opacity:				0; }
				to { transform: translateX(0); opacity: 1; }
				}
				`;
				document.head.appendChild(styles);
				}

				// Append notification to body
				document.body.appendChild(notification);

				// Auto-remove after 3 seconds
				setTimeout(() => {
				notification.remove();
				}, 3000);
				}

				// Initialize on page load
				document.addEventListener('DOMContentLoaded', function() {
				// Initialize reports functionality
				initReportsManagement();
				});
				