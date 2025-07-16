<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
     <link rel="icon" href="../images/icont.png" type="image/x-icon">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
    <title>Dashboard UI</title>
    <link rel="stylesheet" href="../css/a_dashboard.css">

    <script>
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
                const url = "" + page + ".jsp";
                const title = pageTitles[page] || "Dashboard";

                pageContent.style.opacity = '0';
                pageTitle.style.opacity = '0';

                fetch(url)
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
                            
                         	// Re-initialize users.js after content is loaded
	                         if (page === 'users') {
	                            if (typeof initUserManagement === "function") {
	                                initUserManagement();
	                            } else {
	                                const script = document.createElement('script');
	                                script.src = '../js/users.js';
	                                script.onload = () => {
	                                    if (typeof initUserManagement === "function") {
	                                        initUserManagement();
	                                    }
	                                };
	                                document.body.appendChild(script);
	                            }
	                         }
	                         else if (page === 'books') {
                                if (typeof initBookManagement === "function") {
                                    initBookManagement();
                                } else {
                                    const script = document.createElement('script');
                                    script.src = '../js/books.js';
                                    script.onload = () => {
                                        if (typeof initBookManagement === "function") {
                                            initBookManagement();
                                        }
                                    };
                                    document.body.appendChild(script);
                                }
	                         }
                         	                                else if (page === 'cart') {
                                    if (typeof initCartManagement === "function") {
                                        initCartManagement();
                                    } else {
                                        const script = document.createElement('script');
                                        script.src = '../js/cart.js';
                                        script.onload = () => {
                                            if (typeof initCartManagement === "function") {
                                                initCartManagement();
                                            }
                                        };
                                        document.body.appendChild(script);
                                    }
                                }
                                else if (page === 'reports') {
                                    if (typeof initReportManagement === "function") {
                                        initReportManagement();
                                    } else {
                                        const script = document.createElement('script');
                                        script.src = '../js/reports.js';
                                        script.onload = () => {
                                            if (typeof initReportManagement === "function") {
                                                initReportManagement();
                                            }
                                        };
                                        document.body.appendChild(script);
                                    }
                                }
                                else if (page === 'settings') {
                                    if (typeof initSettingsManagement === "function") {
                                        initSettingsManagement();
                                    } else {
                                        const script = document.createElement('script');
                                        script.src = '../js/settings.js';
                                        script.onload = () => {
                                            if (typeof initSettingsManagement === "function") {
                                                initSettingsManagement();
                                            }
                                        };
                                        document.body.appendChild(script);
                                    }
                                }
                            
                        }, 200);
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
                        }, 200);
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

            

            // Uncomment this if you want to load 'users' page by default
            // loadContent('users');
        });
    </script>
</head>
<body>
    <div class="navigation">
        <ul>
            <li class="list active" data-page="users">
                <a href="#">
                    <span class="icon"><ion-icon name="people-outline"></ion-icon></span>
                    <span class="text">Users</span>
                    <span class="tooltip">User Management</span>
                </a>
            </li>
            <li class="list" data-page="books">
                <a href="#">
                    <span class="icon"><ion-icon name="book-outline"></ion-icon></span>
                    <span class="text">Books</span>
                    <span class="tooltip">Book Management</span>
                </a>
            </li>
            <li class="list" data-page="cart">
                <a href="#">
                    <span class="icon"><ion-icon name="cart-outline"></ion-icon></span>
                    <span class="text">Cart</span>
                    <span class="tooltip">Shopping Cart</span>
                </a>
            </li>
            <li class="list" data-page="reports">
                <a href="#">
                    <span class="icon"><ion-icon name="reader-outline"></ion-icon></span>
                    <span class="text">Reports</span>
                    <span class="tooltip">View Reports</span>
                </a>
            </li>
            <li class="list" data-page="settings">
                <a href="#">
                    <span class="icon"><ion-icon name="settings-outline"></ion-icon></span>
                    <span class="text">Settings</span>
                    <span class="tooltip">System Settings</span>
                </a>
            </li>
            <div class="indicator"></div>
        </ul>
    </div>

    <div class="main-content">
        <div class="header">
            <div></div>
            <div class="panel-title" id="pageTitle">User Management</div>
            <div class="user1-avatar">
                <svg viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 
                        1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 
                        1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
            </div>
        </div>
        

        <div class="content-panel" id="contentPanel">
            <div class="panel-content" id="pageContent">
                <jsp:include page="users.jsp" />
            </div>
        </div>
    </div>

    <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
    <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
</body>
</html>
