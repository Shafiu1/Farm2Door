import api from './api';

// Authentication API services
export const authService = {
    // Register new user
    register: (userData) => {
        return api.post('/auth/register', userData);
    },

    // Login user
    login: (credentials) => {
        return api.post('/auth/login', credentials);
    },

    // Logout user
    logout: () => {
        localStorage.removeItem('token');
        return api.post('/auth/logout');
    },

    // Get current user profile
    getCurrentUser: () => {
        return api.get('/auth/profile');
    },

    // Update user profile
    updateProfile: (userData) => {
        return api.put('/auth/profile', userData);
    },

    // Change password
    changePassword: (passwordData) => {
        return api.put('/auth/change-password', passwordData);
    },

    // Forgot password
    forgotPassword: (email) => {
        return api.post('/auth/forgot-password', { email });
    },

    // Reset password
    resetPassword: (token, newPassword) => {
        return api.post('/auth/reset-password', { token, newPassword });
    },
};

export default authService;