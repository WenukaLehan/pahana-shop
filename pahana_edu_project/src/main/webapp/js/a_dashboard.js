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

    /**
     * Loads content for a given page into the main content area.
     * It also handles dynamic loading of associated JavaScript files.
     * @param {string} page - The name of the page to load (e.g., 'users', 'cart').
     */
    const loadContent = (page) => {
        // Validate the page name to prevent errors
        if (!page || page.trim() === "") {
            console.error('Invalid page name provided:', page);
            return;
        }

        const url = page + ".jsp"; // Construct the URL for the JSP page
        const title = pageTitles[page] || "Dashboard"; // Get the display title for the page

        // Apply fade-out effect before loading new content
        pageContent.style.opacity = '0';
        pageTitle.style.opacity = '0';

        // Fetch the content of the JSP page
        fetch(url, { signal: AbortSignal.timeout(5000) }) // Add a timeout for the fetch request
            .then(response => {
                // Check if the response was successful
                if (!response.ok) {
                    throw new Error(`Page not found: ${response.statusText} (Status: ${response.status})`);
                }
                return response.text(); // Return the HTML content as text
            })
            .then(html => {
                // After a short delay for the fade-out effect, update the content and title
                setTimeout(() => {
                    pageTitle.textContent = title; // Set the new page title
                    pageContent.innerHTML = html; // Inject the fetched HTML content
                    pageContent.style.opacity = '1'; // Fade in the new content
                    pageTitle.style.opacity = '1'; // Fade in the new title

                    // Dynamically load and initialize page-specific JavaScript
                    // This ensures that the correct script is loaded and its initialization function is called.
                    // It also handles cases where the script might already be present or needs to be reloaded.
                    const scriptMap = {
                        users: { src: '../js/users.js', init: 'initUserManagement' },
                        books: { src: '../js/books.js', init: 'initBookManagement' },
                        cart: { src: '../js/cart.js', init: 'initPurchaseManagement' }, // Corrected init function name
                        reports: { src: '../js/reports.js', init: 'initReportsManagement' },
                        settings: { src: '../js/settings.js', init: 'initSettingsManagement' }
                    };

                    const pageScript = scriptMap[page];
                    if (pageScript) {
                        // Check if the initialization function already exists (e.g., if script was loaded before)
                        if (typeof window[pageScript.init] === "function") {
                            window[pageScript.init](); // Call the existing function
                        } else {
                            // If not, remove any existing script tag for this page to prevent duplicates
                            const existingScript = document.querySelector(`script[src="${pageScript.src}"]`);
                            if (existingScript) {
                                existingScript.remove();
                            }

                            // Create and append a new script tag
                            const script = document.createElement('script');
                            script.src = pageScript.src;
                            script.onload = () => {
                                // Once the script is loaded, call its initialization function
                                if (typeof window[pageScript.init] === "function") {
                                    window[pageScript.init]();
                                } else {
                                    console.error(`Initialization function '${pageScript.init}' not found after loading ${pageScript.src}`);
                                }
                            };
                            script.onerror = () => console.error(`Failed to load ${pageScript.src}`);
                            document.body.appendChild(script); // Append to body to ensure it runs after DOM is ready
                        }
                    }
                }, 300); // Delay for fade-out transition
            })
            .catch(error => {
                // Handle errors during fetch (e.g., network issues, page not found)
                console.error('Failed to fetch page:', error);
                setTimeout(() => {
                    pageTitle.textContent = "Error"; // Set error title
                    pageContent.innerHTML = `
                        <div class="welcome-message" style="text-align: center; padding: 20px; color: #fff; background-color: rgba(255, 0, 0, 0.5); border-radius: 10px;">
                            <h3 style="color: white; margin-bottom: 10px;">Content Not Found</h3>
                            <p>Could not load content for '${page}'. Please ensure the file '${page}.jsp' exists and is accessible.</p>
                            <p>Error details: ${error.message}</p>
                        </div>`;
                    pageContent.style.opacity = '1'; // Fade in error message
                    pageTitle.style.opacity = '1'; // Fade in error title
                }, 300); // Delay for fade-out transition
            });
    };

    // Add click event listeners to all navigation items
    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default link behavior

            // If the clicked item is already active, do nothing
            if (this.classList.contains('active')) return;

            // Remove 'active' class from all navigation items
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active'); // Add 'active' class to the clicked item

            const page = this.getAttribute('data-page'); // Get the page name from the data-page attribute
            if (page && page.trim() !== "") {
                loadContent(page); // Load content for the selected page
            } else {
                console.error('Navigation item is missing a valid "data-page" attribute.');
            }
        });
    });

    // Apply transition effects for smooth content and title changes
    pageContent.style.transition = 'opacity 0.3s ease-in-out';
    pageTitle.style.transition = 'opacity 0.3s ease-in-out';

    // Load the 'users' page by default when the dashboard loads
    loadContent('users');
});
