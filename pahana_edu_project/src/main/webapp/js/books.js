(() => {
    const entriesPerPage = 5;

    let books = [
        {
            id: 1,
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            price: 12.99,
            image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
            description: "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream."
        },
        {
            id: 2,
            title: "To Kill a Mockingbird",
            author: "Harper Lee",
            price: 14.99,
            image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
            description: "A gripping tale of racial injustice and childhood innocence in the American South."
        },
        {
            id: 3,
            title: "1984",
            author: "George Orwell",
            price: 13.99,
            image: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=300&h=400&fit=crop",
            description: "A dystopian novel about totalitarianism and surveillance in a future society."
        }
    ];

    let categories = [
        { id: 1, name: "Fiction", description: "Fictional literature and novels", status: "active" },
        { id: 2, name: "Non-Fiction", description: "Factual and informative books", status: "active" },
        { id: 3, name: "Science Fiction", description: "Speculative fiction with futuristic themes", status: "active" }
    ];

    let currentEditId = null;
    let deleteBookId = null;
    let currentCategoryPage = 1;

    function initBookManagement() {
        renderBooks();
        document.getElementById('bookForm').addEventListener('submit', handleFormSubmit);
        document.getElementById('categoryForm').addEventListener('submit', handleCategoryFormSubmit);
        window.addEventListener('click', handleOutsideClick);
        updateCategoryTable();
    }

    function renderBooks(booksToRender = books) {
        const booksGrid = document.getElementById('booksGrid');
        booksGrid.innerHTML = '';

        booksToRender.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.className = 'book-card';
            bookCard.innerHTML = `
                <img src="${book.image}" alt="${book.title}" class="book-image">
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

    function openAddBookModal() {
        document.getElementById('modalTitle').textContent = 'Add New Book';
        document.getElementById('submitBtn').textContent = 'Add Book';
        document.getElementById('bookForm').reset();
        currentEditId = null;
        openModal('bookModal');
    }

    function openCategoryModal() {
        document.getElementById('categoryForm').reset();
        openModal('categoryModal');
        updateCategoryTable();
    }

    function editBook(id) {
        const book = books.find(b => b.id === id);
        if (!book) return;

        document.getElementById('modalTitle').textContent = 'Edit Book';
        document.getElementById('submitBtn').textContent = 'Update Book';
        document.getElementById('bookTitle').value = book.title;
        document.getElementById('bookAuthor').value = book.author;
        document.getElementById('bookPrice').value = book.price;
        document.getElementById('bookImage').value = book.image;
        document.getElementById('bookDescription').value = book.description;

        currentEditId = id;
        openModal('bookModal');
    }

    function viewBook(id) {
        const book = books.find(b => b.id === id);
        if (!book) return;

        const bookDetails = document.getElementById('bookDetails');
        bookDetails.innerHTML = `
            <img src="${book.image}" alt="${book.title}" class="book-image">
            <div class="book-title">${book.title}</div>
            <div class="book-author">by ${book.author}</div>
            <div class="book-price">$${book.price}</div>
            <div class="form-group">
                <label class="form-label">Description</label>
                <div style="color: rgba(255, 255, 255, 0.9); line-height: 1.6;">${book.description}</div>
            </div>
        `;
        openModal('viewModal');
    }

    function deleteBook(id) {
        deleteBookId = id;
        openModal('confirmModal');
    }

    function confirmDelete() {
        if (deleteBookId) {
            const bookCard = document.querySelector(`[onclick="deleteBook(${deleteBookId})"]`).closest('.book-card');
            bookCard.classList.add('deleting');
            setTimeout(() => {
                books = books.filter(b => b.id !== deleteBookId);
                renderBooks();
                deleteBookId = null;
            }, 500);
        }
        closeModal('confirmModal');
    }

    function searchBooks() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const filteredBooks = books.filter(book =>
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm)
        );
        renderBooks(filteredBooks);
    }

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.style.display = 'block';
        setTimeout(() => modal.classList.add('show'), 10);
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = 'none', 300);
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        const bookData = {
            title: document.getElementById('bookTitle').value,
            author: document.getElementById('bookAuthor').value,
            price: parseFloat(document.getElementById('bookPrice').value),
            image: document.getElementById('bookImage').value || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
            description: document.getElementById('bookDescription').value
        };

        if (currentEditId) {
            const bookIndex = books.findIndex(b => b.id === currentEditId);
            books[bookIndex] = { ...books[bookIndex], ...bookData };
        } else {
            const newBook = {
                id: Math.max(...books.map(b => b.id), 0) + 1,
                ...bookData
            };
            books.push(newBook);
        }

        renderBooks();
        closeModal('bookModal');
    }

    function handleOutsideClick(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                closeModal(modal.id);
            }
        });
    }

    function handleCategoryFormSubmit(e) {
        e.preventDefault();
        const categoryData = {
            id: categories.length ? Math.max(...categories.map(c => c.id)) + 1 : 1,
            name: document.getElementById('categoryName').value,
            description: document.getElementById('categoryDescription').value,
            status: 'active'
        };

        categories.push(categoryData);
        updateCategoryTable();
        document.getElementById('categoryForm').reset();
    }

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
                if (category) {
                    category.status = category.status === 'active' ? 'inactive' : 'active';
                    updateCategoryTable(document.getElementById('categorySearch').value);
                }
            });
        });
    }

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

    function searchCategories() {
        const searchTerm = document.getElementById('categorySearch').value;
        currentCategoryPage = 1;
        updateCategoryTable(searchTerm);
    }

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
