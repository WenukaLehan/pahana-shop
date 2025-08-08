document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.list');
    const pageTitle = document.getElementById('pageTitle');
    const pageContent = document.getElementById('pageContent');
    const userAvatar = document.querySelector('.user1-avatar');
    const userProfileContainer = document.getElementById('userProfileContainer');

    const pageTitles = {
        users: 'User Management',
        books: 'Book Management',
        cart: 'Shopping Cart',
        reports: 'System Reports',
        settings: 'System Settings'
    };

    const loadContent = (page) => {
        if (!page || page.trim() === '') {
            console.error('Invalid page name provided:', page);
            return;
        }

        const url = `${page}.jsp`;
        const title = pageTitles[page] || 'Dashboard';

        pageContent.style.opacity = '0';
        pageTitle.style.opacity = '0';

        fetch(url, { signal: AbortSignal.timeout(5000) })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Page not found: ${response.statusText} (Status: ${response.status})`);
                }
                return response.text();
            })
            .then(html => {
                setTimeout(() => {
                    pageTitle.textContent = title;
                    pageContent.innerHTML = html;
                    pageContent.style.opacity = '1';
                    pageTitle.style.opacity = '1';

                    const scriptMap = {
                        users: { src: '../js/users.js', init: 'initUserManagement' },
                        books: { src: '../js/books.js', init: 'initBookManagement' },
                        cart: { src: '../js/cart.js', init: 'initPurchaseManagement' },
                        reports: { src: '../js/reports.js', init: 'initReportsManagement' },
                        settings: { src: '../js/settings.js', init: 'initSettingsManagement' }
                    };

                    const pageScript = scriptMap[page];
                    if (pageScript) {
                        if (typeof window[pageScript.init] === 'function') {
                            window[pageScript.init]();
                        } else {
                            const existingScript = document.querySelector(`script[src="${pageScript.src}"]`);
                            if (existingScript) {
                                existingScript.remove();
                            }

                            const script = document.createElement('script');
                            script.src = pageScript.src;
                            script.onload = () => {
                                if (typeof window[pageScript.init] === 'function') {
                                    window[pageScript.init]();
                                } else {
                                    console.error(`Initialization function '${pageScript.init}' not found after loading ${pageScript.src}`);
                                }
                            };
                            script.onerror = () => console.error(`Failed to load ${pageScript.src}`);
                            document.body.appendChild(script);
                        }
                    }
                }, 300);
            })
            .catch(error => {
                console.error('Failed to fetch page:', error);
                setTimeout(() => {
                    pageTitle.textContent = 'Error';
                    pageContent.innerHTML = `
                        <div class="welcome-message" style="text-align: center; padding: 20px; color: #fff; background-color: rgba(255, 0, 0, 0.5); border-radius: 10px;">
                            <h3 style="color: white; margin-bottom: 10px;">Content Not Found</h3>
                            <p>Could not load content for '${page}'. Please ensure the file '${page}.jsp' exists and is accessible.</p>
                            <p>Error details: ${error.message}</p>
                        </div>`;
                    pageContent.style.opacity = '1';
                    pageTitle.style.opacity = '1';
                }, 300);
            });
    };

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            if (item.classList.contains('active')) return;

            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            const page = item.getAttribute('data-page');
            if (page && page.trim() !== '') {
                loadContent(page);
            } else {
                console.error('Navigation item is missing a valid "data-page" attribute.');
            }
        });
    });

    // Toggle user profile container on avatar click
    userAvatar.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent click from bubbling to document
		getData();
        userProfileContainer.style.display = userProfileContainer.style.display === 'block' ? 'none' : 'block';
        userProfileContainer.style.opacity = userProfileContainer.style.display === 'block' ? '1' : '0';
        userProfileContainer.style.transform = userProfileContainer.style.display === 'block' ? 'translateY(0)' : 'translateY(-10px)';
    });
	
	getData = () => {
		$.post(window.contextPath + '/user', { action: 'getUserInfo' }, (response) => {
			if (response.success) {
				const userInfo = response.data;
				document.getElementById('userName').textContent = userInfo.name || 'User';
				document.getElementById('userEmail').textContent = userInfo.email || '';
			}
			else {
				console.error('Failed to fetch user info:', response.message);
				}
		}).fail(() => {
					console.error('Failed to fetch user info due to network error.');
              }
		);
	}

    // Hide user profile container when clicking outside
    document.addEventListener('click', (e) => {
        if (!userAvatar.contains(e.target) && !userProfileContainer.contains(e.target)) {
            userProfileContainer.style.display = 'none';
            userProfileContainer.style.opacity = '0';
            userProfileContainer.style.transform = 'translateY(-10px)';
        }
    });

    window.openLogoutConfirmModal = () => {
        const modal = document.getElementById('logoutConfirmModal');
        modal.style.display = 'block';
        setTimeout(() => modal.classList.add('show'), 10);
    };

    window.closeModal = (modalId) => {
        const modal = document.getElementById(modalId);
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = 'none', 300);
    };

    window.confirmLogout = () => {
		$.post(window.contextPath + '/user', { action: 'logout' }, (response) => {
		    if (response.success) {
		        window.location.href = window.contextPath + '/views/Login.jsp';
		    } else {
		        alert('Logout failed. Please try again.');
		        console.error('Logout error:', response.message);
		    }
		}).fail(() => {
		    alert('Logout failed. Please try again.');
		});

		closeModal('logoutConfirmModal');
    };

    pageContent.style.transition = 'opacity 0.3s ease-in-out';
    pageTitle.style.transition = 'opacity 0.3s ease-in-out';

    loadContent('users');
});