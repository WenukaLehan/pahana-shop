
document.addEventListener('DOMContentLoaded', function () {
    const navItems = document.querySelectorAll('.list');
    const pageTitle = document.getElementById('pageTitle');
    const pageContent = document.getElementById('pageContent');

    const pageTitles = {
        users: "User Management",
        books: "Book Management",
        cart: "Shopping Cart",
        reports: "System Reports",
        settings: "System Settings"
    };

    const loadContent = (page) => {
        if (!page || page.trim() === "") {
            console.error('Invalid page name provided:', page);
            return;
        }
        const url = page + ".jsp";
        const title = pageTitles[page] || "Dashboard";

        pageContent.style.opacity = '0';
        pageTitle.style.opacity = '0';

        fetch(url, { signal: AbortSignal.timeout(5000) })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Page not found: ${response.statusText}`);
                }
                return response.text();
            })
            .then(html => {
                setTimeout(() => {
                    pageTitle.textContent = title;
                    pageContent.innerHTML = html;
                    pageContent.style.opacity = '1';
                    pageTitle.style.opacity = '1';

                    if (page === 'users') {
                        if (typeof initUserManagement === "function") {
                            initUserManagement();
                        } else {
                            const existingScript = document.querySelector('script[src="../js/users.js"]');
                            if (existingScript) existingScript.remove();
                            const script = document.createElement('script');
                            script.src = '../js/users.js';
                            script.onload = () => {
                                if (typeof initUserManagement === "function") {
                                    initUserManagement();
                                }
                            };
                            script.onerror = () => console.error('Failed to load users.js');
                            document.body.appendChild(script);
                        }
                    } else if (page === 'books') {
                        if (typeof initBookManagement === "function") {
                            initBookManagement();
                        } else {
                            const existingScript = document.querySelector('script[src="../js/books.js"]');
                            if (existingScript) existingScript.remove();
                            const script = document.createElement('script');
                            script.src = '../js/books.js';
                            script.onload = () => {
                                if (typeof initBookManagement === "function") {
                                    initBookManagement();
                                }
                            };
                            script.onerror = () => console.error('Failed to load books.js');
                            document.body.appendChild(script);
                        }
                    } else if (page === 'cart') {
						const loadCartScript = () => {
						       const existingScript = document.querySelector('script[src="../js/cart.js"]');
						       if (existingScript) existingScript.remove(); // remove old if exists

						       const script = document.createElement('script');
						       script.src = '../js/cart.js';
						       script.onload = () => {
						           console.log('cart.js loaded');
						           if (typeof initPurchaseManagement === "function") {
						               initPurchaseManagement();
						           } else {
						               console.error("initPurchaseManagement not found after loading cart.js");
						           }
						       };
						       script.onerror = () => console.error('Failed to load cart.js');
						       document.body.appendChild(script);
						   };

						   // Always load script when cart is selected (even if already loaded)
						   loadCartScript();
                    } else if (page === 'reports') {
                        if (typeof initReportManagement === "function") {
                            initReportManagement();
                        } else {
                            const existingScript = document.querySelector('script[src="../js/reports.js"]');
                            if (existingScript) existingScript.remove();
                            const script = document.createElement('script');
                            script.src = '../js/reports.js';
                            script.onload = () => {
                                if (typeof initReportManagement === "function") {
                                    initReportManagement();
                                }
                            };
                            script.onerror = () => console.error('Failed to load reports.js');
                            document.body.appendChild(script);
                        }
                    } else if (page === 'settings') {
                        if (typeof initSettingsManagement === "function") {
                            initSettingsManagement();
                        } else {
                            const existingScript = document.querySelector('script[src="../js/settings.js"]');
                            if (existingScript) existingScript.remove();
                            const script = document.createElement('script');
                            script.src = '../js/settings.js';
                            script.onload = () => {
                                if (typeof initSettingsManagement === "function") {
                                    initSettingsManagement();
                                }
                            };
                            script.onerror = () => console.error('Failed to load settings.js');
                            document.body.appendChild(script);
                        }
                    }
                }, 300);
            })
            .catch(error => {
                console.error('Failed to fetch page:', error);
                setTimeout(() => {
                    pageTitle.textContent = "Error";
                    pageContent.innerHTML = `
                        <div class="welcome-message">
                            <h3 style="color: white;">Content Not Found</h3>
                            <p>Could not load content for '${page}'. Please ensure the file '${page}.jsp' exists.</p>
                        </div>`;
                    pageContent.style.opacity = '1';
                    pageTitle.style.opacity = '1';
                }, 300);
            });
    };

    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            if (this.classList.contains('active')) return;

            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            const page = this.getAttribute('data-page');
            if (page && page.trim() !== "") {
                loadContent(page);
            } else {
                console.error('Navigation item is missing a valid "data-page" attribute.');
            }
        });
    });

    pageContent.style.transition = 'opacity 0.3s ease-in-out';
    pageTitle.style.transition = 'opacity 0.3s ease-in-out';

    loadContent('users');
});