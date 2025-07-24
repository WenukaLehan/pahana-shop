function initUserManagement() {
    let users = [
        // Initial dummy data (will be replaced by loadUsers from servlet)
    ];

    let currentEditId = null;
    let deleteUserId = null;

    /**
     * Renders user cards in the grid.
     * @param {Array} usersToRender - The array of users to display.
     */
    function renderUsers(usersToRender = users) {
        const usersGrid = document.getElementById('usersGrid');
        if (!usersGrid) return;
        usersGrid.innerHTML = '';

        if (usersToRender.length === 0) {
            usersGrid.innerHTML = '<p style="color: var(--text-muted); text-align: center; grid-column: 1 / -1;">No users found.</p>';
            return;
        }

        usersToRender.forEach(user => {
            const userCard = document.createElement('div');
            userCard.className = 'user-card';
            // Use placeholder image if no specific image path is available
            const avatarSrc = user.id && window.contextPath ? `${window.contextPath}/GetProImage?id=${user.id}` : `https://placehold.co/80x80/CCCCCC/000000?text=${user.name.charAt(0).toUpperCase()}`;
            userCard.innerHTML = `
                <img src="${avatarSrc}" alt="${user.name}" class="user-avatar" onerror="this.onerror=null;this.src='https://placehold.co/80x80/CCCCCC/000000?text=${user.name.charAt(0).toUpperCase()}';">
                <h4 class="user-name">${user.name}</h4>
                <p class="user-email">${user.email}</p>
                <p class="user-role">${user.acc_nu || 'N/A'}</p>
                <span class="user-status status-${user.status}">${user.status}</span>
                <div class="user-actions">
                    <button class="btn btn-small btn-view" onclick="viewUser('${user.id}')">View</button>
                    <button class="btn btn-small btn-edit" onclick="editUser('${user.id}')">Edit</button>
                    <button class="btn btn-small btn-delete" onclick="deleteUser('${user.id}')">Delete</button>
                </div>
            `;
            usersGrid.appendChild(userCard);
        });
    }

    /**
     * Loads users from the servlet via an AJAX POST request.
     */
    function loadUsers() {
        showLoadingModal('Loading Users...', 'Fetching user data from server.');
        try {
            $.post(`${window.contextPath}/CustomerServlet`, { action: 'getAllCustomers' }, (response) => {
                hideLoadingModal();
                if (response.success && Array.isArray(response.data) && response.data.length > 0) {
                    users = response.data.map(user => ({
                        id: user.u_id,
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        acc_nu: user.acc_nu,
                        status: user.status,
                        address: user.address || '',
                    }));
                    renderUsers(users);
                    showNotification('success', 'Users loaded successfully!');
                } else {
                    console.warn("No users found or error in response:", response.message);
                    renderUsers([]); // Render empty grid if no users
                    showNotification('info', 'No users found.', 3000);
                }
            }, 'json').fail(function (xhr, status, error) {
                hideLoadingModal();
                console.error("Error fetching users:", status, error);
                showNotification('error', 'Error loading users. Please try again.', 4000);
            });
        } catch (e) {
            hideLoadingModal();
            console.error("Error loading users:", e);
            showNotification('error', 'An unexpected error occurred while loading users.', 4000);
        }
    }

    /**
     * Opens a specified modal.
     * @param {string} modalId - The ID of the modal to open.
     */
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        modal.style.display = 'flex'; // Use flex for centering
        setTimeout(() => modal.classList.add('show'), 10);
    }

    /**
     * Closes a specified modal.
     * @param {string} modalId - The ID of the modal to close.
     */
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = 'none', 300); // Wait for animation to complete
        if (modalId === 'userModal') {
            document.getElementById('userForm').reset();
            document.getElementById('avatarPreview').style.display = 'none';
            document.getElementById('avatarPreview').src = '';
            currentEditId = null; // Clear editing state
        }
    }

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
     * Opens the modal for adding a new user.
     */
    function openAddUserModal() {
        document.getElementById('modalTitle').textContent = 'Add New User';
        document.getElementById('submitBtn').textContent = 'Add User';
        document.getElementById('userForm').reset();
        document.getElementById('avatarPreview').style.display = 'none';
        document.getElementById('avatarPreview').src = '';
        currentEditId = null;
        openModal('userModal');
    }

    /**
     * Opens the modal for editing an existing user.
     * @param {string} id - The ID of the user to edit.
     */
    function editUser(id) {
        const user = users.find(u => u.id === String(id));
        if (!user) {
            console.error(`User with ID ${id} not found.`);
            showNotification('error', 'User not found. Cannot edit.', 4000);
            return;
        }

        document.getElementById('modalTitle').textContent = 'Edit User';
        document.getElementById('submitBtn').textContent = 'Update User';
        document.getElementById('nameCus').value = user.name;
        document.getElementById('emailCus').value = user.email;
        document.getElementById('userPhone').value = user.phone;
        document.getElementById('userRole').value = 3; // Assuming 'customer' role is always 3
        document.getElementById('userStatus').value = user.status;
        document.getElementById('userAddress').value = user.address || '';

        // Set avatar preview if available
        const avatarPreview = document.getElementById('avatarPreview');
        if (user.id && window.contextPath) {
            avatarPreview.src = `${window.contextPath}/GetProImage?id=${user.id}`;
            avatarPreview.style.display = 'block';
        } else {
            avatarPreview.style.display = 'none';
            avatarPreview.src = '';
        }

        currentEditId = id;
        openModal('userModal');
    }

    /**
     * Opens the modal to view details of a specific user.
     * @param {string} id - The ID of the user to view.
     */
    function viewUser(id) {
        const user = users.find(u => u.id === String(id));
        if (!user) {
            console.error(`User with ID ${id} not found.`);
            showNotification('error', 'User not found. Cannot view details.', 4000);
            return;
        }

        const userDetails = document.getElementById('userDetails');
        // Use placeholder image if no specific image path is available
        const avatarSrc = user.id && window.contextPath ? `${window.contextPath}/GetProImage?id=${user.id}` : `https://placehold.co/120x120/CCCCCC/000000?text=${user.name.charAt(0).toUpperCase()}`;
        userDetails.innerHTML = `
            <div class="user-detail-section">
                <img src="${avatarSrc}" alt="${user.name}" class="user-detail-avatar" onerror="this.onerror=null;this.src='https://placehold.co/120x120/CCCCCC/000000?text=${user.name.charAt(0).toUpperCase()}';">
                <h4 class="user-detail-name">${user.name}</h4>
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
                <span class="user-detail-label">Account No:</span>
                <span class="user-detail-value">${user.acc_nu || 'N/A'}</span>
            </div>
            <div class="user-detail-info">
                <span class="user-detail-label">Address:</span>
                <span class="user-detail-value">${user.address}</span>
            </div>
            <div class="user-detail-info">
                <span class="user-detail-label">Status:</span>
                <span class="user-detail-value status-${user.status}">${user.status}</span>
            </div>
        `;
        openModal('viewModal');
    }

    /**
     * Sets the user ID for deletion and opens the confirmation modal.
     * @param {string} id - The ID of the user to be deleted.
     */
    function deleteUser(id) {
        deleteUserId = id;
        openModal('confirmModal');
    }

    /**
     * Handles the actual deletion of a user after confirmation.
     * Simulates a loading state during deletion.
     */
    function confirmDelete() {
        if (deleteUserId) {
            showLoadingModal('Deleting User...', 'Please wait, removing user from database.');
            closeModal('confirmModal'); // Close confirm modal immediately

            // Add animation class to the card before deleting
            const cardToRemove = document.querySelector(`.user-card[data-id="${deleteUserId}"]`);
            if (cardToRemove) {
                cardToRemove.classList.add('deleting');
            }

            try {
                $.post(`${window.contextPath}/CustomerServlet`, { action: 'deleteCustomer', id: deleteUserId }, (response) => {
                    hideLoadingModal();
                    if (response.success) {
                        showNotification('success', "User deleted successfully!");
                        // Remove the user from the local array immediately for faster UI update
                        users = users.filter(u => u.id !== deleteUserId);
                        renderUsers(); // Re-render the grid
                    } else {
                        showNotification('error', "Error deleting user: " + response.message, 4000);
                    }
                }, 'json').fail(function (xhr, status, error) {
                    hideLoadingModal();
                    showNotification('error', "An error occurred while deleting the user. Please try again.", 4000);
                    console.error("Error:", status, error);
                });
            } catch (e) {
                hideLoadingModal();
                console.error("Error confirming delete:", e);
                showNotification('error', "An unexpected error occurred during deletion.", 4000);
            } finally {
                deleteUserId = null; // Reset delete ID regardless of success/failure
            }
        }
    }

    /**
     * Shows the loading modal with a customizable title and message.
     * @param {string} title - The title for the loading modal.
     * @param {string} message - The message for the loading modal.
     */
    function showLoadingModal(title = 'Processing...', message = 'Please wait while we complete the operation.') {
        const loadingModal = document.getElementById('loadingModal');
        const loadingTitle = document.getElementById('loadingTitle');
        const loadingMessage = document.getElementById('loadingMessage');

        loadingTitle.textContent = title;
        loadingMessage.textContent = message;
        loadingModal.classList.add('show');
    }

    /**
     * Hides the loading modal.
     */
    function hideLoadingModal() {
        const loadingModal = document.getElementById('loadingModal');
        loadingModal.classList.remove('show');
    }

    /**
     * Filters and renders users based on the search input.
     */
    function searchUsers() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const filteredUsers = users.filter(user =>
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            (user.acc_nu && user.acc_nu.toLowerCase().includes(searchTerm)) ||
            user.phone.toLowerCase().includes(searchTerm) ||
            user.address.toLowerCase().includes(searchTerm)
        );
        renderUsers(filteredUsers);
    }

    // Handle form submission for adding/updating users
	const userForm = document.getElementById('userForm');
	if (userForm) {
	    userForm.addEventListener('submit', function (e) {
	        e.preventDefault();
	        showLoadingModal("Processing...", "Please wait while we save the user data.");
	        const name = document.getElementById('nameCus').value;
	        const email = document.getElementById('emailCus').value;
	        const phone = document.getElementById('userPhone').value;
	        const status = document.getElementById('userStatus').value;
	        const address = document.getElementById('userAddress').value;
	        const image = document.getElementById('userAvatar').files[0];

	        if (!name || !email || !phone || !status || !address) {
	            showNotification('error', "Please fill in all fields.");
	            hideLoadingModal();
	            return;
	        }

	        const formData = new FormData();
	        formData.append('name', name);
	        formData.append('email', email);
	        formData.append('phone', phone);
	        formData.append('status', status);
	        formData.append('address', address);
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
	        }
	        formData.append('action', currentEditId ? 'updateCustomer' : 'addCustomer');

	        $.ajax({
	            url: `${window.contextPath}/CustomerServlet`,
	            type: 'POST',
	            data: formData,
	            contentType: false,
	            enctype: 'multipart/form-data',
	            processData: false,
	            success: function (response) {
	                hideLoadingModal();
	                if (response.success) {
	                    showNotification('success', currentEditId ? "User updated successfully!" : "User added successfully!");
	                    closeModal('userModal');
	                    loadUsers();
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
	        closeModal('userModal');
	        currentEditId = null;
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

    // Initial render and load users
    loadUsers();

    // Event listener for search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', searchUsers);
    }

    // Event listener for avatar preview
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

    // Make functions globally available for HTML onclick attributes
    window.viewUser = viewUser;
    window.editUser = editUser;
    window.deleteUser = deleteUser;
    window.confirmDelete = confirmDelete;
    window.searchUsers = searchUsers;
    window.openAddUserModal = openAddUserModal;
    window.openModal = openModal;
    window.closeModal = closeModal;
    window.showLoadingModal = showLoadingModal; // Expose if needed globally
    window.hideLoadingModal = hideLoadingModal; // Expose if needed globally
    window.showNotification = showNotification; // Expose if needed globally
}

