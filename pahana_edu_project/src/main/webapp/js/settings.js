function initSettingsManagement() {
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

    let employees = [];
    let currentPage = 1;
    const entriesPerPage = 10;

    // Show/Hide Loading Modal
    function showLoadingModal(show) {
        loadingModal.classList.toggle('show', show);
    }
	
	//load setting data 
	function loadSettingsData() {
	    try {
            $.get(window.contextPath + '/SettingServlet', {}, function(data) {
				//console.log("System settings data:", data);
                if(data) {
                    systemSettings.lowStockAlert.checked = data.LowStock || false;
                    systemSettings.emailNotifications.checked = data.EmailNot || false;
                    systemSettings.autoBackups.checked = data.AtuBackup || false;
                } else {
                    console.error("System settings data not found.");
                }
            }).fail(function(xhr, status, error) {
                console.error("Error fetching system settings:", status, error);
            });
        } catch (e) {
            console.error("Error loading settings data:", e);
        }
    }
	loadSettingsData();
	
	// Profile Picture Upload Handler
	profileForm.profilePicture.addEventListener('change', (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = function(e) {
				profileForm.imagePreview.src = e.target.result;
			    profileForm.imagePreview.style.display = 'block';
			}
			reader.readAsDataURL(file);
		}
	});
	// Employee Profile Picture Upload Handler
	employeeForm.profilePicture.addEventListener('change', (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = function(e) {
				employeeForm.imagePreview.src = e.target.result;
                employeeForm.imagePreview.style.display = 'block';
			}
			reader.readAsDataURL(file);
		}
	});
	
	// Initialize Profile Form with Sample Data
	function initializeProfileForm() {
		try{
			profileForm.imagePreview.src = window.contextPath + '/GetProImage?id=' + window.userId + '&action=user';
			profileForm.imagePreview.style.display = 'block';
			
			$.post(window.contextPath + '/user', {action : 'getUserInfo'}, function(data) {
			    if(data.success) {
                    profileForm.fullName.value = data.data.name || '';
                    profileForm.email.value = data.data.email || '';
                    profileForm.phone.value = data.data.phone || '';
                    profileForm.username.value = data.data.username || '';
                } else {
                    console.error("User profile data not found.");
                }
            }).fail(function(xhr, status, error) {
				
				  console.error("Error fetching user profile:", status, error);
            });
		
			
		}
		catch(e){
            console.error("Error initializing profile form:", e);
        }
	}
	initializeProfileForm();	

    // Profile Settings Handlers
    profileForm.saveBtn.addEventListener('click', () => {
        showLoadingModal(true);
        setTimeout(() => {
            const profileData = {
                fullName: profileForm.fullName.value,
                email: profileForm.email.value,
                phone: profileForm.phone.value,
                username: profileForm.username.value
            };
            console.log('Saving profile:', profileData);
            // Simulate API call
            setTimeout(() => {
                showLoadingModal(false);
                alert('Profile updated successfully!');
            }, 1000);
        }, 500);
    });

    profileForm.cancelBtn.addEventListener('click', () => {
        profileForm.fullName.value = '';
        profileForm.email.value = '';
        profileForm.phone.value = '';
        profileForm.username.value = '';
    });

    // Employee Management Handlers
    employeeForm.addBtn.addEventListener('click', () => {
        if (!employeeForm.name.value || !employeeForm.email.value || !employeeForm.phone.value || !employeeForm.role.value || !employeeForm.username.value || !employeeForm.profilePicture.files.length) {
            alert('Please fill all required fields.');
            return;
        }

        showLoadingModal(true);
        setTimeout(() => {
            const newEmployee = {
                name: employeeForm.name.value,
                email: employeeForm.email.value,
                role: employeeForm.role.value,
                phone: employeeForm.phone.value,
                username: employeeForm.username.value,
				image : employeeForm.profilePicture.files[0]
            };
			
			try {
			    const formData = new FormData();
			    formData.append("action", "addUser");
			    formData.append("username", newEmployee.username);
			    formData.append("email", newEmployee.email);
			    formData.append("name", newEmployee.name);
			    formData.append("role", newEmployee.role); // make sure it's a number
			    formData.append("phone", newEmployee.phone);
			    formData.append("image", newEmployee.image); // should be a File object

			    fetch(window.contextPath + '/SettingServlet', {
			        method: 'POST',
			        body: formData
			    })
			    .then(response => response.json())
			    .then(response => {
			        if (response.success) {
			            console.log("New employee added successfully");
			        } else {
			            console.error("Failed to add new employee:", response.message);
			        }
			    })
			    .catch(error => {
			        console.error("Error adding new employee:", error);
			    });
			} catch (e) {
			    console.error("Error creating new employee:", e);
			}

			
			fetchEmployee();
            updateEmployeeTable();
            employeeForm.name.value = '';
            employeeForm.email.value = '';
            employeeForm.role.value = 'admin';
            employeeForm.phone.value = '';
            showLoadingModal(false);
            alert('Employee added successfully!');
        }, 1000);
    });
	
	// Fetch Employees from Server\
	function fetchEmployee() {
		try {
            $.post(window.contextPath + '/SettingServlet', {action: 'getAllUsers'}, function(data) {
				console.log("Fetched employees data:", data);
                if (data) {
                    employees = data.data || [];
                    updateEmployeeTable();
                } else {
                    console.error("Failed to fetch employees:", data.message);
                }
            }).fail(function(xhr, status, error) {
                console.error("Error fetching employees:", status, error);
            });
        } catch (e) {
			console.error("Error fetching employees:", e);
		}
	}
	
	fetchEmployee();

    // Employee Table Functions
    function updateEmployeeTable(searchTerm = '') {
        const filteredEmployees = employees.filter(emp => 
            emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.role.toLowerCase().includes(searchTerm.toLowerCase())
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
                <td>${emp.name}</td>
                <td>${emp.email}</td>
                <td>${emp.role.charAt(0).toUpperCase() + emp.role.slice(1)}</td>
                <td>${emp.phone}</td>
                <td><span class="status-badge status-${emp.status}">${emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}</span></td>
                <td>
                    <svg class="action-icon deactivate" data-id="${emp.id}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#e74c3c">
                        <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
                    </svg>
                </td>
            `;
            employeeTable.tableBody.appendChild(row);
        });

        updatePagination(filteredEmployees.length);

        // Add event listeners for deactivate buttons
        document.querySelectorAll('.action-icon.deactivate').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.closest('.deactivate').dataset.id);
                const employee = employees.find(emp => emp.id === id);
                if (employee) {
                    showLoadingModal(true);
                    setTimeout(() => {
                        employee.status = employee.status === 'active' ? 'inactive' : 'active';
                        updateEmployeeTable(employeeTable.searchInput.value);
                        showLoadingModal(false);
                        alert(`Employee ${employee.status === 'active' ? 'activated' : 'deactivated'} successfully!`);
                    }, 1000);
                }
            });
        });
    }

    function updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / entriesPerPage);
        employeeTable.paginationInfo.textContent = `Showing ${Math.min((currentPage - 1) * entriesPerPage + 1, totalItems)} to ${Math.min(currentPage * entriesPerPage, totalItems)} of ${totalItems} entries`;
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
        setTimeout(() => {
            const settingsData = {
                stockAlerts: systemSettings.lowStockAlert.checked,
                email: systemSettings.emailNotifications.checked,
                backup: systemSettings.autoBackups.checked
            };
            console.log('Saving system settings:', settingsData);
            // Simulate API call
			for (const key in settingsData) {
				try{
					
				    $.post(window.contextPath + '/SettingServlet', {action: 'updateSettings', name: key, value: settingsData[key]}, function(response) {
                        if (response.success) {
                            console.log(`Setting ${key} updated successfully.`);
                        } else {
                            console.error(`Failed to update setting ${key}:`, response.message);
                        }
                    }).fail(function(xhr, status, error) {
                        console.error(`Error updating setting ${key}:`, status, error);
                    });
				}
				catch(e){
                    console.error(`Error updating setting ${key}:`, e);
                }
			}
            setTimeout(() => {
                showLoadingModal(false);
                alert('System settings updated successfully!');
            }, 1000);
        }, 500);
    });
}