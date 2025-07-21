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

function initBookManagement() {
    renderBooks();
    document.getElementById('bookForm').addEventListener('submit', handleFormSubmit);
    window.addEventListener('click', handleOutsideClick);
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
            id: Math.max(...books.map(b => b.id)) + 1,
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