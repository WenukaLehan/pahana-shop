<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<link rel="stylesheet" href="../css/settings.css">
<script src="../js/settings.js"></script>

<div class="settings-container">
    <div class="settings-header">
        <h2>System Settings</h2>
    </div>

    <!-- Profile Settings Section -->
    <div class="settings-section">
        <div class="section-header">
            <h3>Profile Settings</h3>
        </div>
        <div class="profile-form">
            <div class="form-row">
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" class="form-input" id="fullName" placeholder="Enter full name">
                </div>
                <div class="form-group">
                    <label>Email Address</label>
                    <input type="email" class="form-input" id="email" placeholder="Enter email address">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Phone Number</label>
                    <input type="tel" class="form-input" id="phone" placeholder="Enter phone number">
                </div>
                <div class="form-group">
                    <label>Username</label>
                    <input type="text" class="form-input" id="username" placeholder="Enter username">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Profile Image</label>
                    <input type="file" class="form-input" id="profilePicture" accept="image/png, image/jpeg">
                </div>
                <div class="form-group">
                	<img id="profileImagePreview" alt="Profile Image Preview" style="display:none; max-height: 150px; margin-top: 10px; max-width: 70px;"  class="profile-image-preview">
                    <span class="image-upload-text">Upload Profile Image</span>
                </div>
            </div>
            <div class="form-actions">
                <button class="action-btn save" id="saveProfileBtn">
                    <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
                        <path d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
                    </svg>
                    Save Changes
                </button>
                <button class="action-btn cancel" id="cancelProfileBtn">
                    <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
                        <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
                    </svg>
                    Cancel
                </button>
            </div>
        </div>
    </div>

    <!-- Employee Management Section -->
    <div class="settings-section">
        <div class="section-header">
            <h3>Employee Management</h3>
        </div>
        <!-- Add New Employee -->
        <div class="employee-form">
            <div class="form-row">
                <div class="form-group">
                    <label>Employee Name</label>
                    <input type="text" class="form-input" id="employeeName" placeholder="Enter employee name">
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" class="form-input" id="employeeEmail" placeholder="Enter employee email">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Role</label>
                    <select class="form-select" id="employeeRole">
                        <option value="2">Cashier</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Phone</label>
                    <input type="tel" class="form-input" id="employeePhone" placeholder="Enter phone number">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Profile Image</label>
                    <input type="file" class="form-input" id="employeeProfilePicture" accept="image/png, image/jpeg">
                </div>
                <div class="form-group">
                    <label>Username</label>
                    <input type="text" class="form-input" id="employeeUsername" placeholder="Enter username">
                </div>
            </div>
            <div class="form-row">
                 <div class="form-group">
                	<img id="employeeProfileImagePreview" style="display:none; max-height: 150px;max-width: 70px; margin-top: 10px;"  alt="Profile Image Preview" class="profile-image-preview">
                    <span class="image-upload-text">Upload Profile Image</span>
                </div>
            </div>
            <div class="form-actions">
                <button class="action-btn add" id="addEmployeeBtn">
                    <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
                        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                    </svg>
                    Add Employee
                </button>
            </div>
        </div>
        <!-- Employee Table -->
        <div class="employee-table-section">
            <div class="table-header">
                <h3>Employee List</h3>
                <div class="table-controls">
                    <input type="text" placeholder="Search employees..." class="search-input" id="employeeSearch">
                </div>
            </div>
            <div class="employee-table">
                <table id="employeeTable">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="employeeTableBody">
                        <tr class="empty-row">
                            <td colspan="6" style="text-align: center; color: #666; padding: 40px;">
                                No employees available. Add a new employee above.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="table-footer">
                <div class="pagination-info">
                    <span id="employeePaginationInfo">Showing 0 to 0 of 0 entries</span>
                </div>
                <div class="pagination-controls">
                    <button class="pagination-btn" id="employeePrevBtn" disabled>Previous</button>
                    <div class="pagination-numbers" id="employeePaginationNumbers"></div>
                    <button class="pagination-btn" id="employeeNextBtn" disabled>Next</button>
                </div>
            </div>
        </div>
    </div>

    <!-- System Settings Section -->
    <div class="settings-section">
        <div class="section-header">
            <h3>System Preferences</h3>
        </div>
        <div class="system-settings">
            <div class="setting-item">
                <label class="setting-label">Low Stock Alerts</label>
                <label class="switch">
                    <input type="checkbox" id="lowStockAlert" checked>
                    <span class="slider round"></span>
                </label>
            </div>
            <div class="setting-item">
                <label class="setting-label">Email Notifications</label>
                <label class="switch">
                    <input type="checkbox" id="emailNotifications" checked>
                    <span class="slider round"></span>
                </label>
            </div>
            <div class="setting-item">
                <label class="setting-label">Automatic Backups</label>
                <label class="switch">
                    <input type="checkbox" id="autoBackups" checked>
                    <span class="slider round"></span>
                </label>
            </div>
            <div class="form-actions">
                <button class="action-btn save" id="saveSystemSettingsBtn">
                    <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
                        <path d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
                    </svg>
                    Save Settings
                </button>
            </div>
        </div>
    </div>

    <!-- Loading Modal -->
    <div class="modal" id="loadingModal">
        <div class="modal-content loading-content">
            <div class="loading-spinner"></div>
            <h3>Saving Changes...</h3>
            <p>Please wait while we process your request.</p>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Initialize settings functionality
    initSettingsManagement();
});
</script>