function initUserManagement() {
    let users = [
        {
            id: 1,
            name: "John Doe",
            email: "john.doe@example.com",
            phone: "+1-234-567-8900",
            role: "admin",
            status: "active",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
        },
        {
            id: 2,
            name: "Jane Smith",
            email: "jane.smith@example.com",
            phone: "+1-234-567-8901",
            role: "user",
            status: "active",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
        },
        {
            id: 3,
            name: "Mike Johnson",
            email: "mike.johnson@example.com",
            phone: "+1-234-567-8902",
            role: "moderator",
            status: "inactive",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
        },
        {
            id: 4,
            name: "Sarah Wilson",
            email: "sarah.wilson@example.com",
            phone: "+1-234-567-8903",
            role: "user",
            status: "active",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b332e234?w=150&h=150&fit=crop&crop=face"
        }
    ];

    let currentEditId = null;
    let deleteUserId = null;

    function renderUsers(usersToRender = users) {
        const usersGrid = document.getElementById('usersGrid');
        if (!usersGrid) return;
        usersGrid.innerHTML = '';

        usersToRender.forEach(user => {
            const userCard = document.createElement('div');
            userCard.className = 'user-card';
            userCard.innerHTML = `
                <img src="${user.avatar}" alt="${user.name}" class="user-avatar">
                <div class="user-name">${user.name}</div>
                <div class="user-email">${user.email}</div>
                <div class="user-role">${user.role}</div>
                <div class="user-status status-${user.status}">${user.status}</div>
                <div class="user-actions">
                    <button class="btn-small btn-view" onclick="viewUser(${user.id})">View</button>
                    <button class="btn-small btn-edit" onclick="editUser(${user.id})">Edit</button>
                    <button class="btn-small btn-delete" onclick="deleteUser(${user.id})">Delete</button>
                </div>
            `;
            usersGrid.appendChild(userCard);
        });
    }

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        modal.style.display = 'block';
        setTimeout(() => modal.classList.add('show'), 10);
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = 'none', 300);
    }

    function openAddUserModal() {
        document.getElementById('modalTitle').textContent = 'Add New User';
        document.getElementById('submitBtn').textContent = 'Add User';
        document.getElementById('userForm').reset();
        currentEditId = null;
        openModal('userModal');
    }

    function editUser(id) {
        const user = users.find(u => u.id === id);
        if (!user) return;

        document.getElementById('modalTitle').textContent = 'Edit User';
        document.getElementById('submitBtn').textContent = 'Update User';
        document.getElementById('userName').value = user.name;
        document.getElementById('userEmail').value = user.email;
        document.getElementById('userPhone').value = user.phone;
        document.getElementById('userRole').value = user.role;
        document.getElementById('userStatus').value = user.status;
        document.getElementById('userAvatar').value = user.avatar;

        currentEditId = id;
        openModal('userModal');
    }

    function viewUser(id) {
        const user = users.find(u => u.id === id);
        if (!user) return;

        const userDetails = document.getElementById('userDetails');
        userDetails.innerHTML = `
            <div class="user-detail-section">
                <img src="${user.avatar}" alt="${user.name}" class="user-detail-avatar">
                <div class="user-detail-name">${user.name}</div>
            </div>
            <div class="user-detail-info">
                <span class="user-detail-label">Email:</span>
                <span class="user-detail-value">${user.email}</span>
            </div>
            <div class="user-detail-info">
                <span class="user-detail-label">Phone:</span>
                <span class="user-detail-value">${user.phone}</span>
            </div>
            <div class="user-detail-info">
                <span class="user-detail-label">Role:</span>
                <span class="user-detail-value">${user.role}</span>
            </div>
            <div class="user-detail-info">
                <span class="user-detail-label">Status:</span>
                <span class="user-detail-value status-${user.status}">${user.status}</span>
            </div>
        `;
        openModal('viewModal');
    }

    function deleteUser(id) {
        deleteUserId = id;
        openModal('confirmModal');
    }

    function confirmDelete() {
        if (deleteUserId) {
            const userCard = document.querySelector(`[onclick="deleteUser(${deleteUserId})"]`).closest('.user-card');
            userCard.classList.add('deleting');

            setTimeout(() => {
                users = users.filter(u => u.id !== deleteUserId);
                renderUsers();
                deleteUserId = null;
            }, 500);
        }
        closeModal('confirmModal');
    }

    function searchUsers() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const filteredUsers = users.filter(user =>
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            user.role.toLowerCase().includes(searchTerm)
        );
        renderUsers(filteredUsers);
    }

    // Handle form submission
    const userForm = document.getElementById('userForm');
    if (userForm) {
        userForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const userData = {
                name: document.getElementById('userName').value,
                email: document.getElementById('userEmail').value,
                phone: document.getElementById('userPhone').value,
                role: document.getElementById('userRole').value,
                status: document.getElementById('userStatus').value,
                avatar: document.getElementById('userAvatar').value || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
            };

            if (currentEditId) {
                const userIndex = users.findIndex(u => u.id === currentEditId);
                users[userIndex] = { ...users[userIndex], ...userData };
            } else {
                const newUser = {
                    id: Math.max(...users.map(u => u.id)) + 1,
                    ...userData
                };
                users.push(newUser);
            }

            renderUsers();
            closeModal('userModal');
        });
    }

    // Click outside modal to close
    window.onclick = function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                closeModal(modal.id);
            }
        });
    };

    // Initial render
    renderUsers();
	const searchInput = document.getElementById('searchInput');
	        searchInput.addEventListener('input', function() {
	           searchUsers;
	        });

    // Make functions globally available
    window.viewUser = viewUser;
    window.editUser = editUser;
    window.deleteUser = deleteUser;
    window.confirmDelete = confirmDelete;
    window.searchUsers = searchUsers;
    window.openAddUserModal = openAddUserModal;
    window.openModal = openModal;
    window.closeModal = closeModal;
}
