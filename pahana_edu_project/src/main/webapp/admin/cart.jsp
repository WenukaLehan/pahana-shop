<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<html>
<head>
    <meta charset="UTF-8">
    <link rel="icon" href="../images/icont.png" type="image/x-icon">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
    <title>Shopping Cart</title>
    <link rel="stylesheet" href="../css/cart.css">
</head>
<body>

<div class="purchase-container">
    <div class="invoice-header">
        <h2>Invoice No : <span class="invoice-number-input">09</span></h2>
    </div>

    <div class="customer-info">
        <input type="text" placeholder="Customer Name" class="form-input customer-name" autocomplete="off" >
        <input type="text" placeholder="Customer Email" class="form-input customer-email">
    </div>

    <div class="product-section">
        <div class="product-header">
            <div class="product-name">
                <label>Product Name</label>
                <input type="text" placeholder="Enter Product Name" class="form-input" id="productNameInput" autocomplete="off" >
            </div>
            <div class="quantity">
                <label>Quantity</label>
                <div class="quantity-control">
                    <button class="quantity-btn minus">-</button>
                    <input type="number" min="1" value="1" class="quantity-input" id="quantityInput">
                    <button class="quantity-btn plus">+</button>
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
                    <button class="add-btn">+ Add</button>
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
                        <th>Unit</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="empty-row">
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                    </tr>
                    <tr class="empty-row">
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                    </tr>
                    <tr class="empty-row">
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
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
                <span>Total : Rs: 0.00</span>
            </div>
        </div>
    </div>

    <div class="bottom-section" >
        <div class="action-buttons">
            <button class="action-btn print" >
                <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
                    <path d="M6 9V4h12v5h1a2 2 0 0 1 2 2v5h-3v4H6v-4H3v-5a2 2 0 0 1 2-2h1Zm2-3v3h8V6H8Zm8 10H8v2h8v-2Z"/>
                </svg>
                Pay & Print
            </button>
        </div>
    </div>
</div>

<div class="customer-name-section" >
    <div class="customer-name-list" >
        <ul id="customerNameList" >
            <li class="customer-item" onclick="selectCustomer()">John Doe</li>
       	</ul>
    </div>
</div>

<div class="product-name-section">
    <div class="product-name-list">
        <ul id="productNameList">
            </ul>
    </div>
</div>

<div class="modal" id="paymentModal">
    <div class="modal-content">
        <div class="modal-header">
            <h3 class="modal-title">Payment</h3>
            <button class="close-btn" onclick="closeModal('paymentModal')">×</button>
        </div>
        <div class="form-group">
            <label class="form-label">Total Amount</label>
            <input type="text" class="form-input" id="totalAmount" readonly>
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
    initPurchaseManagement();
});
</script>

</body>
</html>