<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<style>
    /* Using the same color scheme as users.jsp */
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

    .books-container {
        padding: 10px;
        background: var(--background-gradient);
        min-height: 100vh;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: var(--text-primary);
        border-radius: 15px;
    }

    .books-header {
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

    .btn-category {
        background: linear-gradient(45deg, #3498db, #2980b9);
        color: var(--text-primary);
        box-shadow: 0 8px 32px rgba(52, 152, 219, 0.3);
    }

    .btn-category:hover {
        transform: var(--hover-transform);
        box-shadow: 0 12px 40px rgba(52, 152, 219, 0.4);
    }

    .books-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 25px;
        margin-top: 20px;
    }

    .book-card {
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

    .book-card::before {
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

    .book-card:hover {
        transform: var(--hover-transform);
        box-shadow: 0 12px 40px rgba(139, 69, 19, 0.3);
        background: rgba(255, 255, 255, 0.4);
    }

    .book-image {
        width: 100%;
        height: 200px;
        object-fit: cover;
        border-radius: var(--border-radius);
        margin-bottom: 15px;
        transition: all var(--transition-speed) ease;
        border: 2px solid var(--glass-border);
    }

    .book-card:hover .book-image {
        transform: scale(1.05);
        border-color: var(--secondary-color);
    }

    .book-title {
        font-size: 18px;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 8px;
        text-align: center;
    }

    .book-author {
        color: var(--text-secondary);
        font-size: 14px;
        margin-bottom: 8px;
        text-align: center;
    }

    .book-price {
        color: var(--secondary-color);
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 15px;
        text-align: center;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .book-actions {
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
        background: linear-gradient(55deg, var(--glass-background), rgba(147, 153, 155, 0.8));
        color: var(--text-primary);
        border: 1px solid var(--glass-border);
    }

    .btn-edit {
        background: linear-gradient(55deg, var(--secondary-color), rgba(5, 90, 117, 0.8));
        color: var(--text-primary);
    }

    .btn-delete {
        background: linear-gradient(45deg, var(--primary-color), red);
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

    .form-textarea {
        min-height: 80px;
        resize: vertical;
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

    .book-card.deleting {
        animation: deleteAnimation 0.5s ease forwards;
    }

    /* Book details in view modal */
    .book-detail-section {
        margin-bottom: 20px;
    }

    .book-detail-image {
        width: 100%;
        max-width: 250px;
        height: 300px;
        object-fit: cover;
        border-radius: var(--border-radius);
        margin: 0 auto 20px;
        display: block;
        border: 3px solid var(--glass-border);
    }

    .book-detail-title {
        font-size: 24px;
        font-weight: 600;
        color: var(--text-primary);
        text-align: center;
        margin-bottom: 10px;
    }

    .book-detail-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1px solid var(--glass-border);
    }

    .book-detail-label {
        color: var(--text-secondary);
        font-size: 14px;
        font-weight: 500;
    }

    .book-detail-value {
        color: var(--text-primary);
        font-size: 14px;
    }

    .book-description {
        color: var(--text-secondary);
        line-height: 1.6;
        font-size: 14px;
        margin-top: 15px;
        padding: 15px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: var(--border-radius);
        border: 1px solid var(--glass-border);
    }

    /* Category Table Styles */
    .category-table-section {
        margin-top: 20px;
    }

    .table-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        background: linear-gradient(90deg, #802a0f, #032831);
        color: var(--text-primary);
        flex-wrap: wrap;
        gap: 15px;
        border-radius: var(--border-radius);
    }

    .table-header h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
    }

    .table-controls {
        display: flex;
        gap: 15px;
        align-items: center;
        flex-wrap: wrap;
    }

    .category-table {
        overflow-x: auto;
        background: rgba(255, 255, 255, 0.1);
        border-radius: var(--border-radius);
        padding: 15px;
    }

    .category-table table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
    }

    .category-table th {
        background: linear-gradient(90deg, #6d2610, #021e24);
        color: var(--text-primary);
        padding: 12px 10px;
        text-align: left;
        font-weight: 600;
        font-size: 13px;
        position: sticky;
        top: 0;
        z-index: 10;
    }

    .category-table td {
        padding: 12px 10px;
        border-bottom: 1px solid var(--glass-border);
        font-size: 13px;
        word-wrap: break-word;
        color: var(--text-primary);
        font-weight: 500;
    }

    .category-table tr:nth-child(even) {
        background-color: rgba(255, 255, 255, 0.05);
    }

    .category-table tr:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }

    .status-badge {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
    }

    .status-active {
        background: rgba(39, 174, 96, 0.2);
        color: #27ae60;
    }

    .status-inactive {
        background: rgba(231, 76, 60, 0.2);
        color: #e74c3c;
    }

    .action-icon {
        width: 16px;
        height: 16px;
        cursor: pointer;
        transition: all var(--transition-speed) ease;
    }

    .action-icon:hover {
        transform: scale(1.2);
    }

    .table-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 20px;
        background: rgba(255, 255, 255, 0.05);
        border-top: 1px solid var(--glass-border);
        flex-wrap: wrap;
        gap: 15px;
    }

    .pagination-info {
        color: var(--text-secondary);
        font-size: 13px;
    }

    .pagination-controls {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .pagination-btn {
        background: var(--glass-background);
        border: 1px solid var(--glass-border);
        padding: 8px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 13px;
        transition: all var(--transition-speed) ease;
        color: var(--text-primary);
    }

    .pagination-btn:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.4);
        color: var(--text-primary);
    }

    .pagination-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .pagination-numbers {
        display: flex;
        gap: 4px;
    }

    .page-number {
        background: var(--glass-background);
        border: 1px solid var(--glass-border);
        padding: 8px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 13px;
        transition: all var(--transition-speed) ease;
        color: var(--text-primary);
        min-width: 36px;
    }

    .page-number.active,
    .page-number:hover {
        background: rgba(255, 255, 255, 0.4);
        color: var(--text-primary);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
        .books-container {
            padding: 15px;
        }

        .books-header {
            flex-direction: column;
            align-items: stretch;
        }

        .search-container {
            max-width: 100%;
            margin-bottom: 10px;
        }

        .books-grid {
            grid-template-columns: 1fr;
            gap: 20px;
        }

        .book-card {
            padding: 20px;
        }

        .modal-content {
            width: 95%;
            padding: 20px;
        }
    }

    @media (max-width: 480px) {
        .book-card {
            padding: 15px;
        }

        .modal-content {
            padding: 15px;
        }

        .books-grid {
            gap: 15px;
        }

        .book-actions {
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
    .form-input:focus {
        outline: 2px solid var(--secondary-color);
        outline-offset: 2px;
    }
    
    /* Notification Popup Styles */
        #notificationContainer {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1001;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none; /* Allow clicks to pass through if no notifications */
        }

        .notification-popup {
            background: var(--glass-background);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: var(--border-radius);
            padding: 15px 20px;
            display: flex;
            align-items: center;
            gap: 15px;
            min-width: 280px;
            max-width: 350px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            transform: translateX(100%);
            opacity: 0;
            animation: slideIn 0.5s forwards, fadeOut 0.5s 2.5s forwards; /* Slide in, then fade out after 2.5s delay */
            pointer-events: all; /* Re-enable clicks for the notification itself */
        }

        .notification-popup.success {
            border-left: 5px solid var(--success-color);
        }

        .notification-popup.error {
            border-left: 5px solid var(--error-color);
        }

        .notification-popup.info {
            border-left: 5px solid var(--info-color);
        }

        .notification-icon {
            font-size: 24px;
            color: var(--text-primary);
        }

        .notification-popup.success .notification-icon {
            color: var(--success-color);
        }

        .notification-popup.error .notification-icon {
            color: var(--error-color);
        }

        .notification-popup.info .notification-icon {
            color: var(--info-color);
        }

        .notification-content {
            flex-grow: 1;
        }

        .notification-title {
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 5px;
            font-size: 16px;
        }

        .notification-message {
            color: var(--text-secondary);
            font-size: 14px;
        }

        .notification-close {
            background: none;
            border: none;
            color: var(--text-muted);
            font-size: 18px;
            cursor: pointer;
            padding: 5px;
            border-radius: 50%;
            transition: background var(--transition-speed) ease;
        }

        .notification-close:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        @keyframes slideIn {
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes fadeOut {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }
        
         /* Loading Modal Styles */
        .modal1 {
            display: none; /* Initially hidden */
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 1000;
            backdrop-filter: blur(10px);
            justify-content: center;
            align-items: center;
        }

        .modal1.show {
            display: flex; /* Shown when 'show' class is added */
        }

        .modal-content1 {
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
            box-sizing: border-box;
        }

        .loading-content {
            text-align: center;
            max-width: 300px;
        }

        .loading-spinner {
            width: 60px;
            height: 60px;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px auto;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .loading-content h3 {
            color: var(--text-primary);
            margin: 0 0 10px 0;
            font-size: 18px;
        }

        .loading-content p {
            color: var(--text-secondary);
            margin: 0;
            font-size: 14px;
        }
    /* Loading States */
    .loading {
        opacity: 0.5;
        pointer-events: none;
    }
</style>

<div class="books-container">
    <div class="books-header">
        <div class="search-container">
            <input type="text" class="search-input" placeholder="Search books..." id="searchInput" oninput="searchBooks()">
            <button class="btn btn-search" onclick="searchBooks()">Search</button>
        </div>
        <div>
            <button class="btn btn-primary" onclick="openAddBookModal()">Add New Book</button>
            <button class="btn btn-category" onclick="openCategoryModal()">Manage Categories</button>
        </div>
    </div>

    <div class="books-grid" id="booksGrid">
        <!-- Books will be populated here -->
    </div>
    
     <!-- Loading Modal -->
        <div class="modal1" id="loadingModal">
            <div class="modal-content1 loading-content">
                <div class="loading-spinner"></div>
                <h3 id="loadingTitle">Processing...</h3>
                <p id="loadingMessage">Please wait while we complete the operation.</p>
            </div>
        </div>
    
</div>

<!-- Add/Edit Book Modal -->
<div class="modal" id="bookModal">
    <div class="modal-content">
        <div class="modal-header">
            <h3 class="modal-title" id="modalTitle">Add New Book</h3>
            <button class="close-btn" onclick="closeModal('bookModal')">×</button>
        </div>
        <form id="bookForm" enctype="multipart/form-data">
	    <div class="form-group">
	        <label class="form-label">Title</label>
	        <input type="text" class="form-input" id="bookTitle" placeholder="Enter book title" required>
	    </div>
	    <div class="form-group">
	        <label class="form-label">Author</label>
	        <input type="text" class="form-input" id="bookAuthor" placeholder="Enter author name" required>
	    </div>
	    <div class="form-group">
	        <label class="form-label" for="categoryId">Category</label>
	        <select class="form-input" id="categoryId" required>
	            <option value="" disabled selected>Select category</option>
	            <option value="0" style="color:black">Fiction</option>
	            <option value="1" style="color:black">Non-fiction</option>
	            <option value="2" style="color:black">Science</option>
	            <option value="3" style="color:black">Biography</option>
	            <option value="4" style="color:black">History</option>
	            <option value="5" style="color:black">Technology</option>
	            <option value="6" style="color:black">Fantasy</option>
	            <option value="7" style="color:black">Self-help</option>
	            <option value="8" style="color:black">Other</option>
	        </select>
	    </div>
	    <div class="form-group">
	        <label class="form-label">Price</label>
	        <input type="number" class="form-input" id="bookPrice" placeholder="Enter price" step="0.01" required>
	    </div>
	    <div class="form-group">
	        <label class="form-label">Stock</label>
	        <input type="number" class="form-input" id="bookStock" placeholder="Enter stock quantity" required>
	    </div>
	    <div class="form-group">
	        <label class="form-label">Cover Image</label>
	        <input type="file" class="form-input" id="bookImage" accept="image/*">
	    </div>
	    <div class="form-group">
                <img id="bookPreview" src="" alt="Book Preview" style="display:none; max-height: 150px; margin-top: 10px;" />
            </div>
	    <div class="form-group">
	        <label class="form-label">Description</label>
	        <textarea class="form-input form-textarea" id="bookDescription" placeholder="Enter book description"></textarea>
	    </div>
	    <div class="modal-actions">
	        <button type="button" class="btn btn-cancel" onclick="closeModal('bookModal')">Cancel</button>
	        <button type="submit" class="btn btn-primary" id="submitBtn">Add Book</button>
	    </div>
	</form>
    </div>
</div>

    <!-- Notification Container -->
    <div id="notificationContainer">
        <!-- Notifications will be appended here -->
    </div>

<!-- View Book Modal -->
<div class="modal" id="viewModal">
    <div class="modal-content">
        <div class="modal-header">
            <h3 class="modal-title">Book Details</h3>
            <button class="close-btn" onclick="closeModal('viewModal')">×</button>
        </div>
        <div id="bookDetails">
            <!-- Book details will be populated here -->
        </div>
    </div>
</div>

<!-- Confirm Delete Modal -->
<div class="modal" id="confirmModal">
    <div class="modal-content confirm-modal">
        <div class="confirm-icon">⚠️</div>
        <div class="confirm-message">Are you sure you want to delete this book?</div>
        <div class="confirm-actions">
            <button class="btn btn-cancel" onclick="closeModal('confirmModal')">Cancel</button>
            <button class="btn btn-delete" onclick="confirmDelete()">Delete</button>
        </div>
    </div>
</div>

<!-- Category Management Modal -->
<div class="modal" id="categoryModal">
    <div class="modal-content">
        <div class="modal-header">
            <h3 class="modal-title">Manage Categories</h3>
            <button class="close-btn" onclick="closeModal('categoryModal')">×</button>
        </div>
        <form id="categoryForm">
            <div class="form-group">
                <label class="form-label">Category Name</label>
                <input type="text" class="form-input" id="categoryName" placeholder="Enter category name" required>
            </div>
            <div class="form-group">
                <label class="form-label">Description</label>
                <textarea class="form-input form-textarea" id="categoryDescription" placeholder="Enter category description"></textarea>
            </div>
            <div class="modal-actions">
                <button type="button" class="btn btn-cancel" onclick="closeModal('categoryModal')">Cancel</button>
                <button type="submit" class="btn btn-primary" id="addCategoryBtn">Add Category</button>
            </div>
        </form>
        <div class="category-table-section">
            <div class="table-header">
                <h3>Category List</h3>
                <div class="table-controls">
                    <input type="text" placeholder="Search categories..." class="search-input" id="categorySearch" oninput="searchCategories()">
                </div>
            </div>
            <div class="category-table">
                <table id="categoryTable">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="categoryTableBody">
                        <tr class="empty-row">
                            <td colspan="4" style="text-align: center; color: var(--text-muted); padding: 40px;">
                                No categories available. Add a new category above.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="table-footer">
                <div class="pagination-info">
                    <span id="categoryPaginationInfo">Showing 0 to 0 of 0 entries</span>
                </div>
                <div class="pagination-controls">
                    <button class="pagination-btn" id="categoryPrevBtn" disabled>Previous</button>
                    <div class="pagination-numbers" id="categoryPaginationNumbers"></div>
                    <button class="pagination-btn" id="categoryNextBtn" disabled>Next</button>
                </div>
            </div>
        </div>
    </div>
</div>

