

<style>
    .books-container {
        padding: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
        border-radius: 25px;
        background: rgba(255, 255, 255, 0.1);
        color: white;
        font-size: 14px;
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
    }

    .search-input::placeholder {
        color: rgba(255, 255, 255, 0.7);
    }

    .search-input:focus {
        outline: none;
        background: rgba(255, 255, 255, 0.2);
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
    }

    .btn {
        padding: 12px 25px;
        border: none;
        border-radius: 25px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        transition: all 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .btn-primary {
        background: linear-gradient(45deg, #ff6b6b, #ee5a52);
        color: white;
        box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
    }

    .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
    }

    .btn-search {
        background: rgba(255, 255, 255, 0.2);
        color: white;
        backdrop-filter: blur(10px);
    }

    .btn-search:hover {
        background: rgba(255, 255, 255, 0.3);
    }

    .books-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 25px;
        margin-top: 20px;
    }

    .book-card {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        padding: 20px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }

    .book-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        background: rgba(255, 255, 255, 0.15);
    }

    .book-image {
        width: 100%;
        height: 200px;
        object-fit: cover;
        border-radius: 10px;
        margin-bottom: 15px;
    }

    .book-title {
        font-size: 18px;
        font-weight: 600;
        color: white;
        margin-bottom: 8px;
    }

    .book-author {
        color: rgba(255, 255, 255, 0.8);
        font-size: 14px;
        margin-bottom: 5px;
    }

    .book-price {
        color: #4ecdc4;
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 15px;
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
        transition: all 0.3s ease;
        flex: 1;
    }

    .btn-view {
        background: linear-gradient(45deg, #4ecdc4, #44a08d);
        color: white;
    }

    .btn-edit {
        background: linear-gradient(45deg, #f093fb, #f5576c);
        color: white;
    }

    .btn-delete {
        background: linear-gradient(45deg, #ff9a9e, #fecfef);
        color: white;
    }

    .btn-small:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
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
        backdrop-filter: blur(5px);
    }

    .modal-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 30px;
        border-radius: 20px;
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
        color: white;
        font-size: 20px;
        font-weight: 600;
    }

    .close-btn {
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.3s ease;
    }

    .close-btn:hover {
        background: rgba(255, 255, 255, 0.2);
    }

    .form-group {
        margin-bottom: 20px;
    }

    .form-label {
        display: block;
        color: white;
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 8px;
    }

    .form-input {
        width: 100%;
        padding: 12px 15px;
        border: none;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.1);
        color: white;
        font-size: 14px;
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
        box-sizing: border-box;
    }

    .form-input::placeholder {
        color: rgba(255, 255, 255, 0.7);
    }

    .form-input:focus {
        outline: none;
        background: rgba(255, 255, 255, 0.2);
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
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
        background: rgba(255, 255, 255, 0.2);
        color: white;
    }

    .btn-cancel:hover {
        background: rgba(255, 255, 255, 0.3);
    }

    /* Confirm Delete Modal */
    .confirm-modal {
        text-align: center;
    }

    .confirm-icon {
        font-size: 48px;
        color: #ff6b6b;
        margin-bottom: 20px;
    }

    .confirm-message {
        color: white;
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
        animation: fadeIn 0.3s ease;
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
</style>

<div class="books-container">
    <div class="books-header">
        <div class="search-container">
            <input type="text" class="search-input" placeholder="Search books..." id="searchInput">
            <button class="btn btn-search" onclick="searchBooks()">Search</button>
        </div>
        <button class="btn btn-primary" onclick="openAddBookModal()">Add New Book</button>
    </div>

    <div class="books-grid" id="booksGrid">
        <!-- Books will be populated here -->
    </div>
</div>

<!-- Add/Edit Book Modal -->
<div class="modal" id="bookModal">
    <div class="modal-content">
        <div class="modal-header">
            <h3 class="modal-title" id="modalTitle">Add New Book</h3>
            <button class="close-btn" onclick="closeModal('bookModal')">&times;</button>
        </div>
        <form id="bookForm">
            <div class="form-group">
                <label class="form-label">Title</label>
                <input type="text" class="form-input" id="bookTitle" placeholder="Enter book title" required>
            </div>
            <div class="form-group">
                <label class="form-label">Author</label>
                <input type="text" class="form-input" id="bookAuthor" placeholder="Enter author name" required>
            </div>
            <div class="form-group">
                <label class="form-label">Price</label>
                <input type="number" class="form-input" id="bookPrice" placeholder="Enter price" step="0.01" required>
            </div>
            <div class="form-group">
                <label class="form-label">Image URL</label>
                <input type="url" class="form-input" id="bookImage" placeholder="Enter image URL">
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

<!-- View Book Modal -->
<div class="modal" id="viewModal">
    <div class="modal-content">
        <div class="modal-header">
            <h3 class="modal-title">Book Details</h3>
            <button class="close-btn" onclick="closeModal('viewModal')">&times;</button>
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

<script>
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

let currentEditId = null;
let deleteBookId = null;

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

document.getElementById('bookForm').addEventListener('submit', function(e) {
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
            id: Math.max(...books.map(b => b.id)) + 1,
            ...bookData
        };
        books.push(newBook);
    }

    renderBooks();
    closeModal('bookModal');
});

// Close modal when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            closeModal(modal.id);
        }
    });
}

// Initialize
renderBooks();
</script>