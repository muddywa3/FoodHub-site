// Product Database
const products = [
    {
        id: 1,
        name: "Pepperoni Pizza",
        category: "pizza",
        price: 12.99,
        emoji: "🍕",
        description: "Classic pepperoni with mozzarella cheese on thin crust",
        rating: "⭐⭐⭐⭐⭐"
    },
    {
        id: 2,
        name: "Margherita Pizza",
        category: "pizza",
        price: 10.99,
        emoji: "🍕",
        description: "Fresh tomato, mozzarella, and basil",
        rating: "⭐⭐⭐⭐⭐"
    },
    {
        id: 3,
        name: "Classic Burger",
        category: "burger",
        price: 9.99,
        emoji: "🍔",
        description: "Juicy beef patty with lettuce, tomato, and special sauce",
        rating: "⭐⭐⭐⭐"
    },
    {
        id: 4,
        name: "Cheese Burger",
        category: "burger",
        price: 10.49,
        emoji: "🍔",
        description: "Double cheese with beef patty and crispy bacon",
        rating: "⭐⭐⭐⭐⭐"
    },
    {
        id: 5,
        name: "Spicy Burger",
        category: "burger",
        price: 11.99,
        emoji: "🌶️",
        description: "Hot jalapeños, spicy mayo, and crispy bacon",
        rating: "⭐⭐⭐⭐"
    },
    {
        id: 6,
        name: "Caesar Salad",
        category: "salad",
        price: 7.99,
        emoji: "🥗",
        description: "Fresh romaine, parmesan, and creamy caesar dressing",
        rating: "⭐⭐⭐⭐"
    },
    {
        id: 7,
        name: "Greek Salad",
        category: "salad",
        price: 8.49,
        emoji: "🥗",
        description: "Feta cheese, olives, tomatoes, and cucumber",
        rating: "⭐⭐⭐⭐⭐"
    },
    {
        id: 8,
        name: "Chocolate Cake",
        category: "dessert",
        price: 6.99,
        emoji: "🍰",
        description: "Rich chocolate cake with fudgy frosting",
        rating: "⭐⭐⭐⭐⭐"
    },
    {
        id: 9,
        name: "Strawberry Cheesecake",
        category: "dessert",
        price: 7.99,
        emoji: "🍓",
        description: "Creamy cheesecake with fresh strawberries",
        rating: "⭐⭐⭐⭐⭐"
    },
    {
        id: 10,
        name: "Ice Cream",
        category: "dessert",
        price: 4.99,
        emoji: "🍦",
        description: "Vanilla, chocolate, and strawberry flavors",
        rating: "⭐⭐⭐⭐"
    },
    {
        id: 11,
        name: "Cola",
        category: "drinks",
        price: 2.99,
        emoji: "🥤",
        description: "Ice cold cola drink - 16oz",
        rating: "⭐⭐⭐⭐"
    },
    {
        id: 12,
        name: "Fresh Orange Juice",
        category: "drinks",
        price: 3.99,
        emoji: "🧃",
        description: "Freshly squeezed orange juice",
        rating: "⭐⭐⭐⭐⭐"
    },
    {
        id: 13,
        name: "Iced Coffee",
        category: "drinks",
        price: 4.49,
        emoji: "☕",
        description: "Cold brew coffee with ice",
        rating: "⭐⭐⭐⭐"
    }
];

let cart = [];
let currentFilter = "all";

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    displayFeaturedProducts();
    displayMenuProducts();
    setupEventListeners();
});

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('foodhubCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('foodhubCart', JSON.stringify(cart));
    updateCartCount();
}

// Update cart count in navbar
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Display featured products
function displayFeaturedProducts() {
    const container = document.getElementById('featured-products');
    const featured = products.slice(0, 6);
    container.innerHTML = featured.map(product => createProductCard(product)).join('');
    addProductCardListeners();
}

// Display menu products
function displayMenuProducts() {
    const container = document.getElementById('menu-products');
    let filtered = currentFilter === 'all' 
        ? products 
        : products.filter(p => p.category === currentFilter);
    
    container.innerHTML = filtered.map(product => createProductCard(product)).join('');
    addProductCardListeners();
}

// Create product card HTML
function createProductCard(product) {
    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <div class="product-category">${product.category.toUpperCase()}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
                <div style="margin-top: 1rem;">
                    <div class="product-rating" style="margin-bottom: 0.5rem;">${product.rating}</div>
                    <div class="product-footer">
                        <span class="product-price">$${product.price.toFixed(2)}</span>
                        <button class="add-to-cart-btn" data-id="${product.id}">Add</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Add event listeners to product cards
function addProductCardListeners() {
    // Card click to show details
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn')) return;
            const productId = parseInt(card.dataset.id);
            showProductDetails(productId);
        });
    });

    // Add to cart button
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(btn.dataset.id);
            addToCart(productId);
            btn.textContent = '✓ Added';
            setTimeout(() => btn.textContent = 'Add', 2000);
        });
    });
}

// Show product details in modal
function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('product-modal');
    const modalBody = document.getElementById('modal-body');

    modalBody.innerHTML = `
        <div class="modal-product-image">${product.emoji}</div>
        <div class="modal-product-name">${product.name}</div>
        <div style="color: #888; margin-bottom: 0.5rem;">${product.category.toUpperCase()}</div>
        <div class="modal-product-price">$${product.price.toFixed(2)}</div>
        <div class="modal-product-description">${product.description}</div>
        <div class="product-rating" style="margin-bottom: 1rem;">${product.rating}</div>
        
        <div class="quantity-control">
            <label for="quantity">Quantity:</label>
            <button id="qty-minus">-</button>
            <input type="number" id="quantity" value="1" min="1">
            <button id="qty-plus">+</button>
        </div>

        <button class="btn btn-primary" id="modal-add-to-cart" style="width: 100%; margin-bottom: 1rem;">Add to Cart - $${product.price.toFixed(2)}</button>
        <button class="btn btn-secondary" style="width: 100%; background-color: #999; border: none; padding: 0.75rem 2rem;" onclick="closeModal()">Close</button>
    `;

    modal.style.display = 'block';

    // Quantity controls
    const quantityInput = document.getElementById('quantity');
    document.getElementById('qty-minus').addEventListener('click', () => {
        if (quantityInput.value > 1) quantityInput.value--;
        updateModalPrice(product.price);
    });
    document.getElementById('qty-plus').addEventListener('click', () => {
        quantityInput.value++;
        updateModalPrice(product.price);
    });
    quantityInput.addEventListener('change', () => {
        if (quantityInput.value < 1) quantityInput.value = 1;
        updateModalPrice(product.price);
    });

    // Add to cart from modal
    document.getElementById('modal-add-to-cart').addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value);
        for (let i = 0; i < quantity; i++) {
            addToCart(productId);
        }
        closeModal();
    });
}

// Update modal price based on quantity
function updateModalPrice(basePrice) {
    const quantity = parseInt(document.getElementById('quantity').value);
    const total = (basePrice * quantity).toFixed(2);
    document.getElementById('modal-add-to-cart').textContent = `Add to Cart - $${total}`;
}

// Close modal
function closeModal() {
    document.getElementById('product-modal').style.display = 'none';
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
}

// Setup event listeners
function setupEventListeners() {
    // Category filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.category;
            displayMenuProducts();
        });
    });

    // Modal close button
    document.querySelector('.close').addEventListener('click', closeModal);

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('product-modal');
        if (event.target === modal) {
            closeModal();
        }
    });
}
