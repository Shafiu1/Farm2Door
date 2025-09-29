import api from './api';

// Orders API services
export const ordersService = {
    // Create new order
    createOrder: (orderData) => {
        return api.post('/orders', orderData);
    },

    // Get all user orders
    getUserOrders: () => {
        return api.get('/orders/user');
    },

    // Get single order by ID
    getOrderById: (orderId) => {
        return api.get(`/orders/${orderId}`);
    },

    // Cancel order
    cancelOrder: (orderId) => {
        return api.put(`/orders/${orderId}/cancel`);
    },

    // Track order
    trackOrder: (orderId) => {
        return api.get(`/orders/${orderId}/track`);
    },

    // Get order invoice
    getInvoice: (orderId) => {
        return api.get(`/orders/${orderId}/invoice`, {
            responseType: 'blob',
        });
    },

    // Reorder
    reorder: (orderId) => {
        return api.post(`/orders/${orderId}/reorder`);
    },
};

export default ordersService;