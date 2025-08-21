<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<link rel="stylesheet" href="../css/cart.css">

<style>

    /* Global Styles */
    :root{
        /* New notification colors */
            --success-color: #4CAF50; /* Green */
            --error-color: #F44336;   /* Red */
            --info-color: #2196F3;    /* Blue */
    }

         /* Notification Popup Styles */
        #notificationContainer {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1001;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none; /* Allow clicks to pass through if no notifications */
        }

        .notification-popup {
            background: var(--glass-background);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: var(--border-radius);
            padding: 15px 20px;
            display: flex;
            align-items: center;
            gap: 15px;
            min-width: 280px;
            max-width: 350px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            transform: translateX(100%);
            opacity: 0;
            animation: slideIn 0.5s forwards, fadeOut 0.5s 2.5s forwards; /* Slide in, then fade out after 2.5s delay */
            pointer-events: all; /* Re-enable clicks for the notification itself */
        }

        .notification-popup.success {
            border-left: 5px solid var(--success-color);
        }

        .notification-popup.error {
            border-left: 5px solid var(--error-color);
        }

        .notification-popup.info {
            border-left: 5px solid var(--info-color);
        }

        .notification-icon {
            font-size: 24px;
            color: var(--text-primary);
        }

        .notification-popup.success .notification-icon {
            color: var(--success-color);
        }

        .notification-popup.error .notification-icon {
            color: var(--error-color);
        }

        .notification-popup.info .notification-icon {
            color: var(--info-color);
        }

        .notification-content {
            flex-grow: 1;
        }

        .notification-title {
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 5px;
            font-size: 16px;
        }

        .notification-message {
            color: var(--text-secondary);
            font-size: 14px;
        }

        .notification-close {
            background: none;
            border: none;
            color: var(--text-muted);
            font-size: 18px;
            cursor: pointer;
            padding: 5px;
            border-radius: 50%;
            transition: background var(--transition-speed) ease;
        }

        .notification-close:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        @keyframes slideIn {
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes fadeOut {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }
</style>

<div class="purchase-container">



    <div class="invoice-header">
        <h2>Invoice No : <span class="invoice-number-input" id="invoiceNumber">09</span></h2>
    </div>

    <div class="customer-info">
        <div class="autocomplete-container">
            <input
                type="text"
                placeholder="Customer Name"
                class="form-input customer-name"
                autocomplete="off"
                id="customerName"
            >
            <div class="suggestions" id="customerSuggestions"></div>
        </div>
        <input type="text" placeholder="Customer Email" class="form-input customer-email" id="customerEmail">
    </div>

    <div class="product-section">
        <div class="product-header">
            <div class="product-name">
                <label>Product Name</label>
                <div class="autocomplete-container">
                    <input type="text" placeholder="Enter Product Name" class="form-input" id="productNameInput" autocomplete="off">
                    <div class="suggestions" id="productSuggestions"></div>
                </div>
            </div>
            <div class="quantity">
                <label>Quantity</label>
                <div class="quantity-control">
                    <button class="quantity-btn minus" id="quantityMinus">-</button>
                    <input type="number" min="1" value="1" class="quantity-input" id="quantityInput">
                    <button class="quantity-btn plus" id="quantityPlus">+</button>
                </div>
            </div>
            <div class="stock">
                <label>In Stock</label>
                <input type="number" min="0" class="form-input" id="stockInput" readonly>
            </div>
        </div>

        <div class="button-row">
            <div class="right-controls">
                <div class="unit-price">
                    <label>Unit Price</label>
                    <input type="number" min="0" step="0.01" placeholder="0.00" class="form-input" id="unitPriceInput">
                </div>
                <div class="action-buttons-row">
                    <button class="add-btn" id="addBtn">+ Add</button>
                    <button id="clearBtn" class="clear-btn">Clear</button>
                </div>
            </div>
        </div>

        <div class="product-table">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="cartTableBody">
                    <!-- Cart items will be rendered here by JavaScript -->
                    <tr class="empty-row">
                        <td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td>
                    </tr>
                    <tr class="empty-row">
                        <td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td>
                    </tr>
                    <tr class="empty-row">
                        <td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div class="payment-section">
        <div class="payment-method">
            <label>Payment Method :</label>
            <select class="form-select" id="paymentMethod">
                <option>Cash</option>
                <option>Card</option>
                <option>Bank Transfer</option>
            </select>
        </div>
        <div class="totals-section">
            <div class="total">
                <span>Total : Rs: <span id="grandTotal">0.00</span></span>
            </div>
        </div>
    </div>

    <div class="bottom-section">
        <div class="action-buttons">
            <button class="action-btn print" id="payAndPrintBtn">
                <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
                    <path d="M6 9V4h12v5h1a2 2 0 0 1 2 2v5h-3v4H6v-4H3v-5a2 2 0 0 1 2-2h1Zm2-3v3h8V6H8Zm8 10H8v2h8v-2Z"/>
                </svg>
                Pay & Print
            </button>
        </div>
    </div>
</div>

	<!-- Notification Container -->
    <div id="notificationContainer">
        <!-- Notifications will be appended here -->
    </div>

<div class="modal" id="paymentModal">
    <div class="modal-content">
        <div class="modal-header">
            <h3 class="modal-title">Payment</h3>
            <button class="close-btn" onclick="closeModal('paymentModal')">×</button>
        </div>
        <div class="form-group">
            <label class="form-label">Total Amount</label>
            <input type="text" class="form-input" id="modalTotalAmount" readonly>
        </div>
        <div class="form-group">
            <label class="form-label">Amount Paid</label>
            <input type="number" class="form-input" id="amountPaid" placeholder="Enter amount paid" step="0.01">
        </div>
        <div class="form-group">
            <label class="form-label">Balance</label>
            <input type="text" class="form-input" id="balance" readonly>
        </div>
        <div class="modal-actions">
            <button class="btn btn-primary" id="confirmPaymentBtn">Confirm Payment</button>
        </div>
    </div>
</div>

<script src="../js/cart.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
    // All your initialization code here
    // This calls the initPurchaseManagement function from cart1.js
    initPurchaseManagement();
});
</script>

