<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard UI</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(
                270deg,
                rgba(133, 72, 7, 1) 0%,
                rgba(31, 5, 2, 1) 73%
            );
            min-height: 100vh;
            display: flex;
        }

        /* Sidebar */
        .sidebar {
            width: 60px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            margin-left: 10px;
            padding: 20px 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            position: fixed;
            top: 50%;
            left: 20px;
            transform: translateY(-50%);
            height: auto;
            z-index: 1000;
        }

        .sidebar:hover {
            transform: translateY(-50%) translateX(2px);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .nav-item {
            width: 40px;
            height: 40px;
            background: transparent;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            color: #8B4513;
            z-index: 2;
        }

        .nav-item:hover {
            background: rgba(139, 69, 19, 0.1);
            transform: scale(1.1);
        }

        .nav-item.active {
            background: #8B4513;
            color: white;
            position: relative;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            transform: translateX(25px);
            box-shadow: 0 4px 15px rgba(139, 69, 19, 0.3);
        }

        .nav-item.active::before {
            content: '';
            position: absolute;
            left: -25px;
            top: 50%;
            transform: translateY(-50%);
            width: 50px;
            height: 50px;
            background: rgba(139, 69, 19, 0.1);
            border-radius: 50%;
            z-index: -1;
        }

        .nav-item svg {
            width: 25px;
            height: 25px;
            fill: currentColor;
        }

        /* Tooltip */
        .nav-item .tooltip {
            position: absolute;
            left: 70px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(45, 27, 15, 0.95);
            color: white;
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1001;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .nav-item .tooltip::before {
            content: '';
            position: absolute;
            left: -5px;
            top: 50%;
            transform: translateY(-50%);
            width: 0;
            height: 0;
            border-top: 5px solid transparent;
            border-bottom: 5px solid transparent;
            border-right: 5px solid rgba(45, 27, 15, 0.95);
        }

        .nav-item:hover .tooltip {
            opacity: 1;
            visibility: visible;
            left: 75px;
        }

        .nav-item.active:hover .tooltip {
            left: 100px;
        }

        /* Main Content */
        .main-content {
            flex: 1;
            padding: 20px;
            padding-left: 120px;
            display: flex;
            flex-direction: column;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }

        .user-avatar {
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .user-avatar:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(1.1);
        }

        .user-avatar svg {
            width: 20px;
            height: 20px;
            fill: white;
        }

        .content-panel {
            background-color: rgba(255, 255, 255, 0.31);
            backdrop-filter: blur(20px);
            border-radius: 25px;
            padding: 40px;
            flex: 1;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(139, 69, 19, 0.3);
            position: relative;
            overflow: hidden;
        }

        .content-panel::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.31) 0%, transparent 70%);
            animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(-20px, -20px) rotate(180deg); }
        }

        .panel-title {
            font-size: 32px;
            font-weight: 300;
            color: white;
            margin-bottom: 30px;
            position: relative;
            z-index: 1;
        }

        .panel-content {
            position: relative;
            z-index: 1;
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.6;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .sidebar {
                position: fixed;
                bottom: 20px;
                left: 50%;
                top: auto;
                transform: translateX(-50%);
                width: auto;
                height: 60px;
                flex-direction: row;
                justify-content: center;
                padding: 10px 20px;
                gap: 15px;
            }

            .sidebar:hover {
                transform: translateX(-50%) translateY(-2px);
            }

            .nav-item.active {
                transform: translateY(-15px);
            }

            .nav-item .tooltip {
                left: 50%;
                top: -40px;
                transform: translateX(-50%);
            }

            .nav-item .tooltip::before {
                left: 50%;
                top: 100%;
                transform: translateX(-50%);
                border-left: 5px solid transparent;
                border-right: 5px solid transparent;
                border-top: 5px solid rgba(45, 27, 15, 0.95);
                border-bottom: none;
            }

            .nav-item:hover .tooltip {
                left: 50%;
                top: -45px;
            }

            .nav-item.active:hover .tooltip {
                left: 50%;
                top: -50px;
            }

            .main-content {
                padding: 20px;
                padding-left: 20px;
                padding-bottom: 100px;
            }

            .content-panel {
                padding: 20px;
            }

            .panel-title {
                font-size: 24px;
            }
        }

        /* Additional UI Elements */
        .welcome-message {
            background: rgba(139, 69, 19, 0.3);
            border-radius: 15px;
            padding: 20px;
            margin-bottom: 20px;
            border-left: 4px solid rgba(139, 69, 19, 0.6);
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }

        .stat-card {
            background: rgba(139, 69, 19, 0.2);
            border-radius: 15px;
            padding: 20px;
            text-align: center;
            transition: all 0.3s ease;
            border: 1px solid rgba(139, 69, 19, 0.3);
        }

        .stat-card:hover {
            transform: translateY(-5px);
            background: rgba(139, 69, 19, 0.3);
            box-shadow: 0 8px 25px rgba(139, 69, 19, 0.2);
        }

        .stat-number {
            font-size: 24px;
            font-weight: bold;
            color: white;
            margin-bottom: 5px;
        }

        .stat-label {
            color: rgba(255, 255, 255, 0.7);
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="sidebar">
        <div class="nav-item active" data-page="users">
            <svg viewBox="0 0 24 24"><path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4c0-1.11.89-2 2-2s2 .89 2 2v4c0 1.11-.89 2-2 2s-2-.89-2-2zM10 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2z"/><circle cx="12" cy="12" r="3"/><path d="M12 15c-2.67 0-8 1.33-8 4v2h16v-2c0-2.67-5.33-4-8-4z"/></svg>
            <div class="tooltip">User Management</div>
        </div>
        
        <div class="nav-item" data-page="books">
            <svg viewBox="0 0 24 24"><path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/></svg>
            <div class="tooltip">Library Management</div>
        </div>
        
        <div class="nav-item" data-page="cart">
            <svg viewBox="0 0 24 24"><path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
            <div class="tooltip">Shopping Cart</div>
        </div>
        
        <div class="nav-item" data-page="files">
            <svg viewBox="0 0 24 24"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/></svg>
            <div class="tooltip">File Management</div>
        </div>
        
        <div class="nav-item" data-page="settings">
            <svg viewBox="0 0 24 24"><path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/></svg>
            <div class="tooltip">System Settings</div>
        </div>
    </div>

    <div class="main-content">
        <div class="header">
            <div></div>
            <div class="user-avatar">
                <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </div>
        </div>

        <div class="content-panel">
            <div class="panel-title" id="pageTitle">User Management</div>
            <div class="panel-content" id="pageContent">
                <!-- Initial content for the default active page -->
                <jsp:include page="users.jsp" />
            </div>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const navItems = document.querySelectorAll('.nav-item');
            const pageTitle = document.getElementById('pageTitle');
            const pageContent = document.getElementById('pageContent');

            // A mapping for page titles
            const pageTitles = {
                users: "User Management",
                books: "Library Management",
                cart: "Shopping Cart",
                files: "File Management",
                settings: "System Settings"
            };

            const loadContent = (page) => {
                const url = `${page}.jsp`; // Fetch .jsp files
                const title = pageTitles[page] || "Dashboard";

                // Fade out current content
                pageContent.style.opacity = '0';
                pageTitle.style.opacity = '0';

                fetch(url)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Failed to load page: ${response.statusText}`);
                        }
                        return response.text();
                    })
                    .then(html => {
                        // Use a short timeout to allow the fade-out transition to complete
                        setTimeout(() => {
                            // Remove previously added dynamic styles and scripts
                            document.querySelectorAll('[data-dynamic-resource]').forEach(el => el.remove());

                            // Use DOMParser to handle the fetched HTML string
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(html, 'text/html');

                            // Inject the new content
                            pageTitle.textContent = title;
                            pageContent.innerHTML = doc.body.innerHTML;

                            // Append new styles to the head
                            doc.querySelectorAll('style').forEach(styleTag => {
                                const newStyle = document.createElement('style');
                                newStyle.textContent = styleTag.textContent;
                                newStyle.setAttribute('data-dynamic-resource', 'true');
                                document.head.appendChild(newStyle);
                            });

                            // Create and append new scripts to the head to ensure they execute
                            doc.querySelectorAll('script').forEach(scriptTag => {
                                const newScript = document.createElement('script');
                                newScript.setAttribute('data-dynamic-resource', 'true');
                                if (scriptTag.src) {
                                    newScript.src = scriptTag.src;
                                } else {
                                    newScript.textContent = scriptTag.textContent;
                                }
                                document.head.appendChild(newScript);
                            });
                            
                            // Fade in new content
                            pageContent.style.opacity = '1';
                            pageTitle.style.opacity = '1';
                        }, 200);
                    })
                    .catch(error => {
                        console.error('Failed to fetch page:', error);
                        setTimeout(() => {
                            pageTitle.textContent = "Error";
                            pageContent.innerHTML = `<div class="welcome-message"><h3 style="color: white;">Content Not Found</h3><p>Could not load content for '${page}'. Please make sure the file '${page}.jsp' exists in the same directory.</p></div>`;
                            pageContent.style.opacity = '1';
                            pageTitle.style.opacity = '1';
                        }, 200);
                    });
            };

            navItems.forEach(item => {
            	item.addEventListener('click', function(e) {
                    const navItem = e.target.closest('.nav-item');
                    if (!navItem) return;

                    if (navItem.classList.contains('active')) {
                        return;
                    }

                    navItems.forEach(nav => nav.classList.remove('active'));
                    navItem.classList.add('active');

                    const page = this.getAttribute('data-page');
                    if (!page) {
                        console.error('Page data is missing!');
                        return;
                    }

                    loadContent(page);
                    alert(`Loading ${page} page...`);
                });
            });

            // Add smooth transitions for the fade effect
            pageContent.style.transition = 'opacity 0.3s ease';
            pageTitle.style.transition = 'opacity 0.3s ease';
        });

        // Add interactive mouse move effects for the background
        document.addEventListener('mousemove', function(e) {
            const contentPanel = document.querySelector('.content-panel');
            if (!contentPanel) return;

            const rect = contentPanel.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xPercent = (x / rect.width) * 100;
            const yPercent = (y / rect.height) * 100;
            
            contentPanel.style.background = `
                radial-gradient(circle at ${xPercent}% ${yPercent}%, 
                rgba(139, 69, 19, 0.5) 0%, 
                rgba(139, 69, 19, 0.4) 50%, 
                rgba(139, 69, 19, 0.3) 100%)
            `;
        });
    </script>
</body>
</html>
