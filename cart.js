// Cart Management
const DELIVERY_FEE = 2.99;
const TAX_RATE = 0.10;

document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    displayCart();
    updateCartCount();
});

// Display cart items
function displayCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart');

    if (cart.length === 0) {
        cartItemsContainer.style.display = 'none';
        emptyCartMessage.style.display = 'block';
        updateOrderSummary();
        return;
    }

    cartItemsContainer.style.display = 'block';
    emptyCartMessage.style.display = 'none';

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">${item.emoji}</div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-remove" onclick="removeFromCart(${item.id})">Remove</div>
            </div>
            <div class="cart-item-controls">
                <button onclick="decreaseQuantity(${item.id})">−</button>
                <input type="number" class="cart-item-quantity" value="${item.quantity}" disabled>
                <button onclick="increaseQuantity(${item.id})">+</button>
            </div>
        </div>
    `).join('');

    updateOrderSummary();
    setupCheckoutListener();
}

// Increase item quantity
function increaseQuantity(productId) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity++;
        saveCart();
        displayCart();
    }
}

// Decrease item quantity
function decreaseQuantity(productId) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        if (item.quantity > 1) {
            item.quantity--;
        } else {
            removeFromCart(productId);
            return;
        }
        saveCart();
        displayCart();
    }
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    displayCart();
}

// Update order summary
function updateOrderSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + DELIVERY_FEE + tax;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

// Setup checkout listener
function setupCheckoutListener() {
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            proceedToCheckout();
        });
    }
}

// Proceed to checkout
function proceedToCheckout() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + DELIVERY_FEE + tax;

    // Create order summary
    const orderSummary = {
        items: cart.map(item => `${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}`).join('\n'),
        subtotal: subtotal.toFixed(2),
        delivery: DELIVERY_FEE.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2)
    };

    // Show checkout form
    showCheckoutForm(orderSummary);
}

// Show checkout form
function showCheckoutForm(orderSummary) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
    `;

    modal.innerHTML = `
        <div style="
            background-color: white;
            padding: 2rem;
            border-radius: 10px;
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
        ">
            <h2 style="color: #ff6b35; margin-bottom: 1.5rem;">Checkout</h2>
            
            <form id="checkout-form" style="display: flex; flex-direction: column; gap: 1rem;">
                <div>
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Full Name *</label>
                    <input type="text" required style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 5px;">
                </div>

                <div>
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Email Address *</label>
                    <input type="email" required style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 5px;">
                </div>

                <div>
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Phone Number *</label>
                    <input type="tel" required style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 5px;">
                </div>

                <div>
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Delivery Address *</label>
                    <textarea required style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 5px; resize: vertical; min-height: 80px;"></textarea>
                </div>

                <div>
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Delivery Instructions</label>
                    <textarea style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 5px; resize: vertical; min-height: 60px; color: #999;" placeholder="Leave at door, ring bell, etc."></textarea>
                </div>

                <div style="background-color: #f9f9f9; padding: 1rem; border-radius: 5px; margin-bottom: 1rem;">
                    <h3 style="color: #333; margin-bottom: 0.75rem;">Order Summary</h3>
                    <p style="font-size: 0.9rem; white-space: pre-wrap; color: #666; margin-bottom: 1rem;">${orderSummary.items}</p>
                    <div style="border-top: 1px solid #ddd; padding-top: 0.75rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span>Subtotal:</span>
                            <span>$${orderSummary.subtotal}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span>Delivery:</span>
                            <span>$${orderSummary.delivery}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span>Tax:</span>
                            <span>$${orderSummary.tax}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-weight: bold; color: #ff6b35; border-top: 1px solid #ddd; padding-top: 0.5rem;">
                            <span>Total:</span>
                            <span>$${orderSummary.total}</span>
                        </div>
                    </div>
                </div>

                <div>
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Payment Method *</label>
                    <select required style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 5px;">
                        <option value="">Select payment method</option>
                        <option value="credit-card">Credit Card</option>
                        <option value="debit-card">Debit Card</option>
                        <option value="paypal">PayPal</option>
                        <option value="cash">Cash on Delivery</option>
                    </select>
                </div>

                <button type="submit" style="
                    background-color: #ff6b35;
                    color: white;
                    padding: 0.75rem 2rem;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: bold;
                    margin-top: 0.5rem;
                ">Place Order</button>

                <button type="button" onclick="this.closest('div').parentElement.remove()" style="
                    background-color: #999;
                    color: white;
                    padding: 0.75rem 2rem;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                ">Cancel</button>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    // Handle form submission
    document.getElementById('checkout-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        completeOrder(formData, orderSummary);
    });
}

// Complete order
function completeOrder(formData, orderSummary) {
    const name = formData.get('Full Name') || document.querySelector('input[type="text"]').value;
    
    // Save order
    const order = {
        id: 'ORD-' + Date.now(),
        date: new Date().toLocaleString(),
        customer: name,
        items: cart,
        total: orderSummary.total,
        status: 'Pending'
    };

    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Clear cart
    cart = [];
    saveCart();

    // Show confirmation
    alert(`✓ Order placed successfully!\n\nOrder ID: ${order.id}\nTotal: $${orderSummary.total}\n\nThank you for your order!`);
    
    // Remove modal and redirect
    document.querySelector('div[style*="position: fixed"]').remove();
    window.location.href = 'index.html';
}

