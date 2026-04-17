const STORAGE_KEY = 'foodhubProducts';
const ORDER_STORAGE_KEY = 'orders';
const AUTH_SESSION_KEY = 'foodhubAdminLoggedIn';
const ADMIN_PASSWORD = 'admin123';

const defaultProducts = [
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

let services = [];
let currentEditId = null;

const serviceTableContainer = document.getElementById('service-table-container');
const orderTableContainer = document.getElementById('order-table-container');
const serviceFormCard = document.getElementById('service-form-card');
const serviceForm = document.getElementById('service-form');
const showAddServiceBtn = document.getElementById('show-add-service');
const cancelServiceBtn = document.getElementById('cancel-service');
const resetServicesBtn = document.getElementById('reset-services');
const tabServicesBtn = document.getElementById('tab-services');
const tabOrdersBtn = document.getElementById('tab-orders');
const logoutBtn = document.getElementById('logout-btn');

function loadServices() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            services = JSON.parse(saved);
        } catch (e) {
            services = [...defaultProducts];
            saveServices();
        }
    } else {
        services = [...defaultProducts];
        saveServices();
    }
}

function saveServices() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
}

function renderServiceTable() {
    if (services.length === 0) {
        serviceTableContainer.innerHTML = `
            <div class="admin-empty-state">
                <h2>No services available</h2>
                <p>Add a new service using the form below.</p>
            </div>
        `;
        return;
    }

    const rows = services.map(service => `
        <tr>
            <td>${service.id}</td>
            <td>${service.emoji}</td>
            <td>${service.name}</td>
            <td>${service.category}</td>
            <td>$${service.price.toFixed(2)}</td>
            <td>${service.rating}</td>
            <td class="actions">
                <button class="btn btn-primary" onclick="editService(${service.id})">Edit</button>
                <button class="btn btn-secondary" onclick="deleteService(${service.id})">Delete</button>
            </td>
        </tr>
    `).join('');

    serviceTableContainer.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Icon</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Rating</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `;
}

function renderOrderTable() {
    const orders = loadOrders();
    if (orders.length === 0) {
        orderTableContainer.innerHTML = `
            <div class="admin-empty-state">
                <h2>No orders yet</h2>
                <p>Orders will appear here after customers place them.</p>
            </div>
        `;
        return;
    }

    const rows = orders.map(order => {
        const items = order.items.map(item => `${item.quantity}× ${item.name}`).join(', ');
        const status = order.status || 'Pending';
        const statusClass = status === 'Completed' ? 'completed' : 'pending';

        return `
            <tr>
                <td>${order.id}</td>
                <td>${order.date}</td>
                <td>${order.customer}</td>
                <td>${items}</td>
                <td>$${parseFloat(order.total).toFixed(2)}</td>
                <td><span class="order-status ${statusClass}">${status}</span></td>
                <td class="actions">
                    <button class="btn btn-primary" onclick="toggleOrderStatus('${order.id}')">${status === 'Completed' ? 'Mark Pending' : 'Mark Completed'}</button>
                    <button class="btn btn-secondary" onclick="deleteOrder('${order.id}')">Delete</button>
                </td>
            </tr>
        `;
    }).join('');

    orderTableContainer.innerHTML = `
        <table class="admin-order-table">
            <thead>
                <tr>
                    <th>Order</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `;
}

function toggleOrderStatus(orderId) {
    const orders = loadOrders().map(order => {
        if (order.id !== orderId) return order;
        return {
            ...order,
            status: order.status === 'Completed' ? 'Pending' : 'Completed'
        };
    });
    saveOrders(orders);
    renderOrderTable();
}

function deleteOrder(orderId) {
    if (!confirm('Delete this order? This cannot be undone.')) return;
    const orders = loadOrders().filter(order => order.id !== orderId);
    saveOrders(orders);
    renderOrderTable();
}

function openForm(editMode = false) {
    serviceFormCard.style.display = 'block';
    document.getElementById('form-title').textContent = editMode ? 'Edit Service' : 'Add Service';
    document.getElementById('save-service').textContent = editMode ? 'Update Service' : 'Add Service';
}

function closeForm() {
    serviceFormCard.style.display = 'none';
    currentEditId = null;
    serviceForm.reset();
    document.getElementById('service-id').value = '';
}

function populateForm(service) {
    document.getElementById('service-id').value = service.id;
    document.getElementById('service-name').value = service.name;
    document.getElementById('service-category').value = service.category;
    document.getElementById('service-price').value = service.price;
    document.getElementById('service-emoji').value = service.emoji;
    document.getElementById('service-description').value = service.description;
    document.getElementById('service-rating').value = service.rating;
}

function editService(id) {
    const service = services.find(item => item.id === id);
    if (!service) return;
    currentEditId = id;
    populateForm(service);
    openForm(true);
}

function deleteService(id) {
    if (!confirm('Delete this service? This cannot be undone.')) return;
    services = services.filter(item => item.id !== id);
    saveServices();
    renderServiceTable();
}

function resetServices() {
    if (!confirm('Reset the service list to default products?')) return;
    services = [...defaultProducts];
    saveServices();
    renderServiceTable();
    closeForm();
}

function getNextId() {
    if (services.length === 0) return 1;
    return Math.max(...services.map(item => item.id)) + 1;
}

function loadOrders() {
    return JSON.parse(localStorage.getItem(ORDER_STORAGE_KEY) || '[]');
}

function saveOrders(orders) {
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
}

function checkAuth() {
    if (sessionStorage.getItem(AUTH_SESSION_KEY) !== 'true') {
        window.location.href = 'admin-login.html';
    }
}

function logout() {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    window.location.href = 'admin-login.html';
}

function showServicesTab() {
    tabServicesBtn.classList.add('active');
    tabOrdersBtn.classList.remove('active');
    serviceTableContainer.style.display = 'block';
    orderTableContainer.style.display = 'none';
    closeForm();
    renderServiceTable();
}

function showOrdersTab() {
    tabServicesBtn.classList.remove('active');
    tabOrdersBtn.classList.add('active');
    serviceTableContainer.style.display = 'none';
    orderTableContainer.style.display = 'block';
    closeForm();
    renderOrderTable();
}

function setupTabListeners() {
    tabServicesBtn.addEventListener('click', showServicesTab);
    tabOrdersBtn.addEventListener('click', showOrdersTab);
    logoutBtn.addEventListener('click', logout);
}

serviceForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const idValue = document.getElementById('service-id').value;
    const name = document.getElementById('service-name').value.trim();
    const category = document.getElementById('service-category').value;
    const price = parseFloat(document.getElementById('service-price').value);
    const emoji = document.getElementById('service-emoji').value.trim() || '🍽️';
    const description = document.getElementById('service-description').value.trim();
    const rating = document.getElementById('service-rating').value.trim() || '⭐⭐⭐⭐';

    if (!name || !description || Number.isNaN(price)) {
        alert('Please fill all fields correctly.');
        return;
    }

    const serviceData = {
        id: idValue ? parseInt(idValue, 10) : getNextId(),
        name,
        category,
        price,
        emoji,
        description,
        rating
    };

    if (idValue) {
        services = services.map(item => item.id === serviceData.id ? serviceData : item);
    } else {
        services.push(serviceData);
    }

    saveServices();
    renderServiceTable();
    closeForm();
});

showAddServiceBtn.addEventListener('click', () => {
    currentEditId = null;
    serviceForm.reset();
    document.getElementById('service-id').value = '';
    openForm(false);
});

cancelServiceBtn.addEventListener('click', () => {
    closeForm();
});

resetServicesBtn.addEventListener('click', resetServices);

window.editService = editService;
window.deleteService = deleteService;
window.toggleOrderStatus = toggleOrderStatus;
window.deleteOrder = deleteOrder;

window.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadServices();
    setupTabListeners();
    showServicesTab();
});
