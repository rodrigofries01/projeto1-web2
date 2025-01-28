class BasePage {
    constructor() {
        this.isInitialized = false;
    }

    initialize() {
        if (this.isInitialized) return;
        this.isInitialized = true;
    }

    showNotification(message, type = 'info') {
        // You can implement a notification system here
        console.log(`${type}: ${message}`);
    }

    isUserLoggedIn() {
        return localStorage.getItem('userToken') !== null;
    }

    getCurrentUser() {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    }
}
