/**
 * Initializes all settings management functionalities including
 * profile settings, employee management, and system settings.
 * It handles form submissions, data fetching from a servlet,
 * and dynamic table rendering with pagination and searching.
 */
function initSettingsManagement() {
    // --- DOM Element Mappings ---

    // Profile Settings
    const profileForm = {
        fullName: document.getElementById('fullName'),
        email: document.getElementById('email'),
        phone: document.getElementById('phone'),
        username: document.getElementById('username'),
        saveBtn: document.getElementById('saveProfileBtn'),
        cancelBtn: document.getElementById('cancelProfileBtn'),
        profilePicture: document.getElementById('profilePicture'),
        imagePreview: document.getElementById('profileImagePreview')
    };

    // Employee Management
    const employeeForm = {
        name: document.getElementById('employeeName'),
        email: document.getElementById('employeeEmail'),
        role: document.getElementById('employeeRole'),
        username: document.getElementById('employeeUsername'),
        profilePicture: document.getElementById('employeeProfilePicture'),
        imagePreview: document.getElementById('employeeProfileImagePreview'),
        phone: document.getElementById('employeePhone'),
        addBtn: document.getElementById('addEmployeeBtn')
    };

    const employeeTable = {
        tableBody: document.getElementById('employeeTableBody'),
        searchInput: document.getElementById('employeeSearch'),
        prevBtn: document.getElementById('employeePrevBtn'),
        nextBtn: document.getElementById('employeeNextBtn'),
        paginationInfo: document.getElementById('employeePaginationInfo'),
        paginationNumbers: document.getElementById('employeePaginationNumbers')
    };

    // System Settings
    const systemSettings = {
        lowStockAlert: document.getElementById('lowStockAlert'),
        emailNotifications: document.getElementById('emailNotifications'),
        autoBackups: document.getElementById('autoBackups'),
        saveBtn: document.getElementById('saveSystemSettingsBtn')
    };

    const loadingModal = document.getElementById('loadingModal');

    // --- State Variables ---
    let employees = [];
    let currentPage = 1;
    const entriesPerPage = 10;

    // --- Helper Functions ---
	
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
     * Toggles the visibility of the loading modal.
     * @param {boolean} show - True to show the modal, false to hide.
     */
    function showLoadingModal(show) {
        loadingModal.classList.toggle('show', show);
    }

    /**
     * Displays an image preview when a file is selected.
     * @param {HTMLInputElement} fileInput - The file input element.
     * @param {HTMLImageElement} imagePreview - The image preview element.
     */
    function setupImagePreview(fileInput, imagePreview) {
        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // --- Data Fetching and Initialization ---

    /**
     * Loads system settings from the server and updates the UI.
     */
    function loadSettingsData() {
        try {
            $.get(window.contextPath + '/SettingServlet', {}, function(data) {
                if (data) {
                    systemSettings.lowStockAlert.checked = data.LowStock || false;
                    systemSettings.emailNotifications.checked = data.EmailNot || false;
                    systemSettings.autoBackups.checked = data.AtuBackup || false;
                } else {
                    console.error('System settings data not found.');
                }
            }).fail(function(xhr, status, error) {
                console.error('Error fetching system settings:', status, error);
            });
        } catch (e) {
            console.error('Error loading settings data:', e);
        }
    }

    /**
     * Initializes the profile form with data for the current user.
     */
    function initializeProfileForm() {
        try {
            profileForm.imagePreview.src = window.contextPath + '/GetProImage?id=' + window.userId + '&action=user';
            profileForm.imagePreview.style.display = 'block';

            $.post(window.contextPath + '/user', { action: 'getUserInfo' }, function(data) {
                if (data.success) {
                    profileForm.fullName.value = data.data.name || '';
                    profileForm.email.value = data.data.email || '';
                    profileForm.phone.value = data.data.phone || '';
                    profileForm.username.value = data.data.username || '';
                } else {
                    console.error('User profile data not found.');
                }
            }).fail(function(xhr, status, error) {
                console.error('Error fetching user profile:', status, error);
            });
        } catch (e) {
            console.error('Error initializing profile form:', e);
        }
    }

    /**
     * Fetches all employee data from the server and updates the table.
     */
    function fetchEmployees() {
        try {
            $.post(window.contextPath + '/SettingServlet', { action: 'getAllUsers' }, function(data) {
                if (data.success)  {
					console.log('Data received:', data);
                    employees = data.data || [];
                    // This is the crucial fix: call the update function here.
					console.log('Fetched employees:', employees);
                    updateEmployeeTable();
                } else {
                    console.error('Failed to fetch employees:', data.message);
                }
            }).fail(function(xhr, status, error) {
                console.error('Error fetching employees:', status, error);
            });
        } catch (e) {
            console.error('Error fetching employees:', e);
        }
    }

    // --- Event Handlers ---

    // Set up image previews for both profile and employee forms.
    setupImagePreview(profileForm.profilePicture, profileForm.imagePreview);
    setupImagePreview(employeeForm.profilePicture, employeeForm.imagePreview);

    // Profile Settings Handlers
    profileForm.saveBtn.addEventListener('click', () => {
        showLoadingModal(true);
        const formData = new FormData();
        formData.append('action', 'updateUser');
		formData.append('userId', window.userId); // Assuming window.userId is set to the current user's ID
        formData.append('name', profileForm.fullName.value);
        formData.append('email', profileForm.email.value);
        formData.append('phone', profileForm.phone.value);
        formData.append('username', profileForm.username.value);
        if (profileForm.profilePicture.files.length > 0) {
            formData.append('image', profileForm.profilePicture.files[0]);
        }

        fetch(window.contextPath + '/SettingServlet', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                showLoadingModal(false);
                if (data.success) {
                    showNotification('success', 'Profile updated successfully!');
                } else {
                    showNotification('error', 'Failed to update profile: ' + data.message);
                }
            })
            .catch(error => {
                showLoadingModal(false);
                console.error('Error saving profile:', error);
                alert('An error occurred while saving the profile.');
            });
    });

    profileForm.cancelBtn.addEventListener('click', () => {
        // Re-initialize the form to reset it to the original state
        initializeProfileForm();
    });

    // Employee Management Handlers
    employeeForm.addBtn.addEventListener('click', () => {
        if (!employeeForm.name.value || !employeeForm.email.value || !employeeForm.phone.value || !employeeForm.role.value || !employeeForm.username.value || !employeeForm.profilePicture.files.length) {
            alert('Please fill all required fields.');
            return;
        }

        showLoadingModal(true);
        const formData = new FormData();
        formData.append('action', 'addUser');
        formData.append('username', employeeForm.username.value);
        formData.append('email', employeeForm.email.value);
        formData.append('name', employeeForm.name.value);
        formData.append('role', employeeForm.role.value);
        formData.append('phone', employeeForm.phone.value);
        formData.append('image', employeeForm.profilePicture.files[0]);

        fetch(window.contextPath + '/SettingServlet', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                showLoadingModal(false);
                if (data.success) {
                    alert('Employee added successfully!');
                    employeeForm.name.value = '';
                    employeeForm.email.value = '';
                    employeeForm.role.value = 'admin'; // Reset to default
                    employeeForm.phone.value = '';
                    employeeForm.username.value = '';
                    employeeForm.profilePicture.value = ''; // Clear file input
                    employeeForm.imagePreview.src = '';
                    employeeForm.imagePreview.style.display = 'none';
                    fetchEmployees(); // Refresh the employee list
                } else {
                    alert('Failed to add employee: ' + data.message);
                }
            })
            .catch(error => {
                showLoadingModal(false);
                console.error('Error adding new employee:', error);
                alert('An error occurred while adding the employee.');
            });
    });

    // Employee Table Functions
    /**
     * Updates the employee table based on the current search term and page.
     * @param {string} [searchTerm=''] - The value to filter employees by.
     */
    function updateEmployeeTable(searchTerm = '') {
        const filteredEmployees = employees.filter(emp =>
            emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (emp.role && emp.role.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        const startIndex = (currentPage - 1) * entriesPerPage;
        const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + entriesPerPage);
        employeeTable.tableBody.innerHTML = '';

        if (filteredEmployees.length === 0) {
            employeeTable.tableBody.innerHTML = `
                <tr class="empty-row">
                    <td colspan="6" style="text-align: center; color: #666; padding: 40px;">
                        No employees available. Add a new employee above.
                    </td>
                </tr>
            `;
            updatePagination(filteredEmployees.length);
            return;
        }

        paginatedEmployees.forEach(emp => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><div class="user-cell"><img src="${window.contextPath}/GetProImage?id=${emp.id}&action=user" style="display:flex; max-height: 100px;max-width: 40px; margin-top: 10px;" alt="Profile" class="user-avatar">${emp.name}</div></td>
                <td>${emp.email}</td>
				<td>
				  ${emp.role == 1 ? 'Admin' : (emp.role == 2 ? 'Cashier' : (emp.role == 3 ? 'Customer' : 'N/A'))}
				</td>
                <td>${emp.phone}</td>
                <td><span class="status-badge status-${emp.status}">${emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}</span></td>
                <td>
					<button 
					  class="action-icon deactivate" 
					  data-id="${emp.id}" 
					  data-status="${emp.status}"
					  title="${emp.status === 'active' ? 'Deactivate' : 'Activate'} Employee"
					  ${emp.role == 1 ? 'disabled' : ''}>
					  
					  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${emp.status === 'active' ? '#e74c3c' : '#2ecc71'}">
					    <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
					  </svg>
					</button>
                </td>
            `;
            employeeTable.tableBody.appendChild(row);
        });

        updatePagination(filteredEmployees.length);

        // Add event listeners for the deactivate/activate buttons
        document.querySelectorAll('.action-icon.deactivate').forEach(btn => {
            btn.addEventListener('click', (e) => {
				alert('This action will change the status of the employee.');
                const id = parseInt(e.currentTarget.dataset.id);
				console.log('Button clicked for employee ID:', id);
				const status = e.currentTarget.dataset.status;
				console.log('Current status:', status);
                if (status) {
                    showLoadingModal(true);
                    const newStatus = status === 'active' ? 'inactive' : 'active';
                    $.post(window.contextPath + '/SettingServlet', { action: 'updateUserStatus', userId: id, status: newStatus })
                        .done(response => {
                            if (response.success) {
								fetchEmployees(); // Refresh the employee list
                                updateEmployeeTable(employeeTable.searchInput.value);
                                alert(`Employee ${newStatus}d successfully!`);
                            } else {
                                alert(`Failed to update employee status: ${response.message}`);
                            }
                        })
                        .fail((xhr, status, error) => {
                            console.error('Error updating employee status:', status, error);
                            alert('An error occurred while updating the employee status.');
                        })
                        .always(() => {
                            showLoadingModal(false);
                        });
                }
            });
        });
    }

    /**
     * Updates the pagination controls based on the total number of items.
     * @param {number} totalItems - The total count of items.
     */
    function updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / entriesPerPage);
        const startItem = Math.min((currentPage - 1) * entriesPerPage + 1, totalItems);
        const endItem = Math.min(currentPage * entriesPerPage, totalItems);
        employeeTable.paginationInfo.textContent = `Showing ${startItem} to ${endItem} of ${totalItems} entries`;
        employeeTable.prevBtn.disabled = currentPage === 1;
        employeeTable.nextBtn.disabled = currentPage === totalPages || totalPages === 0;

        employeeTable.paginationNumbers.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.classList.add('page-number');
            if (i === currentPage) pageBtn.classList.add('active');
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                updateEmployeeTable(employeeTable.searchInput.value);
            });
            employeeTable.paginationNumbers.appendChild(pageBtn);
        }
    }

    // Employee Table Event Listeners
    employeeTable.searchInput.addEventListener('input', (e) => {
        currentPage = 1;
        updateEmployeeTable(e.target.value);
    });

    employeeTable.prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updateEmployeeTable(employeeTable.searchInput.value);
        }
    });

    employeeTable.nextBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(employees.length / entriesPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            updateEmployeeTable(employeeTable.searchInput.value);
        }
    });

    // System Settings Handlers
    systemSettings.saveBtn.addEventListener('click', () => {
        showLoadingModal(true);
        const settingsData = {
            stockAlerts: systemSettings.lowStockAlert.checked,
            email: systemSettings.emailNotifications.checked,
            backup: systemSettings.autoBackups.checked
        };
        const updatePromises = Object.keys(settingsData).map(key => {
            return new Promise((resolve, reject) => {
                $.post(window.contextPath + '/SettingServlet', { action: 'updateSettings', name: key, value: settingsData[key] })
                    .done(response => {
                        if (response.success) {
                            resolve(`Setting ${key} updated successfully.`);
                        } else {
                            reject(`Failed to update setting ${key}: ${response.message}`);
                        }
                    })
                    .fail((xhr, status, error) => {
                        reject(`Error updating setting ${key}: ${status}, ${error}`);
                    });
            });
        });

        Promise.all(updatePromises)
            .then(results => {
                console.log('System settings updated successfully:', results);
                showLoadingModal(false);
                alert('System settings updated successfully!');
            })
            .catch(error => {
                console.error('An error occurred updating system settings:', error);
                showLoadingModal(false);
                alert('An error occurred while saving system settings. Please check the console for details.');
            });
    });

    // --- Initial Function Calls ---
    loadSettingsData();
    initializeProfileForm();
    // This is the correct way to start the process:
    fetchEmployees();
}