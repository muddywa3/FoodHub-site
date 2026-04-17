const AUTH_SESSION_KEY = 'foodhubAdminLoggedIn';
const ADMIN_PASSWORD = 'admin123';

const loginForm = document.getElementById('admin-login-form');
const passwordInput = document.getElementById('admin-password');
const loginError = document.getElementById('login-error');

function checkAlreadyLoggedIn() {
    if (sessionStorage.getItem(AUTH_SESSION_KEY) === 'true') {
        window.location.href = 'admin.html';
    }
}

function showError(message) {
    loginError.textContent = message;
    loginError.style.display = 'block';
}

function clearError() {
    loginError.textContent = '';
    loginError.style.display = 'none';
}

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    clearError();

    const password = passwordInput.value.trim();
    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
        window.location.href = 'admin.html';
        return;
    }

    showError('Invalid password. Please try again.');
    passwordInput.focus();
});

window.addEventListener('DOMContentLoaded', () => {
    checkAlreadyLoggedIn();
});
