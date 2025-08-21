<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pahana EDU | Login</title>
    <link rel="icon" href="./images/icont.png" type="image/x-icon">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Flavors&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Roboto:wght@300;400&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="css/main.css">
    
</head>
<body>

    <!-- Container where notifications will be dynamically added -->
    <div id="notification-container"></div>

    <!-- Background overlay -->
    <div class="background-overlay"></div>

    <!-- Main login container -->
    <div class="login-container">
        <div class="login-form">
            <h1 class="login-title">Pahana EDU</h1>
            
            <div class="user-icon">
                🧑‍💻
            </div>
            
            <p class="login-subtitle">Login with your credintionals</p>

            <% String loginError = (String) request.getAttribute("loginError");
               if (loginError != null) { %>
                <script>
                    document.addEventListener('DOMContentLoaded', function() {
                        showNotification("<%= loginError %>", "error");
                    });
                </script>
            <% } %>
            <% String passwordSuccess = (String) request.getAttribute("passwordSuccess");
               if (passwordSuccess != null) { %>
               <script>
                    document.addEventListener('DOMContentLoaded', function() {
                        showNotification("<%= passwordSuccess %>", "info");
                    });
                </script>
            <% } %>

            <form id="loginForm" action="<%= request.getContextPath() %>/user" method="POST">
                <input type="hidden" name="action" value="login">
                
                <div class="input-group">
                    <input type="text" class="input-field" placeholder="Username" id="username" name="username" required>
                    <span class="input-icon">👤</span>
                </div>
                
                <div class="input-group">
                    <input type="password" class="input-field" placeholder="Password" id="password" name="password" required>
                    <span class="input-icon" id="togglePassword">👁️</span>
                </div>
                
                <a href="#" class="forgot-password" data-bs-toggle="modal" data-bs-target="#forgotPasswordModal">Forgot password?</a>
                
                <button type="submit" class="login-btn">Sign In</button>
            </form>
        </div>
    </div>

    <!-- Forgot Password Modal -->
    <div class="modal fade" id="forgotPasswordModal" tabindex="-1" aria-labelledby="forgotPasswordModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content forgot-modal">
                <div class="modal-header forgot-modal-header">
                    <h5 class="modal-title forgot-modal-title" id="forgotPasswordModalLabel">🔐 Reset Password</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body forgot-modal-body">
                    <form id="forgotPasswordForm" action="user" method="post">
                        <input type="hidden" name="action" value="forgot_password">
                        <div id="emailStep">
                            <div class="forgot-step-icon">📧</div>
                            <p class="forgot-step-text">Enter your email to receive a verification code.</p>
                            <div class="form-group">
                                <input type="email" class="form-control forgot-input" id="forgotEmail" name="email" placeholder="Enter your email address" required>
                            </div>
                            <button type="button" class="btn forgot-btn w-100 mt-3" id="sendCodeBtn">
                                <span class="btn-text">Send Code</span>
                                <span class="btn-icon">📨</span>
                            </button>
                        </div>
                        <div id="resetStep" style="display: none;">
                            <div class="forgot-step-icon">🔑</div>
                            <p class="forgot-step-text">Enter the verification code and your new password.</p>
                            <div class="form-group">
                                <input type="text" class="form-control forgot-input" id="code" name="code" placeholder="Enter verification code" required>
                            </div>
                            <div class="form-group mt-3">
                                <input type="password" class="form-control forgot-input" id="newPassword" name="newPassword" placeholder="Enter new password" required>
                            </div>
                            <button type="submit" class="btn forgot-btn-success w-100 mt-3">
                                <span class="btn-text">Change Password</span>
                                <span class="btn-icon">✅</span>
                            </button>
                        </div>
                    </form>
                    <div id="forgotPasswordMessage" class="mt-3"></div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    
    <script>
        // Toggle password visibility
        const togglePassword = document.getElementById('togglePassword');
        const passwordField = document.getElementById('password');

        togglePassword.addEventListener('click', function() {
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            
            // Toggle eye icon
            this.textContent = type === 'password' ? '👁️' : '🙈';
        });

        // Input field animations
        const inputFields = document.querySelectorAll('.input-field');
        
        inputFields.forEach(field => {
            field.addEventListener('focus', function() {
                this.parentElement.style.transform = 'scale(1.02)';
            });
            
            field.addEventListener('blur', function() {
                this.parentElement.style.transform = 'scale(1)';
            });
        });

        // Floating animation for the user icon
        const userIcon = document.querySelector('.user-icon');
        let floating = true;

        function floatIcon() {
            if (floating) {
                userIcon.style.transform = 'translateY(-5px) scale(1.05)';
                setTimeout(() => {
                    if (floating) {
                        userIcon.style.transform = 'translateY(0) scale(1)';
                    }
                }, 2000);
            }
        }

        setInterval(floatIcon, 4000);

        // Stop floating on hover
        userIcon.addEventListener('mouseenter', () => {
            floating = false;
        });

        userIcon.addEventListener('mouseleave', () => {
            floating = true;
        });

        // Forgot password modal logic
        $(document).ready(function () {
            $('#sendCodeBtn').on('click', function () {
                const email = $('#forgotEmail').val();
                const btn = $(this);
                const messageDiv = $('#forgotPasswordMessage');

                if (email) {
                    btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending...');
                    messageDiv.html('');

                    $.post(<%= request.getContextPath() %>'/user', { action: 'send_code', email: email }, function (response) {
                        if (response.status === 'success') {
                            $('#emailStep').slideUp();
                            $('#resetStep').slideDown();
                            messageDiv.html('<div class="alert alert-success forgot-alert">' + response.message + '</div>');
                        } else {
                            messageDiv.html('<div class="alert alert-danger forgot-alert">' + response.message + '</div>');
                            btn.prop('disabled', false).html('<span class="btn-text">Send Code</span><span class="btn-icon">📨</span>');
                        }
                    }, 'json').fail(function () {
                        messageDiv.html('<div class="alert alert-danger forgot-alert">An error occurred. Please try again.</div>');
                        btn.prop('disabled', false).html('<span class="btn-text">Send Code</span><span class="btn-icon">📨</span>');
                    });
                } else {
                    messageDiv.html('<div class="alert alert-warning forgot-alert">Please enter your email address.</div>');
                }
            });

            $('#forgotPasswordModal').on('hidden.bs.modal', function () {
                $('#forgotPasswordForm')[0].reset();
                $('#emailStep').show();
                $('#resetStep').hide();
                $('#forgotPasswordMessage').html('');
                $('#sendCodeBtn').prop('disabled', false).html('<span class="btn-text">Send Code</span><span class="btn-icon">📨</span>');
            });
        });

        window.addEventListener('DOMContentLoaded', function () {
            if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
                //window.location.href = 'index.html';
            }
        });
        
        /**
         * Displays a notification on the screen.
         * @param {string} message The message to display in the notification.
         * @param {'info'|'warn'|'error'} type The type of notification.
         */
        function showNotification(message, type = 'info') {
            const container = document.getElementById('notification-container');

            // Create the main notification element
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;

            // Create and set up the icon based on type
            const icon = document.createElement('span');
            icon.className = 'notification-icon';
            if (type === 'info') {
                icon.textContent = 'ℹ️';
            } else if (type === 'warn') {
                icon.textContent = '⚠️';
            } else {
                icon.textContent = '❌';
            }

            // Create the content wrapper
            const content = document.createElement('div');
            content.className = 'notification-content';

            // Create the message element
            const messageElement = document.createElement('p');
            messageElement.className = 'notification-message';
            messageElement.textContent = message;

            // Create the OK button
            const okButton = document.createElement('button');
            okButton.className = 'notification-ok-btn';
            okButton.textContent = 'OK';

            // Append elements
            content.appendChild(messageElement);
            content.appendChild(okButton);
            notification.appendChild(icon);
            notification.appendChild(content);
            container.appendChild(notification);
            
            // --- Timers and Event Listeners ---

            // Timer to automatically dismiss the notification after 5 seconds
            const autoDismissTimer = setTimeout(() => {
                dismiss();
            }, 5000);

            // Event listener for the OK button
            okButton.addEventListener('click', () => {
                // Clear the auto-dismiss timer if the user clicks OK first
                clearTimeout(autoDismissTimer);
                dismiss();
            });
            
            /**
             * Handles the dismissal of the notification.
             * It adds a class to trigger the exit animation and then removes
             * the element from the DOM.
             */
            function dismiss() {
                // Trigger the exit animation by removing the 'show' class
                notification.classList.remove('show');
                
                // Wait for the exit animation to complete before removing the element
                setTimeout(() => {
                    // Check if the element is still in the DOM before trying to remove it
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 500); // This timeout should match the CSS transition duration
            }

            // Use a short timeout to allow the element to be added to the DOM
            // before triggering the entry animation. This ensures the CSS transition works.
            setTimeout(() => {
                notification.classList.add('show');
            }, 10); // A tiny delay is enough
        }
    </script>

</body>
</html>