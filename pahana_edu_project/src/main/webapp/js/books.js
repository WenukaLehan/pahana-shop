(() => {
    const entriesPerPage = 5;
    const apiBaseUrl = `${window.contextPath}/BookServlet`;

    let books = [];
    let categories = [];
    let currentEditId = null;
    let deleteBookId = null;
    let currentCategoryPage = 1;

    /**
     * Shows a notification popup.
     * @param {'success'|'error'|'info'} type - Type of notification (e.g., 'success', 'error', 'info').
     * @param {string} message - The message to display in the notification.
     * @param {number} duration - How long the notification should be visible in milliseconds (default: 3000).
     */
	function showNotification(type, message, duration = 3000) {
	    const container = document.getElementById('notificationContainer');
	    const notification = document.createElement('div');
	    notification.classList.add('notification-popup', type);

	    let iconClass = '';
	    let title = '';
	    if (type === 'success') {
	        iconClass = 'fa-solid fa-circle-check';
	        title = 'Success!';
	    } else if (type === 'error') {
	        iconClass = 'fa-solid fa-circle-xmark';
	        title = 'Error!';
	    } else {
	        iconClass = 'fa-solid fa-circle-info';
	        title = 'Info';
	    }

	    notification.innerHTML = `
	        <div class="notification-icon"><i class="${iconClass}"></i></div>
	        <div class="notification-content">
	            <div class="notification-title">${title}</div>
	            <div class="notification-message">${message}</div>
	        </div>
	        <button class="notification-close" onclick="this.closest('.notification-popup').remove();">&times;</button>
	    `;

	    container.appendChild(notification);

	    // Remove the notification after a duration, allowing animation to complete
	    setTimeout(() => {
	        notification.style.animation = 'fadeOut 0.5s forwards'; // Trigger fade out animation
	        setTimeout(() => {
	            notification.remove();
	        }, 500); // Remove from DOM after fade out completes
	    }, duration);
	}

    /**
     * Shows the loading modal with a minimum display time.
     * @param {string} title - The title for the loading modal.
     * @param {string} message - The message for the loading modal.
     * @returns {Promise} Resolves after a minimum delay of 500ms.
     */
    function showLoadingModal(title = 'Processing...', message = 'Please wait while we complete the operation.') {
        const loadingModal = document.getElementById('loadingModal');
        const loadingTitle = document.getElementById('loadingTitle');
        const loadingMessage = document.getElementById('loadingMessage');

        loadingTitle.textContent = title;
        loadingMessage.textContent = message;
        loadingModal.classList.add('show');

        return new Promise(resolve => setTimeout(resolve, 500)); // Minimum 500ms delay
    }

    /**
     * Hides the loading modal.
     */
    function hideLoadingModal() {
        const loadingModal = document.getElementById('loadingModal');
        loadingModal.classList.remove('show');
    }

    /**
     * Fetches books from the server and updates the UI.
     */
    function fetchBooks() {
        showLoadingModal("Loading Books", "Please wait while we fetch the book data.").then(() => {
            $.ajax({
                url: apiBaseUrl,
                type: 'POST',
                data: { action: 'listBooks' },
                success: function (response) {
                    hideLoadingModal();
                    if (response.success && Array.isArray(response.books)) {
                        books = response.books;
                        if (books.length === 0) {
                            showNotification('info', "No books available.");
                        } else {
                            renderBooks();
                        }
                    } else {
                        showNotification('error', "No books found or invalid response format: " + (response.message || 'Unknown error'));
                        console.error("No books found or invalid response format:", response.message || 'Unknown error');
                    }
                },
                error: function (xhr, status, error) {
                    hideLoadingModal();
                    showNotification('error', "Error fetching books: " + error);
                    console.error("Error fetching books:", status, error);
                }
            });
        });
    }

    /**
     * Fetches categories from the server and updates the UI.
     */
    function fetchCategories() {
        showLoadingModal("Loading Categories", "Please wait while we fetch the category data.").then(() => {
            $.ajax({
                url: `${window.contextPath}/CategoryServlet`,
                type: 'POST',
                data: { action: 'list' },
                success: function (response) {
                    hideLoadingModal();
                    if (response.success && Array.isArray(response.categories)) {
                        categories = response.categories;
                        if (categories.length === 0) {
                            showNotification('info', "No categories available.");
                        } else {
                            updateCategoryTable();
                            updateCategoryDropdown();
                        }
                    } else {
                        showNotification('error', "No categories found or invalid response format: " + (response.message || 'Unknown error'));
                        console.error("No categories found or invalid response format:", response.message || 'Unknown error');
                    }
                },
                error: function (xhr, status, error) {
                    hideLoadingModal();
                    showNotification('error', "Error fetching categories: " + error);
                    console.error("Error fetching categories:", status, error);
                }
            });
        });
    }

    /**
     * Initializes book and category management.
     */
    function initBookManagement() {
        fetchBooks();
        fetchCategories();
        document.getElementById('bookForm').addEventListener('submit', handleFormSubmit);
        document.getElementById('categoryForm').addEventListener('submit', handleCategoryFormSubmit);
        window.addEventListener('click', handleOutsideClick);
    }

    /**
     * Updates the category dropdown with fetched categories.
     */
    function updateCategoryDropdown() {
        const categorySelect = document.getElementById('categoryId');
        categorySelect.innerHTML = '<option value="" disabled selected>Select Category</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            if (category.status === 'inactive') {
                option.disabled = true;
            }
            option.style.color = category.status === 'inactive' ? 'gray' : 'black';
            categorySelect.appendChild(option);
        });
    }

    /**
     * Renders the book grid.
     * @param {Array} booksToRender - Books to display (default: global books array).
     */
    function renderBooks(booksToRender = books) {
        const booksGrid = document.getElementById('booksGrid');
        booksGrid.innerHTML = '';

        if (booksToRender.length === 0) {
            booksGrid.innerHTML = `
                <div class="empty-row" style="text-align: center; color: var(--text-muted); padding: 40px;">
                    No books available. Add a new book above.
                </div>
            `;
            return;
        }

        booksToRender.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.className = 'book-card';
            bookCard.innerHTML = `
                <img src="${window.contextPath}/GetProImage?bookId=${book.id}&action=book" alt="${book.title}" class="book-image">
                <div class="book-title">${book.title}</div>
                <div class="book-author">by ${book.author}</div>
                <div class="book-price">$${book.price}</div>
                <div class="book-actions">
                    <button class="btn-small btn-view" onclick="viewBook(${book.id})">View</button>
                    <button class="btn-small btn-edit" onclick="editBook(${book.id})">Edit</button>
                    <button class="btn-small btn-delete" onclick="deleteBook(${book.id})">Delete</button>
                </div>
            `;
            booksGrid.appendChild(bookCard);
        });
    }

    /**
     * Opens the modal to add a new book.
     */
    function openAddBookModal() {
        document.getElementById('modalTitle').textContent = 'Add New Book';
        document.getElementById('submitBtn').textContent = 'Add Book';
        document.getElementById('bookForm').reset();
        document.getElementById('bookPreview').style.display = 'none';
        document.getElementById('bookPreview').src = '';
        currentEditId = null;
        openModal('bookModal');
        //showNotification('info', "Opened form to add a new book.");
    }

    /**
     * Opens the category modal.
     */
    function openCategoryModal() {
        document.getElementById('categoryForm').reset();
        openModal('categoryModal');
        updateCategoryTable();
        //showNotification('info', "Opened form to add a new category.");
    }

    /**
     * Opens the modal to edit a book.
     * @param {number} id - The book ID.
     */
    function editBook(id) {
        const book = books.find(b => b.id === id);
        if (!book) {
            showNotification('error', "Book not found.");
            return;
        }

        document.getElementById('modalTitle').textContent = 'Edit Book';
        document.getElementById('submitBtn').textContent = 'Update Book';
        document.getElementById('bookTitle').value = book.title;
        document.getElementById('bookAuthor').value = book.author;
        document.getElementById('bookPrice').value = book.price;
        document.getElementById('bookDescription').value = book.description;
        document.getElementById('bookStock').value = book.stock || '';
        document.getElementById('categoryId').value = book.categoryId || '';
        const bookImage = document.getElementById('bookPreview');
        if (book.id) {
            bookImage.src = `${window.contextPath}/GetProImage?bookId=${book.id}&action=book`;
            bookImage.style.display = 'block';
        } else {
            bookImage.style.display = 'none';
            bookImage.src = '';
        }

        currentEditId = id;
        openModal('bookModal');
        //showNotification('info', `Editing book: ${book.title}`);
    }

    /**
     * Displays book details in a modal.
     * @param {number} id - The book ID.
     */
    function viewBook(id) {
        const book = books.find(b => b.id === id);
        if (!book) {
            showNotification('error', "Book not found.");
            return;
        }

        const bookDetails = document.getElementById('bookDetails');
        bookDetails.innerHTML = `
            <img src="${window.contextPath}/GetProImage?bookId=${book.id}&action=book" alt="${book.title}" class="book-image">
            <div class="book-title">${book.title}</div>
            <div class="book-author">by ${book.author}</div>
            <div class="book-price">$${book.price}</div>
            <div class="form-group">
                <label class="form-label">Description</label>
                <div style="color: rgba(255, 255, 255, 0.9); line-height: 1.6;">${book.description}</div>
            </div>
        `;
        openModal('viewModal');
        //showNotification('info', `Viewing book: ${book.title}`);
    }

    /**
     * Initiates book deletion.
     * @param {number} id - The book ID.
     */
    function deleteBook(id) {
        deleteBookId = id;
        openModal('confirmModal');
        //showNotification('info', "Confirm deletion of book.");
    }

    /**
     * Confirms book deletion and sends request to server.
     */
    function confirmDelete() {
        if (deleteBookId) {
            showLoadingModal("Processing...", "Please wait while we delete the book.").then(() => {
                const bookCard = document.querySelector(`[onclick="deleteBook(${deleteBookId})"]`).closest('.book-card');
                bookCard.classList.add('deleting');

                $.ajax({
                    url: apiBaseUrl,
                    type: 'POST',
                    data: {
                        action: 'deleteBook',
                        bookId: deleteBookId
                    },
                    success: function (response) {
                        hideLoadingModal();
                        if (response.success) {
                            setTimeout(() => {
                                showNotification('success', "Book deleted successfully!");
                                fetchBooks();
                                deleteBookId = null;
                                closeModal('confirmModal');
                            }, 500);
                        } else {
                            bookCard.classList.remove('deleting');
                            showNotification('error', "Error: " + response.message);
                            closeModal('confirmModal');
                        }
                    },
                    error: function (xhr, status, error) {
                        hideLoadingModal();
                        bookCard.classList.remove('deleting');
                        showNotification('error', "An error occurred while deleting the book. Please try again.");
                        console.error("Error:", status, error);
                        closeModal('confirmModal');
                    }
                });
            });
        } else {
            showNotification('error', "No book selected for deletion.");
            closeModal('confirmModal');
        }
    }

    /**
     * Handles book form submission (add or update).
     */
	function handleFormSubmit(e) {
	    e.preventDefault();
	    showLoadingModal("Processing...", "Please wait while we save the book data.");

	    const title = document.getElementById('bookTitle').value;
	    const author = document.getElementById('bookAuthor').value;
	    const price = parseFloat(document.getElementById('bookPrice').value);
	    const description = document.getElementById('bookDescription').value;
	    const stock = parseInt(document.getElementById('bookStock').value);
	    const categoryId = parseInt(document.getElementById('categoryId').value);
	    const image = document.getElementById('bookImage').files[0];

	    if (!title || !author || isNaN(price) || !description || isNaN(stock) || isNaN(categoryId)) {
	        showNotification('error', "Please fill in all fields.");
	        hideLoadingModal();
	        return;
	    }

	    const formData = new FormData();
	    formData.append('title', title);
	    formData.append('author', author);
	    formData.append('price', price);
	    formData.append('description', description);
	    formData.append('stock', stock);
	    formData.append('categoryId', categoryId);
	    if (image) {
	        if (image.type !== 'image/png') {
	            showNotification('error', "Please select a PNG image.");
	            hideLoadingModal();
	            return;
	        }
	        formData.append('image', image);
	    }
	    if (currentEditId) {
	        formData.append('id', currentEditId);
	        formData.append('action', 'updateBook');
	    } else {
	        formData.append('action', 'addBook');
	    }

	    $.ajax({
	        url: `${window.contextPath}/BookServlet`,
	        type: 'POST',
	        data: formData,
	        contentType: false,
	        enctype: 'multipart/form-data',
	        processData: false,
	        success: function (response) {
	            hideLoadingModal();
	            if (response.success) {
	                showNotification('success', currentEditId ? "Book updated successfully!" : "Book added successfully!");
	                fetchBooks();
	            } else {
	                showNotification('error', "Error: " + response.message);
	            }
	        },
	        error: function (xhr, status, error) {
	            hideLoadingModal();
	            showNotification('error', "An error occurred while processing your request. Please try again.");
	            console.error("Error:", status, error);
	        }
	    });

	    closeModal('bookModal');
	    currentEditId = null;
	    document.getElementById('bookForm').reset();
	    document.getElementById('bookPreview').style.display = 'none';
	}

    /**
     * Handles category form submission.
     */
    function handleCategoryFormSubmit(e) {
        e.preventDefault();
        showLoadingModal("Processing...", "Please wait while we save the category data.").then(() => {
            const name = document.getElementById('categoryName').value;
            const description = document.getElementById('categoryDescription').value;

            if (!name || !description) {
                showNotification('error', "Please fill in all required fields.");
                hideLoadingModal();
                return;
            }

            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('action', 'create');

            $.ajax({
                url: `${window.contextPath}/CategoryServlet`,
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    hideLoadingModal();
                    if (response.success) {
                        showNotification('success', "Category created successfully!");
                        fetchCategories();
                        document.getElementById('categoryForm').reset();
                        closeModal('categoryModal');
                    } else {
                        showNotification('error', "Error: " + response.message);
                    }
                },
                error: function (xhr, status, error) {
                    hideLoadingModal();
                    showNotification('error', "An error occurred while creating the category. Please try again.");
                    console.error("Error:", status, error);
                }
            });
        });
    }

    /**
     * Handles clicks outside modals to close them.
     */
    function handleOutsideClick(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                closeModal(modal.id);
                //showNotification('info', `Closed modal: ${modal.id}`);
            }
        });
    }

    /**
     * Updates the category table with pagination.
     * @param {string} searchTerm - The search term to filter categories.
     */
    function updateCategoryTable(searchTerm = '') {
        const categoryTableBody = document.getElementById('categoryTableBody');
        const filteredCategories = categories.filter(cat =>
            cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        const startIndex = (currentCategoryPage - 1) * entriesPerPage;
        const paginatedCategories = filteredCategories.slice(startIndex, startIndex + entriesPerPage);
        categoryTableBody.innerHTML = '';

        if (filteredCategories.length === 0) {
            categoryTableBody.innerHTML = `
                <tr class="empty-row">
                    <td colspan="4" style="text-align: center; color: var(--text-muted); padding: 40px;">
                        No categories available. Add a new category above.
                    </td>
                </tr>
            `;
            updateCategoryPagination(filteredCategories.length);
            return;
        }

        paginatedCategories.forEach(cat => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cat.name}</td>
                <td>${cat.description || 'No description'}</td>
                <td><span class="status-badge status-${cat.status}">${cat.status.charAt(0).toUpperCase() + cat.status.slice(1)}</span></td>
                <td>
                    <svg class="action-icon ${cat.status === 'active' ? 'deactivate' : 'activate'}" data-id="${cat.id}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${cat.status === 'active' ? '#e74c3c' : '#27ae60'}">
                        <path d="${cat.status === 'active' ? 'M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z' : 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z'}"/>
                    </svg>
                </td>
            `;
            categoryTableBody.appendChild(row);
        });

        updateCategoryPagination(filteredCategories.length);

        document.querySelectorAll('.action-icon.deactivate, .action-icon.activate').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.closest('.action-icon').dataset.id);
                const category = categories.find(cat => cat.id === id);
                if (!category) {
                    showNotification('error', "Category not found.");
                    return;
                }

                showLoadingModal("Processing...", "Please wait while we update the category status.").then(() => {
                    const newStatus = category.status === 'active' ? 'inactive' : 'active';

                    $.ajax({
                        url: `${window.contextPath}/CategoryServlet`,
                        type: 'POST',
                        data: {
                            action: 'changeStatus',
                            cat_id: id,
                            status: newStatus
                        },
                        success: function (response) {
                            hideLoadingModal();
                            if (response.success) {
                                showNotification('success', "Category status updated successfully!");
                                fetchCategories();
                            } else {
                                showNotification('error', "Error: " + response.message);
                            }
                        },
                        error: function (xhr, status, error) {
                            hideLoadingModal();
                            showNotification('error', "An error occurred while updating the category status. Please try again.");
                            console.error("Error:", status, error);
                        }
                    });
                });
            });
        });
    }

    /**
     * Updates category pagination controls.
     * @param {number} totalItems - Total number of filtered categories.
     */
    function updateCategoryPagination(totalItems) {
        const totalPages = Math.ceil(totalItems / entriesPerPage);
        const categoryPaginationInfo = document.getElementById('categoryPaginationInfo');
        const categoryPrevBtn = document.getElementById('categoryPrevBtn');
        const categoryNextBtn = document.getElementById('categoryNextBtn');
        const categoryPaginationNumbers = document.getElementById('categoryPaginationNumbers');

        categoryPaginationInfo.textContent = `Showing ${Math.min((currentCategoryPage - 1) * entriesPerPage + 1, totalItems)} to ${Math.min(currentCategoryPage * entriesPerPage, totalItems)} of ${totalItems} entries`;
        categoryPrevBtn.disabled = currentCategoryPage === 1;
        categoryNextBtn.disabled = currentCategoryPage === totalPages || totalPages === 0;

        categoryPaginationNumbers.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.classList.add('page-number');
            if (i === currentCategoryPage) pageBtn.classList.add('active');
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                currentCategoryPage = i;
                updateCategoryTable(document.getElementById('categorySearch').value);
            });
            categoryPaginationNumbers.appendChild(pageBtn);
        }
    }

    /**
     * Filters books based on search input.
     */
    function searchBooks() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const filteredBooks = books.filter(book =>
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm)
        );
        renderBooks(filteredBooks);
    }

    /**
     * Filters categories based on search input.
     */
    function searchCategories() {
        const searchTerm = document.getElementById('categorySearch').value;
        currentCategoryPage = 1;
        updateCategoryTable(searchTerm);
    }

    /**
     * Opens a modal by ID.
     * @param {string} modalId - The ID of the modal to open.
     */
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.style.display = 'block';
        setTimeout(() => modal.classList.add('show'), 10);
    }

    /**
     * Closes a modal by ID.
     * @param {string} modalId - The ID of the modal to close.
     */
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = 'none', 300);
    }

    /**
     * Handles image preview for book form.
     */
    document.getElementById('bookImage').addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            if (['image/png', 'image/jpeg'].includes(file.type)) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const preview = document.getElementById('bookPreview');
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                    //showNotification('success', "Image preview updated successfully.");
                };
                reader.readAsDataURL(file);
            } else {
                showNotification('error', "Please select a PNG or JPEG image.", 4000);
                this.value = '';
                document.getElementById('bookPreview').style.display = 'none';
                document.getElementById('bookPreview').src = '';
            }
        } else {
            document.getElementById('bookPreview').style.display = 'none';
            document.getElementById('bookPreview').src = '';
        }
    });

    // Expose required functions globally
    window.searchBooks = searchBooks;
    window.openAddBookModal = openAddBookModal;
    window.openCategoryModal = openCategoryModal;
    window.closeModal = closeModal;
    window.viewBook = viewBook;
    window.editBook = editBook;
    window.deleteBook = deleteBook;
    window.confirmDelete = confirmDelete;
    window.searchCategories = searchCategories;

    // Initialize
    initBookManagement();
})();