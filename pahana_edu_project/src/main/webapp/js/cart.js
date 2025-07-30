// Mock Data for Customers and Products
// Using comprehensive data structures for customers and products
let customers = [
];

let products = [
];

let cartItems = [];
let nextInvoiceNumber = 10; // Starting invoice number
let highlightedCustomerSuggestionIndex = -1;
let highlightedProductSuggestionIndex = -1;

// DOM Element References - Centralized for easier access and validation
const elements = {
    invoiceNumberSpan: document.getElementById('invoiceNumber'),
    customerNameInput: document.getElementById('customerName'),
    customerEmailInput: document.getElementById('customerEmail'),
    customerSuggestionsDiv: document.getElementById('customerSuggestions'),
    productNameInput: document.getElementById('productNameInput'),
    productSuggestionsDiv: document.getElementById('productSuggestions'),
    quantityInput: document.getElementById('quantityInput'),
    quantityMinusBtn: document.getElementById('quantityMinus'),
    quantityPlusBtn: document.getElementById('quantityPlus'),
    stockInput: document.getElementById('stockInput'),
    unitPriceInput: document.getElementById('unitPriceInput'),
    addBtn: document.getElementById('addBtn'),
    clearBtn: document.getElementById('clearBtn'),
    cartTableBody: document.getElementById('cartTableBody'),
    grandTotalSpan: document.getElementById('grandTotal'),
    payAndPrintBtn: document.getElementById('payAndPrintBtn'),
    paymentModal: document.getElementById('paymentModal'),
    modalTotalAmountInput: document.getElementById('modalTotalAmount'),
    amountPaidInput: document.getElementById('amountPaid'),
    balanceInput: document.getElementById('balance'),
    confirmPaymentBtn: document.getElementById('confirmPaymentBtn'),
    paymentMethodSelect: document.getElementById('paymentMethod') // Added this for completeness
};

function fetchCustomers() {
    try {
        $.post(`${window.contextPath}/CustomerServlet`, { action: 'getAllCustomers' }, (response) => {
            if (response.success && Array.isArray(response.data) && response.data.length > 0) {
                customers = response.data.map(user => ({
                    id: user.u_id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    acc_nu: user.acc_nu,
                    status: user.status,
                    address: user.address || ''
                }));
                // Refresh customer autocomplete suggestions if the input is active
                if (elements.customerNameInput.value.trim().length > 0) {
                    handleAutocompleteInput(elements.customerNameInput, elements.customerSuggestionsDiv, customers, 'name', selectCustomerSuggestion);
                }
            } else {
                console.warn("No customers found or error in response:", response.message || "Unknown error");
            }
        }, 'json').fail(function (xhr, status, error) {
            console.error("Error fetching customers:", status, error);
        });
    } catch (e) {
        console.error("Error loading customers:", e);
    }
}

function fetchProducts() {
    try {
        $.post(`${window.contextPath}/BookServlet`, { action: 'listBooks' }, (response) => {
            if (response.success && Array.isArray(response.books) && response.books.length > 0) {
                products = response.books.map(book => ({
                    id: book.id,
                    name: book.title,
                    price: parseFloat(book.price) || 0.00,
                    stock: parseInt(book.stock) || 0
                }));
                // Refresh product autocomplete suggestions if the input is active
                if (elements.productNameInput.value.trim().length > 0) {
                    handleAutocompleteInput(elements.productNameInput, elements.productSuggestionsDiv, products, 'name', selectProductSuggestion);
                }
            } else {
                console.warn("No products found or error in response:", response.message || "Unknown error");
            }
        }, 'json').fail(function (xhr, status, error) {
            console.error("Error fetching products:", status, error);
        });
    } catch (e) {
        console.error("Error loading products:", e);
    }
}

function getInvoiceNumber() {
    try {
        $.post(`${window.contextPath}/OrderServlet`, { action: 'getInvoice' }, (response) => {
            // Ensure response is parsed as JSON
            if (typeof response === 'string') {
                try {
                    response = JSON.parse(response);
                } catch (e) {
                    console.error("Error parsing invoice response:", e);
                    return;
                }
            }

            if (response.success && response.invoiceNumber) {
                nextInvoiceNumber = parseInt(response.invoiceNumber, 10); // Use base 10 explicitly
                elements.invoiceNumberSpan.textContent = String(nextInvoiceNumber).padStart(2, '0');
            } else {
                console.warn("Error fetching invoice number:", response.message || "Unknown error");
                // Optionally set a fallback invoice number
                nextInvoiceNumber = nextInvoiceNumber || 10; // Fallback to existing or default
                elements.invoiceNumberSpan.textContent = String(nextInvoiceNumber).padStart(2, '0');
            }
        }, 'json').fail(function (xhr, status, error) {
            console.error("Error fetching invoice number:", status, error);
            // Fallback to existing or default invoice number on error
            nextInvoiceNumber = nextInvoiceNumber || 10;
            elements.invoiceNumberSpan.textContent = String(nextInvoiceNumber).padStart(2, '0');
        });
    } catch (e) {
        console.error("Error getting invoice number:", e);
        // Fallback to existing or default invoice number
        nextInvoiceNumber = nextInvoiceNumber || 10;
        elements.invoiceNumberSpan.textContent = String(nextInvoiceNumber).padStart(2, '0');
    }
}

/**
 * Initializes the purchase management system by setting up event listeners
 * and rendering the initial state.
 */
function initPurchaseManagement() {
    // Validate that all required elements are present
    for (const key in elements) {
        if (!elements[key]) {
            console.error(`Error: Required DOM element with ID '${key}' not found. Please check your HTML.`);
            // Potentially disable functionality or show a user-friendly message
            return;
        }
    }

    // Set initial invoice number
    elements.invoiceNumberSpan.textContent = String(nextInvoiceNumber).padStart(2, '0');
    renderCartItems(); // Render initial empty rows
	getInvoiceNumber();
	fetchCustomers();
	fetchProducts();
	

    // Event Listeners for Customer Autocomplete
    elements.customerNameInput.addEventListener('input', () => handleAutocompleteInput(elements.customerNameInput, elements.customerSuggestionsDiv, customers, 'name', selectCustomerSuggestion));
    elements.customerNameInput.addEventListener('keydown', (e) => handleAutocompleteKeydown(e, elements.customerSuggestionsDiv, elements.customerNameInput, selectCustomerSuggestion, highlightedCustomerSuggestionIndex, (index) => highlightedCustomerSuggestionIndex = index));
    elements.customerSuggestionsDiv.addEventListener('click', (e) => {
        if (e.target.classList.contains('suggestion-item')) {
            selectCustomerSuggestion(e.target.dataset.name);
        }
    });
    // Hide customer suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!elements.customerNameInput.contains(e.target) && !elements.customerSuggestionsDiv.contains(e.target)) {
            elements.customerSuggestionsDiv.style.display = 'none';
            highlightedCustomerSuggestionIndex = -1;
        }
    });


    // Event Listeners for Product Autocomplete
    elements.productNameInput.addEventListener('input', () => handleAutocompleteInput(elements.productNameInput, elements.productSuggestionsDiv, products, 'name', selectProductSuggestion));
    elements.productNameInput.addEventListener('keydown', (e) => handleAutocompleteKeydown(e, elements.productSuggestionsDiv, elements.productNameInput, selectProductSuggestion, highlightedProductSuggestionIndex, (index) => highlightedProductSuggestionIndex = index));
    elements.productSuggestionsDiv.addEventListener('click', (e) => {
        if (e.target.classList.contains('suggestion-item')) {
            selectProductSuggestion(e.target.dataset.name);
        }
    });
    // Hide product suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!elements.productNameInput.contains(e.target) && !elements.productSuggestionsDiv.contains(e.target)) {
            elements.productSuggestionsDiv.style.display = 'none';
            highlightedProductSuggestionIndex = -1;
        }
    });


    // Quantity control buttons
    elements.quantityMinusBtn.addEventListener('click', () => {
        let currentQuantity = parseInt(elements.quantityInput.value);
        if (currentQuantity > 1) {
            elements.quantityInput.value = currentQuantity - 1;
        }
    });
    elements.quantityPlusBtn.addEventListener('click', () => {
        let currentQuantity = parseInt(elements.quantityInput.value);
        let currentStock = parseInt(elements.stockInput.value);
        if (isNaN(currentStock) || currentStock === 0) {
            console.warn("Cannot increase quantity: Product stock is not available or zero.");
            return;
        }
        if (currentQuantity < currentStock) {
            elements.quantityInput.value = currentQuantity + 1;
        } else {
            console.warn(`Cannot increase quantity: Exceeds available stock (${currentStock}).`);
        }
    });
    elements.quantityInput.addEventListener('input', (e) => {
        let val = parseInt(e.target.value);
        let currentStock = parseInt(elements.stockInput.value);
        if (isNaN(val) || val < 1) {
            e.target.value = 1;
        } else if (!isNaN(currentStock) && val > currentStock) {
            e.target.value = currentStock;
        }
    });

    // Add and Clear buttons
    elements.addBtn.addEventListener('click', addItemToCart);
    elements.clearBtn.addEventListener('click', clearProductInputs);

    // Pay & Print button
    elements.payAndPrintBtn.addEventListener('click', openPaymentModal);

    // Payment Modal interactions
    elements.amountPaidInput.addEventListener('input', updateBalance);
    elements.confirmPaymentBtn.addEventListener('click', handleConfirmPayment);
}



/**
 * Generic function to handle autocomplete input and display suggestions.
 * @param {HTMLInputElement} inputElement - The input field for autocomplete.
 * @param {HTMLElement} suggestionsElement - The div to display suggestions.
 * @param {Array<Object>} dataArray - The array of data (customers or products).
 * @param {string} displayKey - The key in data objects to display (e.g., 'name').
 * @param {Function} selectCallback - Callback function when a suggestion is selected.
 */
function handleAutocompleteInput(inputElement, suggestionsElement, dataArray, displayKey, selectCallback) {
    const query = inputElement.value.toLowerCase();
    suggestionsElement.innerHTML = '';
    
    // Reset highlight index for the specific autocomplete
    if (inputElement.id === 'customerName') {
        highlightedCustomerSuggestionIndex = -1;
    } else if (inputElement.id === 'productNameInput') {
        highlightedProductSuggestionIndex = -1;
    }

    if (query.length === 0) {
        suggestionsElement.style.display = 'none';
        return;
    }

    // Ensure dataArray is valid and filter out invalid items
    if (!Array.isArray(dataArray)) {
        console.warn("Data array is not valid:", dataArray);
        const noResults = document.createElement('div');
        noResults.classList.add('no-results');
        noResults.textContent = 'No results available';
        suggestionsElement.appendChild(noResults);
        suggestionsElement.style.display = 'block';
        return;
    }

    const filteredData = dataArray
        .filter(item => item && typeof item === 'object' && item[displayKey] && typeof item[displayKey] === 'string')
        .filter(item => item[displayKey].toLowerCase().includes(query))
        .slice(0, 8); // Limit to 8 suggestions

    if (filteredData.length > 0) {
        filteredData.forEach(item => {
            const div = document.createElement('div');
            div.classList.add('suggestion-item');
            div.textContent = item[displayKey];
            div.dataset[displayKey] = item[displayKey]; // Store the full name
            suggestionsElement.appendChild(div);
        });
        suggestionsElement.style.display = 'block';
    } else {
        const noResults = document.createElement('div');
        noResults.classList.add('no-results');
        noResults.textContent = 'No results found';
        suggestionsElement.appendChild(noResults);
        suggestionsElement.style.display = 'block';
    }
}

/**
 * Handles keyboard navigation for autocomplete suggestions.
 * @param {KeyboardEvent} e - The keyboard event.
 * @param {HTMLElement} suggestionsElement - The div containing suggestions.
 * @param {HTMLInputElement} inputElement - The input field.
 * @param {Function} selectCallback - Callback function when a suggestion is selected.
 * @param {number} highlightedIndex - The current highlighted index.
 * @param {Function} setHighlightedIndex - Function to update the highlighted index.
 */
function handleAutocompleteKeydown(e, suggestionsElement, inputElement, selectCallback, highlightedIndex, setHighlightedIndex) {
    const items = suggestionsElement.querySelectorAll('.suggestion-item');
    if (items.length === 0) return;

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (highlightedIndex < items.length - 1) {
            highlightedIndex++;
        } else {
            highlightedIndex = 0; // Wrap around
        }
        updateHighlightedSuggestion(items, highlightedIndex, setHighlightedIndex);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (highlightedIndex > 0) {
            highlightedIndex--;
        } else {
            highlightedIndex = items.length - 1; // Wrap around
        }
        updateHighlightedSuggestion(items, highlightedIndex, setHighlightedIndex);
    } else if (e.key === 'Enter') {
        e.preventDefault();
        if (highlightedIndex > -1 && highlightedIndex < items.length) {
            selectCallback(items[highlightedIndex].dataset[inputElement.id === 'customerName' ? 'name' : 'name']);
        } else if (inputElement.value.trim().length > 0) {
            // If Enter is pressed without highlighting, and there's text,
            // attempt to select the exact match or first suggestion if available
            const exactMatch = Array.from(items).find(item => item.textContent.toLowerCase() === inputElement.value.toLowerCase());
            if (exactMatch) {
                selectCallback(exactMatch.dataset[inputElement.id === 'customerName' ? 'name' : 'name']);
            } else if (items.length > 0) {
                selectCallback(items[0].dataset[inputElement.id === 'customerName' ? 'name' : 'name']);
            }
        }
        suggestionsElement.style.display = 'none';
        setHighlightedIndex(-1);
    } else if (e.key === 'Escape') {
        suggestionsElement.style.display = 'none';
        setHighlightedIndex(-1);
    }
}

/**
 * Updates the visual highlight for autocomplete suggestions.
 * @param {NodeList} items - List of suggestion items.
 * @param {number} newIndex - The index of the item to highlight.
 * @param {Function} setHighlightedIndex - Function to update the highlighted index.
 */
function updateHighlightedSuggestion(items, newIndex, setHighlightedIndex) {
    items.forEach((item, index) => {
        item.classList.remove('highlighted');
        if (index === newIndex) {
            item.classList.add('highlighted');
            item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    });
    setHighlightedIndex(newIndex);
}

/**
 * Selects a customer suggestion and populates the input fields.
 * @param {string} customerName - The name of the selected customer.
 */
function selectCustomerSuggestion(customerName) {
    const selectedCustomer = customers.find(c => c.name === customerName);
    if (selectedCustomer) {
        elements.customerNameInput.value = selectedCustomer.name;
        elements.customerEmailInput.value = selectedCustomer.email;
    }
    elements.customerSuggestionsDiv.style.display = 'none';
    highlightedCustomerSuggestionIndex = -1;
}

/**
 * Selects a product suggestion and populates the input fields.
 * @param {string} productName - The name of the selected product.
 */
function selectProductSuggestion(productName) {
    const selectedProduct = products.find(p => p.name === productName);
    if (selectedProduct) {
        elements.productNameInput.value = selectedProduct.name;
        elements.unitPriceInput.value = selectedProduct.price.toFixed(2);
        elements.stockInput.value = selectedProduct.stock;
        elements.quantityInput.value = 1; // Reset quantity to 1
    }
    elements.productSuggestionsDiv.style.display = 'none';
    highlightedProductSuggestionIndex = -1;
}

/**
 * Adds an item to the cart or updates its quantity if already present.
 */
function addItemToCart() {
    const productName = elements.productNameInput.value.trim();
    const quantity = parseInt(elements.quantityInput.value);
    const unitPrice = parseFloat(elements.unitPriceInput.value);
    const availableStock = parseInt(elements.stockInput.value);

    // Basic validation
    if (!productName) {
        console.error('Please enter a product name.');
        return;
    }
    if (isNaN(quantity) || quantity <= 0) {
        console.error('Please enter a valid quantity (must be a positive number).');
        return;
    }
    if (isNaN(unitPrice) || unitPrice < 0) {
        console.error('Please enter a valid unit price (must be a non-negative number).');
        return;
    }

    const productInDB = products.find(p => p.name === productName);
    if (!productInDB) {
        console.error('Product not found in available products. Please select from suggestions or enter a valid product.');
        return;
    }

    if (quantity > productInDB.stock) {
        console.error(`Not enough stock for ${productName}. Available: ${productInDB.stock}.`);
        return;
    }

    const existingItemIndex = cartItems.findIndex(item => item.id === productInDB.id);

    if (existingItemIndex > -1) {
        // Update existing item
        const newQuantity = cartItems[existingItemIndex].quantity + quantity;
        if (newQuantity > productInDB.stock + cartItems[existingItemIndex].quantity) { // Check against original stock
            console.error(`Cannot add more. Total quantity for ${productName} would exceed stock.`);
            return;
        }
        cartItems[existingItemIndex].quantity = newQuantity;
        cartItems[existingItemIndex].total = newQuantity * cartItems[existingItemIndex].unitPrice;
    } else {
        // Add new item
        const newItem = {
            id: productInDB.id,
            name: productName,
            quantity: quantity,
            unitPrice: unitPrice,
            total: quantity * unitPrice
        };
        cartItems.push(newItem);
    }

    // Update stock in mock products (reduce stock)
    productInDB.stock -= quantity;
    elements.stockInput.value = productInDB.stock; // Update displayed stock

    renderCartItems();
    calculateTotals();
    clearProductInputs();
}

/**
 * Renders the items currently in the cart to the table.
 * Makes quantity and unit price cells editable.
 */
function renderCartItems() {
    elements.cartTableBody.innerHTML = ''; // Clear existing rows

    if (cartItems.length === 0) {
        // Add empty rows if cart is empty
        for (let i = 0; i < 3; i++) {
            const row = elements.cartTableBody.insertRow();
            row.classList.add('empty-row');
            // Ensure the number of cells matches the header (ID, Name, Quantity, Unit Price, Total, Action)
            row.innerHTML = '<td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td>';
        }
        return;
    }

    cartItems.forEach(item => {
        const row = elements.cartTableBody.insertRow();
        row.dataset.id = item.id; // Store item ID for easy removal/update
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td class="editable-cell" data-field="quantity">${item.quantity}</td>
            <td class="editable-cell" data-field="unitPrice">${item.unitPrice.toFixed(2)}</td>
            <td>${item.total.toFixed(2)}</td>
            <td><button class="remove-btn">Remove</button></td>
        `;

        // Add event listener for remove button
        row.querySelector('.remove-btn').addEventListener('click', () => removeItemFromCart(item.id));

        // Add event listeners for editable cells
        row.querySelector('[data-field="quantity"]').addEventListener('click', handleEditCell);
        row.querySelector('[data-field="unitPrice"]').addEventListener('click', handleEditCell);
    });
}

/**
 * Handles editing of quantity or unit price directly in the table.
 * @param {Event} event - The click event.
 */
function handleEditCell(event) {
    const cell = event.target;
    if (cell.querySelector('input')) return; // Already editing

    const originalValue = cell.textContent;
    const field = cell.dataset.field; // 'quantity' or 'unitPrice'
    const itemId = parseInt(cell.closest('tr').dataset.id);

    const input = document.createElement('input');
    input.type = (field === 'quantity') ? 'number' : 'text'; // Use text for unitPrice to allow decimals easily
    input.value = originalValue;
    input.classList.add('editable-input');
    input.min = (field === 'quantity') ? '1' : '0';
    if (field === 'unitPrice') input.step = '0.01';

    // Replace cell content with input
    cell.textContent = '';
    cell.appendChild(input);
    input.focus();

    const saveChanges = () => {
        let newValue = input.value.trim();
        if (field === 'quantity') {
            newValue = parseInt(newValue);
            if (isNaN(newValue) || newValue < 1) newValue = parseInt(originalValue);
        } else if (field === 'unitPrice') {
            newValue = parseFloat(newValue);
            if (isNaN(newValue) || newValue < 0) newValue = parseFloat(originalValue);
        }

        const itemIndex = cartItems.findIndex(item => item.id === itemId);
        if (itemIndex > -1) {
            const oldQuantity = cartItems[itemIndex].quantity;
            const productInDB = products.find(p => p.id === itemId);

            if (field === 'quantity') {
                // Validate new quantity against stock
                const stockChange = newValue - oldQuantity; // Positive if increasing, negative if decreasing
                if (productInDB) {
                    if (productInDB.stock < stockChange) {
                        console.error(`Not enough stock for ${cartItems[itemIndex].name}. Available: ${productInDB.stock + oldQuantity}.`);
                        newValue = oldQuantity; // Revert to old quantity
                    } else {
                        productInDB.stock -= stockChange; // Update product stock
                    }
                }
            }

            cartItems[itemIndex][field] = newValue;
            cartItems[itemIndex].total = cartItems[itemIndex].quantity * cartItems[itemIndex].unitPrice;
            renderCartItems(); // Re-render the whole table to update totals and display correctly
            calculateTotals();
        }
    };

    input.addEventListener('blur', saveChanges);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            input.blur(); // Trigger blur to save changes
        }
    });
}


/**
 * Removes an item from the cart.
 * @param {number} idToRemove - The ID of the item to remove.
 */
function removeItemFromCart(idToRemove) {
    const itemIndex = cartItems.findIndex(item => item.id === idToRemove);
    if (itemIndex > -1) {
        const removedItem = cartItems.splice(itemIndex, 1)[0];
        // Restore stock for the removed item
        const productInDB = products.find(p => p.id === removedItem.id);
        if (productInDB) {
            productInDB.stock += removedItem.quantity;
        }
        renderCartItems();
        calculateTotals();
    }
}

/**
 * Calculates the total amount of all items in the cart.
 */
function calculateTotals() {
    const grandTotal = cartItems.reduce((sum, item) => sum + item.total, 0);
    elements.grandTotalSpan.textContent = grandTotal.toFixed(2);
}

/**
 * Clears the product input fields.
 */
function clearProductInputs() {
    elements.productNameInput.value = '';
    elements.quantityInput.value = 1;
    elements.stockInput.value = '';
    elements.unitPriceInput.value = '';
    elements.productSuggestionsDiv.style.display = 'none';
    highlightedProductSuggestionIndex = -1;
}

/**
 * Opens the payment modal and sets the total amount.
 */
function openPaymentModal() {
    const total = parseFloat(elements.grandTotalSpan.textContent);
    if (total <= 0) {
        console.error('Cart is empty. Cannot proceed to payment.');
        return;
    }
    elements.modalTotalAmountInput.value = total.toFixed(2);
    elements.amountPaidInput.value = ''; // Clear previous paid amount
    elements.balanceInput.value = '0.00'; // Reset balance
    elements.paymentModal.classList.add('show');
}

/**
 * Closes the specified modal.
 * @param {string} modalId - The ID of the modal to close.
 */
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

/**
 * Updates the balance in the payment modal based on amount paid.
 */
function updateBalance() {
    const total = parseFloat(elements.modalTotalAmountInput.value);
    const amountPaid = parseFloat(elements.amountPaidInput.value);
    if (!isNaN(total) && !isNaN(amountPaid)) {
        const balance = amountPaid - total;
        elements.balanceInput.value = balance.toFixed(2);
        elements.balanceInput.style.color = balance >= 0 ? '#27ae60' : '#e74c3c'; // Green for positive, red for negative
    } else {
        elements.balanceInput.value = '0.00';
        elements.balanceInput.style.color = '#333';
    }
}

/**
 * Handles the confirmation of payment.
 */
function handleConfirmPayment() {
    const total = parseFloat(elements.modalTotalAmountInput.value);
    const amountPaid = parseFloat(elements.amountPaidInput.value);
    const balance = amountPaid - total;

    if (isNaN(amountPaid) || amountPaid < total) {
        console.error('Amount paid is insufficient.');
        return;
    }

    // Simulate printing/saving invoice
    console.log('--- Invoice Details ---');
    console.log(`Invoice No: ${elements.invoiceNumberSpan.textContent}`);
    console.log(`Customer: ${elements.customerNameInput.value || 'N/A'} (${elements.customerEmailInput.value || 'N/A'})`);
    console.log('Items:');
    cartItems.forEach(item => {
        console.log(`- ${item.name} x ${item.quantity} @ Rs.${item.unitPrice.toFixed(2)} = Rs.${item.total.toFixed(2)}`);
    });
    console.log(`Total: Rs.${total.toFixed(2)}`);
    console.log(`Amount Paid: Rs.${amountPaid.toFixed(2)}`);
    console.log(`Balance: Rs.${balance.toFixed(2)}`);
    console.log('Payment successful!');

    // Reset the cart and generate a new invoice number
    cartItems = [];
    nextInvoiceNumber++;
    elements.invoiceNumberSpan.textContent = String(nextInvoiceNumber).padStart(2, '0');
    elements.customerNameInput.value = '';
    elements.customerEmailInput.value = '';
    renderCartItems();
    calculateTotals();
    closeModal('paymentModal');
}

// The initPurchaseManagement function is called from the HTML's DOMContentLoaded listener.
// This ensures all elements are loaded before the script tries to access them.
