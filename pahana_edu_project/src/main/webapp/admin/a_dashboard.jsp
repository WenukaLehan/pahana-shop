<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="../images/icont.png" type="image/x-icon">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
    <title>Dashboard UI</title>
    <link rel="stylesheet" href="../css/a_dashboard.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="../js/a_dashboard.js" defer></script>
    <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
    <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
</head>
<body>
    <div class="navigation">
        <ul>
            <li class="list active" data-page="users">
                <a href="#">
                    <span class="icon"><ion-icon name="people-outline"></ion-icon></span>
                    <span class="text">Users</span>
                    <span class="tooltip">User Management</span>
                </a>
            </li>
            <li class="list" data-page="books">
                <a href="#">
                    <span class="icon"><ion-icon name="book-outline"></ion-icon></span>
                    <span class="text">Books</span>
                    <span class="tooltip">Book Management</span>
                </a>
            </li>
            <li class="list" data-page="cart">
                <a href="#">
                    <span class="icon"><ion-icon name="cart-outline"></ion-icon></span>
                    <span class="text">Cart</span>
                    <span class="tooltip">Shopping Cart</span>
                </a>
            </li>
            <li class="list" data-page="reports">
                <a href="#">
                    <span class="icon"><ion-icon name="reader-outline"></ion-icon></span>
                    <span class="text">Reports</span>
                    <span class="tooltip">View Reports</span>
                </a>
            </li>
            <li class="list" data-page="settings">
                <a href="#">
                    <span class="icon"><ion-icon name="settings-outline"></ion-icon></span>
                    <span class="text">Settings</span>
                    <span class="tooltip">System Settings</span>
                </a>
            </li>
            <div class="indicator"></div>
        </ul>
    </div>

    <div class="main-content">
        <div class="header">
            <div></div>
            <div class="panel-title" id="pageTitle">User Management</div>
            <div class="user1-avatar">
                <svg viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                <div class="user-profile-container" id="userProfileContainer">
                    <div class="user-profile-content">
                        <div class="user-profile-icon">
                            <svg viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                        </div>
                        <div class="user-profile-name" id="userName">John Doe</div>
                        <div class="user-profile-email" id="userEmail">john.doe@example.com</div>
                        <button class="user-profile-logout" onclick="openLogoutConfirmModal()">Logout</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="content-panel" id="contentPanel">
            <div class="panel-content" id="pageContent">
                <jsp:include page="users.jsp" />
            </div>
        </div>
    </div>

    <div class="modal" id="logoutConfirmModal">
        <div class="modal-content confirm-modal">
            <div class="modal-header">
                <h3 class="modal-title">Confirm Logout</h3>
                <button class="close-btn" onclick="closeModal('logoutConfirmModal')">×</button>
            </div>
            <div class="confirm-icon">⚠️</div>
            <div class="confirm-message">Are you sure you want to log out?</div>
            <div class="confirm-actions">
                <button class="btn btn-cancel" onclick="closeModal('logoutConfirmModal')">Cancel</button>
                <button class="btn btn-delete" onclick="confirmLogout()">Logout</button>
            </div>
        </div>
    </div>
</body>
</html>