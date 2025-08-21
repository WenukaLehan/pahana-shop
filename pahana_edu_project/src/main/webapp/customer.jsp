<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="./images/icont.png" type="image/x-icon">
    <title>Pahana EDU | Dashboard</title>
      <script>
	    window.contextPath = '<%= request.getContextPath() %>';
	</script>
    <!-- Bootstrap CSS -->
     <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome for icons -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <!-- Google Fonts - Creepster for title, Poppins for general text -->
    <link href="https://fonts.googleapis.com/css2?family=Creepster&family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="css/customer.css">
</head>
<body>
    <!-- Dashboard Header -->
    <header class="dashboard-header">
        <div class="container">
            <nav class="navbar navbar-expand-lg">
                <a class="navbar-brand" href="#">
                    <i class="fas fa-book-open me-2"></i>Pahana Edu Dashboard
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#dashboardNavbar" aria-controls="dashboardNavbar" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="dashboardNavbar">
                    <ul class="navbar-nav ms-auto">
                        
                        <li class="nav-item">
                            <button class="btn logout-btn" onclick="handleLogout()">
                                <i class="fas fa-sign-out-alt me-2"></i>Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    </header>

    <!-- Main Content -->
    <main class="dashboard-container">
        <div class="container">
            <div class="row">
                <!-- Sidebar Navigation -->
                <div class="col-lg-3">
                    <div class="sidebar">
                        <ul class="nav flex-column nav-pills">
                            <li class="nav-item">
                                <a class="nav-link active" id="profile-tab" data-bs-toggle="pill" href="#profileSettings" role="tab" aria-controls="profileSettings" aria-selected="true">
                                    <i class="fas fa-user-cog"></i> Profile Settings
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" id="orders-tab" data-bs-toggle="pill" href="#myOrders" role="tab" aria-controls="myOrders" aria-selected="false">
                                    <i class="fas fa-box"></i> My Orders
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- Content Area -->
                <div class="col-lg-9">
                    <div class="content-area tab-content">
                        <!-- Profile Settings Section -->
                        <div class="tab-pane fade show active" id="profileSettings" role="tabpanel" aria-labelledby="profile-tab">
                            <h2 class="section-title">Profile Settings</h2>
                            <form id="profileForm">
                                <div class="mb-3">
                                    <label for="fullName" class="form-label">Full Name</label>
                                    <input type="text" class="form-control" id="fullName" value="John Doe">
                                </div>
                                <div class="mb-3">
                                    <label for="email" class="form-label">Email Address</label>
                                    <input type="email" class="form-control" id="email" value="john.doe@example.com">
                                </div>
                                <div class="mb-3">
                                    <label for="phone" class="form-label">Phone Number</label>
                                    <input type="tel" class="form-control" id="phone" value="+1 (555) 123-4567">
                                </div>
                                <div class="mb-3">
                                    <label for="address" class="form-label">Shipping Address</label>
                                    <textarea class="form-control" id="address" rows="3">123 Learning Lane, Apt 4B, Knowledge City, LC 12345</textarea>
                                </div>
                                <div class="mb-3">
                                     <label class="form-label">Select profile image</label>
                					 <input type="file" class="form-control" name="image" id="userAvatar" accept="image/png" required>
                                </div>
                                <div class="form-group">
					                <img id="avatarPreview" src="" alt="Avatar Preview" style="display:none; max-height: 150px; margin-top: 10px;" />
					            </div>
                                <div class="text-center">
                                    <button type="submit" class="btn btn-primary-theme">Save Changes</button>
                                </div>
                            </form>
                        </div>

                        <!-- My Orders Section -->
                        <div class="tab-pane fade" id="myOrders" role="tabpanel" aria-labelledby="orders-tab">
                            <h2 class="section-title">My Orders</h2>
                            <div class="table-responsive">
                                <table class="table table-hover align-middle">
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Date</th>
                                            <th>Total</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody id="ordersTableBody">
                                        <!-- Orders will be loaded dynamically here -->
                                        <tr>
                                            <td colspan="6" class="text-center">
                                                <div class="loading-spinner"></div>
                                                <p>Loading your orders...</p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="text-center mt-4">
                                <button class="btn btn-primary-theme" id="loadMoreOrders">
                                    <i class="fas fa-plus me-2"></i>Load More Orders
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 Pahana Edu Book Shop. All rights reserved. | Powered by Knowledge</p>
        </div>
    </footer>

    <!-- Order Details Modal -->
    <div class="modal fade" id="orderDetailsModal" tabindex="-1" aria-labelledby="orderDetailsModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="orderDetailsModalLabel">Order Details</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p><strong>Order ID:</strong> <span id="modalOrderId"></span></p>
                    <p><strong>Date:</strong> <span id="modalOrderDate"></span></p>
                    <p><strong>Total:</strong> <span id="modalOrderTotal"></span></p>
                    <p><strong>Status:</strong> <span id="modalOrderStatus"></span></p>
                    <hr>
                    <p class="text-muted">Further details about this order, such as shipping tracking or detailed item list, would appear here.</p>
                </div>
                <div class="modal-footer justify-content-center">
                    <button type="button" class="btn btn-warning rounded-pill px-4" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS Bundle with Popper -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
    <script>
    
    let ordersData = []; 
    
    // Function to fetch orders data (simulated)
    function fetchOrdersData() {
        
    	try{
    		
    		$.post(window.contextPath + '/OrderServlet', { action: 'getAllOrders'  }, (response) => {
    		    if (response.success) {
    		        ordersData = response.orders || [];
    		    } else {
    		        console.error('Failed to fetch orders:', response.message);
    		    }
    		}).fail(() => {
    		    console.error('Error fetching orders data');
    		});
    	
    	} catch (error) {
    		console.error("Error fetching orders data:", error);
    	}
    	
    }
    
    // Function to fetch customer data (simulated)
    function fetchCustomers() {
        try {
            $.post('CustomerServlet', { action: 'getCustomer' }, (response) => {
                if (response) {
                    const customer = response;
                    console.log("Customer data fetched:", customer); // Debugging line
                    document.getElementById('fullName').value = customer.name || '';
                    document.getElementById('email').value = customer.email || '';
                    document.getElementById('phone').value = customer.phone || '';
                    document.getElementById('address').value = customer.address || '';
                    const avatarPreview = document.getElementById('avatarPreview');
                    avatarPreview.src = 'GetProImage?id='+customer.u_id || '';
                    avatarPreview.style.display = 'block';
                } else {
                    console.error('Failed to fetch customer details:', response.message);
                }
            }).fail(() => {
                console.error('Error fetching customer data');
            });
        } catch (error) {
            console.error("Error fetching customer data:", error);
        }
    }
    
    // Function to update profile
    function updateProfile() {
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const avatarFile = document.getElementById('userAvatar').files[0];

        if (!fullName || !email || !phone || !address) {
            showNotification('error', 'Please fill in all fields.', 4000);
            return;
        }

        const formData = new FormData();
        formData.append('name', fullName);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('address', address);
        formData.append('action', 'updateCustomerUser');
        if (avatarFile) {
            formData.append('image', avatarFile);
        }

        $.ajax({
            url: 'CustomerServlet',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.success) {
                    console.log('success'+'Profile updated successfully!', 4000);
                } else {
                	console.log('error'+ response.message, 4000);
                }
            },
            error: function() {
            	console.log('error Failed to update profile. Please try again.', 4000);
            }
        });
    }
    
document.addEventListener('DOMContentLoaded', function() {

	//console.log("✅ ordersData loaded:", ordersData); // Will show full array

    let currentOrderIndex = 0;
    const ordersPerLoad = 4;
    let isLoading = false;
    
    fetchCustomers();
    
    fetchOrdersData();

    // Dynamic order loading function
    function loadOrders(startIndex = 0, count = ordersPerLoad) {
        const container = document.getElementById('ordersTableBody');
        const loadMoreBtn = document.getElementById('loadMoreOrders');

        if (startIndex === 0) {
            container.innerHTML = ''; // Remove loading row
        }

        const endIndex = Math.min(startIndex + count, ordersData.length);
        //console.log("✅ ordersData loaded:", ordersData); // Will show full array
        for (let i = startIndex; i < endIndex; i++) {
            const order = ordersData[i];
            console.log("✅ ordersData loaded:", ordersData[i]); // Will show full array
            console.log("order is", order); // Will show individual order object
            const orderRow = createOrderRow(order);
            container.appendChild(orderRow);
            setTimeout(() => {
                orderRow.style.opacity = '1';
                orderRow.style.transform = 'translateY(0)';
            }, (i - startIndex) * 200);
        }

        currentOrderIndex = endIndex;

        if (currentOrderIndex >= ordersData.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }
    
    

    // Create individual order row
    function createOrderRow(order) {
        const row = document.createElement('tr');
        row.style.opacity = '0';
        row.style.transform = 'translateY(20px)';
        row.style.transition = 'all 0.4s ease';
        
        console.log("ordrs", order); // Will show individual order object

        row.innerHTML = `
            <td>\${order.orderId}</td>
            <td>\${order.orderDate}</td>
            <td>Rs: \${order.totalAmount}</td>
            <td><span class="status-pending status-badge">\${order.method}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-warning view-details-btn"
                    data-order-id="\${order.orderId}"
                    data-order-date="\${order.orderDate}"
                    data-order-total="Rs: \${order.totalAmount}"
                    data-order-status="\${order.method}">
                    View Details
                </button>
            </td>
        `;


        return row;
    }

    // Logout handler
    document.querySelector('.logout-btn').addEventListener('click', function () {
        this.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Logging out...';
        this.disabled = true;
        setTimeout(() => {
        	$.post(window.contextPath + '/user', { action: 'logout' }, (response) => {
    		    if (response.success) {
    		        window.location.href = window.contextPath + '/Login.jsp';
    		    } else {
    		        alert('Logout failed. Please try again.');
    		        console.error('Logout error:', response.message);
    		    }
    		}).fail(() => {
    		    alert('Logout failed. Please try again.');
    		});
        }, 1000);
    });

    // Load More Orders
    document.getElementById('loadMoreOrders').addEventListener('click', function () {
        if (isLoading) return;
        isLoading = true;
        this.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Loading...';
        setTimeout(() => {
            loadOrders(currentOrderIndex, ordersPerLoad);
            this.innerHTML = '<i class="fas fa-plus me-2"></i>Load More Orders';
            isLoading = false;
        }, 1500);
    });
    
    document.getElementById('userAvatar').addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            if (file.type === 'image/png' || file.type === 'image/jpeg') { // Allow PNG and JPEG
                const reader = new FileReader();
                reader.onload = function (e) {
                    const preview = document.getElementById('avatarPreview');
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            } else {
                showNotification('error', "Please select a PNG or JPEG image.", 4000);
                this.value = ''; // reset file input
                document.getElementById('avatarPreview').style.display = 'none';
            }
        } else {
            document.getElementById('avatarPreview').style.display = 'none';
            document.getElementById('avatarPreview').src = '';
        }
    });

    // Profile Save
    document.getElementById('profileForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Saving...';
        submitBtn.disabled = true;
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            updateProfile();
            form.style.background = 'rgba(40, 167, 69, 0.1)';
            setTimeout(() => {
                form.style.background = 'var(--card-bg)';
            }, 3000);
        }, 2000);
    });

    // View Order Details Modal
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('view-details-btn')) {
            const button = e.target;
            document.getElementById('modalOrderId').textContent = button.dataset.orderId;
            document.getElementById('modalOrderDate').textContent = button.dataset.orderDate;
            document.getElementById('modalOrderItems').textContent = button.dataset.orderItems;
            document.getElementById('modalOrderTotal').textContent = button.dataset.orderTotal;
            document.getElementById('modalOrderStatus').textContent = button.dataset.orderStatus;

            const modal = new bootstrap.Modal(document.getElementById('orderDetailsModal'));
            modal.show();
        }
    });

    // Animate buttons
    document.querySelectorAll('.btn-primary-theme, .logout-btn').forEach(button => {
        button.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-5px) scale(1.05)';
        });
        button.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Animate all buttons on click
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function () {
            if (!this.classList.contains('btn-close') && !this.hasAttribute('data-bs-dismiss') && !this.classList.contains('view-details-btn')) {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            }
        });
    });

    // Animate sidebar entrance
    setTimeout(() => {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.style.transform = 'translateX(0)';
            sidebar.style.opacity = '1';
        }
    }, 500);

    // Initial load
    setTimeout(() => {
        loadOrders(0, ordersPerLoad);
    }, 1000);

    console.log('📚 Pahana Edu Customer Dashboard Loaded Successfully!');
});
</script>

</body>
</html>