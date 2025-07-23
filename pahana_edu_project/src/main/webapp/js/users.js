function initUserManagement() {
    let users = [
        {
            id: 1,
            name: "John Doe",
            email: "john.doe@example.com",
            phone: "+1-234-567-8900",
            acc_nu: "0927387",
            status: "active",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
        },
        {
            id: 2,
            name: "Jane Smith",
            email: "jane.smith@example.com",
            phone: "+1-234-567-8901",
            acc_nu: "9736712",
            status: "active",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
        },
        {
            id: 3,
            name: "Mike Johnson",
            email: "mike.johnson@example.com",
            phone: "+1-234-567-8902",
            acc_nu: "0937612",
            status: "inactive",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
        },
        {
            id: 4,
            name: "Sarah Wilson",
            email: "sarah.wilson@example.com",
            phone: "+1-234-567-8903",
            acc_nu: "08117987",
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
                <img src="${window.contextPath}/GetProImage?id=${user.id}" alt="${user.name}" class="user-avatar">
                <div class="user-name">${user.name}</div>
                <div class="user-email">${user.email}</div>
                <div class="user-role">${user.acc_nu}</div>
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
	
	function loadUsers() {
	    try {
	        $.post(`${window.contextPath}/CustomerServlet`, { action: 'getAllCustomers' }, (response) => {
	            if (response.success && Array.isArray(response.data) && response.data.length > 0) {
	                users = response.data.map(user => ({
	                    id: user.u_id,
	                    name: user.name,
	                    email: user.email,
	                    phone: user.phone,
	                    acc_nu: user.acc_nu,
	                    status: user.status,
	                    avatar: user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
	                }));
	                renderUsers(users);
	            } else {
	                console.warn("No users found.");
	            }
	        }, 'json').fail(function (xhr, status, error) {
	            console.error("Error fetching users:", status, error);
	        });
	    } catch (e) {
	        console.error("Error loading users:", e);
	    }
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
        if (!user) {
			console.error(`User with ID ${id} not found.`);
			return
		};

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
                <span class="user-detail-label">Account No:</span>
                <span class="user-detail-value">${user.acc_nu}</span>
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
	    userForm.addEventListener('submit', function (e) {
	        e.preventDefault();
			const name = document.getElementById('nameCus').value;
			const email = document.getElementById('emailCus').value;
			const phone = document.getElementById('userPhone').value;
			const status = document.getElementById('userStatus').value;
			const address = document.getElementById('userAddress').value;
			const image = document.getElementById('userAvatar').files[0];
			
			if (!name || !email || !phone || !status || !address) {
				alert("Please fill in all fields.");
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
					alert("Please select a PNG image.");
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
					if (response.success) {
                        alert(currentEditId ? "User updated successfully!" : "User added successfully!");
                        closeModal('userModal');
                        loadUsers();
                    } else {
                        alert("Error: " + response.message);
                    }
				},
				error: function (xhr, status, error) {
					alert("An error occurred while processing your request. Please try again.");
					console.error("Error:", status, error);
				}
			});
			closeModal('userModal');
			currentEditId = null; // Reset after submission
			
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
	loadUsers();
    //renderUsers();
	
	const searchInput = document.getElementById('searchInput');
	        searchInput.addEventListener('input', function() {
	           searchUsers;
	});


			document.getElementById('userAvatar').addEventListener('change', function () {
			    const file = this.files[0];
			    if (file && file.type === 'image/png') {
			        const reader = new FileReader();
			        reader.onload = function (e) {
			            const preview = document.getElementById('avatarPreview');
			            preview.src = e.target.result;
			            preview.style.display = 'block';
			        };
			        reader.readAsDataURL(file);
			    } else {
			        alert("Please select a PNG image.");
			        this.value = ''; // reset file input
			        document.getElementById('avatarPreview').style.display = 'none';
			    }
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
