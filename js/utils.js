// API Base URL
const API_BASE_URL = 'http://localhost:3000/api';

// Error handling utility
const handleError = (error) => {
    console.error('Error:', error);
    const message = error.response?.data?.message || error.message || 'Ocorreu um erro. Tente novamente.';
    showNotification(message, 'error');
};

// Show notification utility
const showNotification = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type === 'error' ? 'danger' : 'success'} border-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    const container = document.getElementById('toast-container') || createToastContainer();
    container.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
};

// Create toast container if it doesn't exist
const createToastContainer = () => {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    document.body.appendChild(container);
    return container;
};

// Authentication utilities
const setAuthToken = (token) => {
    localStorage.setItem('authToken', token);
};

const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

const removeAuthToken = () => {
    localStorage.removeItem('authToken');
};

const isAuthenticated = () => {
    return !!getAuthToken();
};

// API call utility with authentication
const apiCall = async (endpoint, options = {}) => {
    try {
        const token = getAuthToken();
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        };

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        handleError(error);
        throw error;
    }
};

// Form data to JSON utility
const formDataToJson = (form) => {
    const formData = new FormData(form);
    const data = {};
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    return data;
};

// Export utilities
export {
    apiCall,
    handleError,
    showNotification,
    setAuthToken,
    getAuthToken,
    removeAuthToken,
    isAuthenticated,
    formDataToJson
};
