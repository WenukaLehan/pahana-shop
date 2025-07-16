<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<style>
    /* Using the same color scheme as dashboard */
    :root {
        --primary-color: rgba(31, 5, 2, 1);
        --secondary-color: rgba(133, 72, 7, 1);
        --accent-color: rgba(139, 69, 19, 0.6);
        --background-gradient: linear-gradient(270deg, rgba(133, 72, 7, 1) 0%, rgba(31, 5, 2, 1) 73%);
        --glass-background: rgba(255, 255, 255, 0.31);
        --glass-border: rgba(139, 69, 19, 0.3);
        --tooltip-background: rgba(45, 27, 15, 0.95);
        --text-primary: white;
        --text-secondary: rgba(255, 255, 255, 0.8);
        --text-muted: rgba(255, 255, 255, 0.7);
        --transition-speed: 0.3s;
        --hover-transform: translateY(-5px);
        --border-radius: 10px;
        --large-border-radius: 25px;
    }

    .users-container {
        padding:10px;
        background: var(--background-gradient);
        min-height: 100vh;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: var(--text-primary);
        border-radius: 15px;
    }

    .users-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        flex-wrap: wrap;
        gap: 20px;
    }

    .search-container {
        display: flex;
        gap: 10px;
        align-items: center;
        flex: 1;
        max-width: 400px;
    }

    .search-input {
        flex: 1;
        padding: 12px 15px;
        border: none;
        border-radius: var(--large-border-radius);
        background: var(--glass-background);
        color: var(--text-primary);
        font-size: 14px;
        backdrop-filter: blur(20px);
        border: 1px solid var(--glass-border);
        transition: all var(--transition-speed) ease;
    }

    .search-input::placeholder {
        color: var(--text-muted);
    }

    .search-input:focus {
        outline: none;
        background: rgba(255, 255, 255, 0.4);
        box-shadow: 0 8px 32px rgba(139, 69, 19, 0.3);
    }

    .btn {
        padding: 12px 25px;
        border: none;
        border-radius: var(--large-border-radius);
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        transition: all var(--transition-speed) ease;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        position: relative;
        overflow: hidden;
    }

    .btn-primary {
        background: linear-gradient(45deg, var(--secondary-color), var(--primary-color));
        color: var(--text-primary);
        box-shadow: 0 8px 32px rgba(133, 72, 7, 0.3);
    }

    .btn-primary:hover {
        transform: var(--hover-transform);
        box-shadow: 0 12px 40px rgba(133, 72, 7, 0.4);
    }

    .btn-search {
        background: var(--glass-background);
        color: var(--text-primary);
        backdrop-filter: blur(20px);
        border: 1px solid var(--glass-border);
    }

    .btn-search:hover {
        background: rgba(255, 255, 255, 0.4);
        transform: var(--hover-transform);
    }

    .users-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 25px;
        margin-top: 20px;
    }

    .user-card {
        background: var(--glass-background);
        border-radius: var(--large-border-radius);
        padding: 25px;
        backdrop-filter: blur(20px);
        border: 1px solid var(--glass-border);
        transition: all var(--transition-speed) ease;
        position: relative;
        overflow: hidden;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    }

    .user-card::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(139, 69, 19, 0.1) 0%, transparent 70%);
        z-index: -1;
        animation: float 6s ease-in-out infinite;
    }

    @keyframes float {
        0%, 100% { 
            transform: translate(0, 0) rotate(0deg); 
        }
        50% { 
            transform: translate(-20px, -20px) rotate(180deg); 
        }
    }

    .user-card:hover {
        transform: var(--hover-transform);
        box-shadow: 0 12px 40px rgba(139, 69, 19, 0.3);
        background: rgba(255, 255, 255, 0.4);
    }

    .user-avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        object-fit: cover;
        margin: 0 auto 15px;
        display: block;
        border: 3px solid var(--glass-border);
        transition: all var(--transition-speed) ease;
    }

    .user-card:hover .user-avatar {
        transform: scale(1.1);
        border-color: var(--secondary-color);
    }

    .user-name {
        font-size: 18px;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 8px;
        text-align: center;
    }

    .user-email {
        color: var(--text-secondary);
        font-size: 14px;
        margin-bottom: 5px;
        text-align: center;
    }

    .user-role {
        color: var(--secondary-color);
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 15px;
        text-align: center;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .user-status {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 500;
        margin-bottom: 15px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .status-active {
        background: rgba(139, 69, 19, 0.3);
        color: var(--secondary-color);
        border: 1px solid var(--glass-border);
    }

    .status-inactive {
        background: rgba(31, 5, 2, 0.3);
        color: var(--primary-color);
        border: 1px solid var(--glass-border);
    }

    .user-actions {
        display: flex;
        gap: 10px;
        justify-content: space-between;
    }

    .btn-small {
        padding: 8px 15px;
        font-size: 12px;
        border-radius: 20px;
        border: none;
        cursor: pointer;
        transition: all var(--transition-speed) ease;
        flex: 1;
        backdrop-filter: blur(10px);
    }

    .btn-view {
        background: var(--glass-background);
        color: var(--text-primary);
        border: 1px solid var(--glass-border);
    }

    .btn-edit {
        background: linear-gradient(45deg, var(--secondary-color), rgba(133, 72, 7, 0.8));
        color: var(--text-primary);
    }

    .btn-delete {
        background: linear-gradient(45deg, var(--primary-color), rgba(31, 5, 2, 0.8));
        color: var(--text-primary);
    }

    .btn-small:hover {
        transform: var(--hover-transform);
        box-shadow: 0 4px 15px rgba(139, 69, 19, 0.3);
    }

    /* Modal Styles */
    .modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 1000;
        backdrop-filter: blur(10px);
    }

    .modal-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--glass-background);
        backdrop-filter: blur(20px);
        border: 1px solid var(--glass-border);
        padding: 30px;
        border-radius: var(--large-border-radius);
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }

    .modal-title {
        color: var(--text-primary);
        font-size: 20px;
        font-weight: 600;
    }

    .close-btn {
        background: none;
        border: none;
        color: var(--text-primary);
        font-size: 24px;
        cursor: pointer;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all var(--transition-speed) ease;
    }

    .close-btn:hover {
        background: rgba(139, 69, 19, 0.3);
        transform: scale(1.1);
    }

    .form-group {
        margin-bottom: 20px;
    }

    .form-label {
        display: block;
        color: var(--text-primary);
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 8px;
    }

    .form-input {
        width: 100%;
        padding: 12px 15px;
        border: none;
        border-radius: var(--border-radius);
        background: rgba(255, 255, 255, 0.2);
        color: var(--text-primary);
        font-size: 14px;
        backdrop-filter: blur(10px);
        transition: all var(--transition-speed) ease;
        box-sizing: border-box;
        border: 1px solid var(--glass-border);
    }

    .form-input::placeholder {
        color: var(--text-muted);
    }

    .form-input:focus {
        outline: none;
        background: rgba(255, 255, 255, 0.3);
        box-shadow: 0 0 20px rgba(139, 69, 19, 0.2);
    }

    .form-select {
        width: 100%;
        padding: 12px 15px;
        border: none;
        border-radius: var(--border-radius);
        background: rgba(255, 255, 255, 0.2);
        color: var(--text-primary);
        font-size: 14px;
        backdrop-filter: blur(10px);
        transition: all var(--transition-speed) ease;
        box-sizing: border-box;
        border: 1px solid var(--glass-border);
    }

    .form-select:focus {
        outline: none;
        background: rgba(255, 255, 255, 0.3);
        box-shadow: 0 0 20px rgba(139, 69, 19, 0.2);
    }

    .form-select option {
        background: var(--primary-color);
        color: var(--text-primary);
    }

    .modal-actions {
        display: flex;
        gap: 15px;
        justify-content: flex-end;
        margin-top: 25px;
    }

    .btn-cancel {
        background: var(--glass-background);
        color: var(--text-primary);
        border: 1px solid var(--glass-border);
    }

    .btn-cancel:hover {
        background: rgba(255, 255, 255, 0.4);
        transform: var(--hover-transform);
    }

    /* Confirm Delete Modal */
    .confirm-modal {
        text-align: center;
    }

    .confirm-icon {
        font-size: 48px;
        color: var(--primary-color);
        margin-bottom: 20px;
        filter: drop-shadow(0 0 10px rgba(31, 5, 2, 0.5));
    }

    .confirm-message {
        color: var(--text-primary);
        font-size: 16px;
        margin-bottom: 25px;
    }

    .confirm-actions {
        display: flex;
        gap: 15px;
        justify-content: center;
    }

    /* Animation */
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translate(-50%, -60%);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%);
        }
    }

    .modal.show .modal-content {
        animation: fadeIn var(--transition-speed) ease;
    }

    @keyframes deleteAnimation {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        50% {
            transform: scale(1.1);
            opacity: 0.5;
        }
        100% {
            transform: scale(0);
            opacity: 0;
        }
    }

    .user-card.deleting {
        animation: deleteAnimation 0.5s ease forwards;
    }

    /* User details in view modal */
    .user-detail-section {
        margin-bottom: 20px;
    }

    .user-detail-avatar {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        object-fit: cover;
        margin: 0 auto 20px;
        display: block;
        border: 4px solid var(--glass-border);
    }

    .user-detail-name {
        font-size: 24px;
        font-weight: 600;
        color: var(--text-primary);
        text-align: center;
        margin-bottom: 10px;
    }

    .user-detail-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1px solid var(--glass-border);
    }

    .user-detail-label {
        color: var(--text-secondary);
        font-size: 14px;
        font-weight: 500;
    }

    .user-detail-value {
        color: var(--text-primary);
        font-size: 14px;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
        .users-container {
            padding: 15px;
        }

        .users-header {
            flex-direction: column;
            align-items: stretch;
        }

        .search-container {
            max-width: 100%;
            margin-bottom: 10px;
        }

        .users-grid {
            grid-template-columns: 1fr;
            gap: 20px;
        }

        .user-card {
            padding: 20px;
        }

        .modal-content {
            width: 95%;
            padding: 20px;
        }
    }

    @media (max-width: 480px) {
        .user-card {
            padding: 15px;
        }

        .modal-content {
            padding: 15px;
        }

        .users-grid {
            gap: 15px;
        }

        .user-actions {
            flex-direction: column;
            gap: 8px;
        }

        .btn-small {
            padding: 10px 15px;
            font-size: 13px;
        }
    }

    /* Loading States */
    .loading {
        opacity: 0.5;
        pointer-events: none;
    }

    /* Focus States for Accessibility */
    .btn:focus,
    .search-input:focus,
    .form-input:focus,
    .form-select:focus {
        outline: 2px solid var(--secondary-color);
        outline-offset: 2px;
    }
</style>

<div class="users-container">
    <div class="users-header">
        <div class="search-container">
            <input type="text" class="search-input" placeholder="Search users..." id="searchInput">
            <button class="btn btn-search" onclick="searchUsers()">Search</button>
        </div>
        <button class="btn btn-primary" onclick="openAddUserModal()">Add New User</button>
    </div>

    <div class="users-grid" id="usersGrid">
        <!-- Users will be populated here -->
    </div>
</div>

<!-- Add/Edit User Modal -->
<div class="modal" id="userModal">
    <div class="modal-content">
        <div class="modal-header">
            <h3 class="modal-title" id="modalTitle">Add New User</h3>
            <button class="close-btn" onclick="closeModal('userModal')">&times;</button>
        </div>
        <form id="userForm">
            <div class="form-group">
                <label class="form-label">Full Name</label>
                <input type="text" class="form-input" id="userName" placeholder="Enter full name" required>
            </div>
            <div class="form-group">
                <label class="form-label">Email</label>
                <input type="email" class="form-input" id="userEmail" placeholder="Enter email address" required>
            </div>
            <div class="form-group">
                <label class="form-label">Phone</label>
                <input type="tel" class="form-input" id="userPhone" placeholder="Enter phone number" required>
            </div>
            <div class="form-group">
                <label class="form-label">Role</label>
                <select class="form-select" id="userRole" required>
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Status</label>
                <select class="form-select" id="userStatus" required>
                    <option value="">Select Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Avatar URL</label>
                <input type="url" class="form-input" id="userAvatar" placeholder="Enter avatar URL">
            </div>
            <div class="modal-actions">
                <button type="button" class="btn btn-cancel" onclick="closeModal('userModal')">Cancel</button>
                <button type="submit" class="btn btn-primary" id="submitBtn">Add User</button>
            </div>
        </form>
    </div>
</div>

<!-- View User Modal -->
<div class="modal" id="viewModal">
    <div class="modal-content">
        <div class="modal-header">
            <h3 class="modal-title">User Details</h3>
            <button class="close-btn" onclick="closeModal('viewModal')">&times;</button>
        </div>
        <div id="userDetails">
            <!-- User details will be populated here -->
        </div>
    </div>
</div>

<!-- Confirm Delete Modal -->
<div class="modal" id="confirmModal">
    <div class="modal-content confirm-modal">
        <div class="confirm-icon">⚠️</div>
        <div class="confirm-message">Are you sure you want to delete this user?</div>
        <div class="confirm-actions">
            <button class="btn btn-cancel" onclick="closeModal('confirmModal')">Cancel</button>
            <button class="btn btn-delete" onclick="confirmDelete()">Delete</button>
        </div>
    </div>
</div>

<script>

document.addEventListener("DOMContentLoaded", function () {
    if (typeof initUserManagement === "function") {
        initUserManagement();
    } else {
        const script = document.createElement('script');
        script.src = '../js/users.js';
        script.onload = () => {
            if (typeof initUserManagement === "function") {
                initUserManagement();
            }
        };
        document.body.appendChild(script);
    }
});

</script>