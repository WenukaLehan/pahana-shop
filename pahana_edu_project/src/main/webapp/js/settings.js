function initSettingsManagement() {
    // Profile Settings
    const profileForm = {
        fullName: document.getElementById('fullName'),
        email: document.getElementById('email'),
        phone: document.getElementById('phone'),
        address: document.getElementById('address'),
        saveBtn: document.getElementById('saveProfileBtn'),
        cancelBtn: document.getElementById('cancelProfileBtn')
    };

    // Employee Management
    const employeeForm = {
        name: document.getElementById('employeeName'),
        email: document.getElementById('employeeEmail'),
        role: document.getElementById('employeeRole'),
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

    // Profile Settings Handlers
    profileForm.saveBtn.addEventListener('click', () => {
        showLoadingModal(true);
        setTimeout(() => {
            const profileData = {
                fullName: profileForm.fullName.value,
                email: profileForm.email.value,
                phone: profileForm.phone.value,
                address: profileForm.address.value
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
        profileForm.address.value = '';
    });

    // Employee Management Handlers
    employeeForm.addBtn.addEventListener('click', () => {
        if (!employeeForm.name.value || !employeeForm.email.value || !employeeForm.phone.value) {
            alert('Please fill all required fields.');
            return;
        }

        showLoadingModal(true);
        setTimeout(() => {
            const newEmployee = {
                id: employees.length + 1,
                name: employeeForm.name.value,
                email: employeeForm.email.value,
                role: employeeForm.role.value,
                phone: employeeForm.phone.value,
                status: 'active'
            };
            employees.push(newEmployee);
            updateEmployeeTable();
            employeeForm.name.value = '';
            employeeForm.email.value = '';
            employeeForm.role.value = 'admin';
            employeeForm.phone.value = '';
            showLoadingModal(false);
            alert('Employee added successfully!');
        }, 1000);
    });

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
                lowStockAlert: systemSettings.lowStockAlert.checked,
                emailNotifications: systemSettings.emailNotifications.checked,
                autoBackups: systemSettings.autoBackups.checked
            };
            console.log('Saving system settings:', settingsData);
            // Simulate API call
            setTimeout(() => {
                showLoadingModal(false);
                alert('System settings updated successfully!');
            }, 1000);
        }, 500);
    });
}