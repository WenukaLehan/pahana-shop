let purchaseData = {
    products: [],
    customers: [
        { id: 1, name: "John Doe", email: "john.doe@example.com" },
        { id: 2, name: "Jane Smith", email: "jane.smith@example.com" },
        { id: 3, name: "Alice Johnson", email: "alice.j@example.com" }
    ],
    availableProducts: [
        { id: 1, name: "Laptop", stock: 15, price: 1200.00 },
        { id: 2, name: "Mouse", stock: 50, price: 25.00 },
        { id: 3, name: "Keyboard", stock: 30, price: 75.00 },
        { id: 4, name: "Monitor", stock: 10, price: 300.00 }
    ]
};

let currentProductId = 1;
let currentInvoiceTotal = 0;
let currentDiscount = 0;

function initPurchaseManagement() {
    console.log('initPurchaseManagement called');

    const get = (selector) => document.querySelector(selector);
    const getById = (id) => document.getElementById(id);

    const elements = {
        addBtn: get('.add-btn'),
        clearBtn: getById('clearBtn'),
        productTable: get('.product-table tbody'),
        quantityInput: getById('quantityInput'),
        minusBtn: get('.quantity-btn.minus'),
        plusBtn: get('.quantity-btn.plus'),
        printBtn: get('.print'),
        paymentMethodSelect: getById('paymentMethod'),
        invoiceNumberInput: get('.invoice-number-input'),
        unitPriceInput: getById('unitPriceInput'),
        productNameInput: getById('productNameInput'),
        stockInput: getById('stockInput'),
        customerNameInput: get('.customer-name'),
        customerEmailInput: get('.customer-email'),
        customerNameList: getById('customerNameList'),
        customerNameSection: get('.customer-name-section'),
        productNameList: getById('productNameList'),
        productNameSection: get('.product-name-section'),
        totalDisplay: get('.total span'),
        amountPaidInput: getById('amountPaid'),
        totalAmountInput: getById('totalAmount'),
        balanceInput: getById('balance'),
        confirmPaymentBtn: getById('confirmPaymentBtn')
    };

    // Debugging: Log available elements
    for (const key in elements) {
        if (!elements[key]) {
            console.error(`Required element missing: ${key}`);
            return;
        }
    }

    setupEventListeners(elements);
    renderCustomerList(elements.customerNameList, purchaseData.customers);
    renderProductList(elements.productNameList, purchaseData.availableProducts);
    updateTotalDisplay(elements.totalDisplay);
}

function setupEventListeners(elements) {
    elements.minusBtn.addEventListener('click', () => {
        let val = parseInt(elements.quantityInput.value) || 1;
        if (val > 1) elements.quantityInput.value = val - 1;
    });

    elements.plusBtn.addEventListener('click', () => {
        let val = parseInt(elements.quantityInput.value) || 1;
        elements.quantityInput.value = val + 1;
    });

    elements.quantityInput.addEventListener('focus', function () {
        this.select();
    });

    elements.quantityInput.addEventListener('change', function () {
        if (this.value < 1) this.value = 1;
    });

    elements.clearBtn.addEventListener('click', () => {
        elements.productNameInput.value = '';
        elements.stockInput.value = '';
        elements.quantityInput.value = '1';
        elements.unitPriceInput.value = '';
        currentDiscount = 0;
        updateTotalDisplay(elements.totalDisplay);
    });

    elements.addBtn.addEventListener('click', () => {
        const productName = elements.productNameInput.value.trim();
        const quantity = parseInt(elements.quantityInput.value);
        const stock = parseInt(elements.stockInput.value) || 0;
        const unitPrice = parseFloat(elements.unitPriceInput.value) || 0;

        if (!productName) return alert('Please enter a product name');
        if (unitPrice <= 0) return alert('Please enter a valid unit price');
        if (quantity > stock) return alert('Quantity cannot exceed available stock');

        addProductToTable(elements.productTable, productId++, productName, quantity, stock, unitPrice, elements.totalDisplay);

        elements.productNameInput.value = '';
        elements.stockInput.value = '';
        elements.quantityInput.value = '1';
        elements.unitPriceInput.value = '';
    });

    elements.printBtn.addEventListener('click', () => {
        const customerName = elements.customerNameInput.value.trim();
        const customerEmail = elements.customerEmailInput.value.trim();
        if (!customerName) return alert('Please enter customer name');
        if (currentInvoiceTotal <= 0) return alert('Please add products to the invoice');

        const paymentMethod = elements.paymentMethodSelect.value;
        const invoiceNumber = elements.invoiceNumberInput.textContent;

        console.log('Processing payment and printing:', {
            invoiceNumber,
            customerName,
            customerEmail,
            paymentMethod,
            total: currentInvoiceTotal.toFixed(2),
            finalTotal: (currentInvoiceTotal - currentDiscount).toFixed(2)
        });

        openPaymentModal('paymentModal', elements.totalAmountInput, elements.amountPaidInput, elements.balanceInput, elements.confirmPaymentBtn);
    });

    window.onclick = function (event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) closeModal(modal.id);
        });
    };

    elements.customerNameInput.addEventListener('input', () => {
        const value = elements.customerNameInput.value.trim().toLowerCase();
        if (!elements.customerNameList || !elements.customerNameSection) return;
        elements.customerNameSection.style.display = value ? 'block' : 'none';
        elements.customerNameList.querySelectorAll('.customer-name-item').forEach(item => {
            item.style.display = item.textContent.toLowerCase().includes(value) ? 'block' : 'none';
        });
    });

    elements.customerNameInput.addEventListener('focus', () => {
        if (elements.customerNameSection) elements.customerNameSection.style.display = 'block';
    });

    elements.customerNameInput.addEventListener('blur', () => {
        setTimeout(() => {
            if (elements.customerNameSection) elements.customerNameSection.style.display = 'none';
        }, 200);
    });

    elements.productNameInput.addEventListener('input', () => {
        const value = elements.productNameInput.value.trim().toLowerCase();
        if (!elements.productNameList || !elements.productNameSection) return;
        elements.productNameSection.style.display = value ? 'block' : 'none';
        elements.productNameList.querySelectorAll('.product-name-item').forEach(item => {
            item.style.display = item.textContent.toLowerCase().includes(value) ? 'block' : 'none';
        });
    });

    elements.productNameInput.addEventListener('focus', () => {
        if (elements.productNameSection) elements.productNameSection.style.display = 'block';
    });

    elements.productNameInput.addEventListener('blur', () => {
        setTimeout(() => {
            if (elements.productNameSection) elements.productNameSection.style.display = 'none';
        }, 200);
    });

    elements.amountPaidInput.addEventListener('input', () => calculateBalance(elements.totalAmountInput, elements.amountPaidInput, elements.balanceInput));
}

function addProductToTable(productTable, id, name, qty, stock, unitPrice, totalDisplayElement) {
    const itemTotal = (qty * unitPrice).toFixed(2);
    currentInvoiceTotal += parseFloat(itemTotal);

    const rowHTML = `
        <td>${id}</td>
        <td>${name}</td>
        <td class="editable-cell quantity-cell" data-type="quantity">${qty}</td>
        <td>pcs</td>
        <td class="editable-cell price-cell" data-type="price">Rs ${unitPrice.toFixed(2)}</td>
        <td class="total-cell">Rs ${itemTotal}</td>
        <td><button class="remove-btn">🗑️ Remove</button></td>
    `;

    const emptyRow = productTable.querySelector('.empty-row');
    if (emptyRow) {
        emptyRow.innerHTML = rowHTML;
        emptyRow.classList.remove('empty-row');
        emptyRow.querySelector('.remove-btn')?.addEventListener('click', function () {
            removeProduct(this, productTable, totalDisplayElement);
        });
        addEditFunctionality(emptyRow, productTable, totalDisplayElement);
    } else {
        const row = document.createElement('tr');
        row.innerHTML = rowHTML;
        productTable.appendChild(row);
        row.querySelector('.remove-btn')?.addEventListener('click', function () {
            removeProduct(this, productTable, totalDisplayElement);
        });
        addEditFunctionality(row, productTable, totalDisplayElement);
    }

    updateTotalDisplay(totalDisplayElement);
}

function addEditFunctionality(row, productTable, totalDisplayElement) {
    const editableCells = row.querySelectorAll('.editable-cell');
    editableCells.forEach(cell => {
        cell.addEventListener('click', function () {
            if (this.querySelector('input')) return;

            const currentValue = this.textContent.replace('Rs ', '');
            const input = document.createElement('input');
            input.className = 'editable-input';
            input.type = 'number';
            input.min = this.dataset.type === 'quantity' ? '1' : '0';
            input.step = this.dataset.type === 'price' ? '0.01' : '1';
            input.value = currentValue;

            this.innerHTML = '';
            this.appendChild(input);
            input.focus();
            input.select();

            const saveEdit = () => {
                const newValue = parseFloat(input.value) || (this.dataset.type === 'quantity' ? 1 : 0);
                this.textContent = this.dataset.type === 'quantity' ? newValue : 'Rs ' + newValue.toFixed(2);
                updateRowTotal(row, totalDisplayElement);
            };

            input.addEventListener('blur', saveEdit);
            input.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') saveEdit();
            });
        });
    });
}

function updateRowTotal(row, totalDisplayElement) {
    const quantity = parseInt(row.querySelector('.quantity-cell')?.textContent || 1);
    const price = parseFloat(row.querySelector('.price-cell')?.textContent.replace('Rs ', '') || 0);
    const totalCell = row.querySelector('.total-cell');

    const oldTotal = parseFloat(totalCell?.textContent.replace('Rs ', '') || 0);
    const newTotal = (quantity * price).toFixed(2);
    currentInvoiceTotal = currentInvoiceTotal - oldTotal + parseFloat(newTotal);
    if (totalCell) totalCell.textContent = 'Rs ' + newTotal;

    updateTotalDisplay(totalDisplayElement);
}

function removeProduct(button, productTable, totalDisplayElement) {
    const row = button.closest('tr');
    const itemTotal = parseFloat(row.querySelector('.total-cell')?.textContent.replace('Rs ', '') || 0);
    currentInvoiceTotal -= itemTotal;

    row.innerHTML = '<td>-</td>'.repeat(7);
    row.classList.add('empty-row');

    updateTotalDisplay(totalDisplayElement);
}

function updateTotalDisplay(totalDisplayElement) {
    const finalTotal = Math.max(0, currentInvoiceTotal - currentDiscount);
    if (totalDisplayElement) totalDisplayElement.textContent = `Total : Rs ${finalTotal.toFixed(2)}`;
}

function openPaymentModal(id, totalAmountInput, amountPaidInput, balanceInput, confirmBtn) {
    totalAmountInput.value = currentInvoiceTotal.toFixed(2);
    amountPaidInput.value = '';
    balanceInput.value = '';
    if (confirmBtn) confirmBtn.onclick = () => confirmPayment(totalAmountInput, amountPaidInput, id);
    openModal(id);
}

function calculateBalance(totalAmountInput, amountPaidInput, balanceInput) {
    const total = parseFloat(totalAmountInput.value) || 0;
    const paid = parseFloat(amountPaidInput.value) || 0;
    const balance = paid - total;
    balanceInput.value = balance.toFixed(2);
}

function confirmPayment(totalAmountInput, amountPaidInput, modalId) {
    const total = parseFloat(totalAmountInput.value) || 0;
    const paid = parseFloat(amountPaidInput.value) || 0;
    if (paid < total) return alert('Amount paid is less than total');
    printBill();
    closeModal(modalId);
}

function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.display = 'block';
        setTimeout(() => modal.classList.add('show'), 10);
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = 'none', 300);
    }
}

function renderCustomerList(customerNameListElement, customers) {
    if (!customerNameListElement) return;
    customerNameListElement.innerHTML = '';
    customers.forEach(customer => {
        const listItem = document.createElement('button');
        listItem.className = 'customer-name-item';
        listItem.textContent = customer.name;
        listItem.setAttribute('data-id', customer.id);
        listItem.setAttribute('data-email', customer.email);
        listItem.addEventListener('click', cNameClick);
        customerNameListElement.appendChild(listItem);
    });
}

function renderProductList(productNameListElement, products) {
    if (!productNameListElement) return;
    productNameListElement.innerHTML = '';
    products.forEach(product => {
        const listItem = document.createElement('div');
        listItem.className = 'product-name-item';
        listItem.textContent = product.name;
        listItem.setAttribute('data-id', product.stock); // Using data-id to store stock
        listItem.setAttribute('data-price', product.price); // Store price
        listItem.addEventListener('click', pNameClick);
        productNameListElement.appendChild(listItem);
    });
}

function pNameClick(event) {
    const target = event.target.closest('.product-name-item');
    if (target) {
        const productNameInput = document.getElementById('productNameInput');
        const productNameSection = document.querySelector('.product-name-section');
        const stockInput = document.getElementById('stockInput');
        const unitPriceInput = document.getElementById('unitPriceInput');

        productNameInput.value = target.textContent;
        productNameSection.style.display = 'none';

        stockInput.value = target.getAttribute('data-id');
        unitPriceInput.value = target.getAttribute('data-price');
    }
}

function cNameClick(event) {
    const target = event.target.closest('.customer-name-item');
    if (target) {
        const customerNameInput = document.querySelector('.customer-name');
        const customerNameSection = document.querySelector('.customer-name-section');
        const customerEmailInput = document.querySelector('.customer-email');

        customerNameInput.value = target.textContent;
        customerNameSection.style.display = 'none';
        customerEmailInput.value = target.getAttribute('data-email');
    }
}

function selectCustomer() {
		alert("Customer selected: " );
    }

function printBill() {
    console.log('Printing bill...');
    // Actual printing logic would go here, e.g., generating a PDF or sending to a printer API
    alert('Bill printed successfully!');
}