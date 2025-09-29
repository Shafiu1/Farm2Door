import api from './api';

// Payment API services
export const paymentsService = {
    // Initialize bKash payment
    initiateBkashPayment: (orderData) => {
        return api.post('/payments/bkash/initiate', orderData);
    },

    // Execute bKash payment
    executeBkashPayment: (paymentID) => {
        return api.post('/payments/bkash/execute', { paymentID });
    },

    // Query bKash payment
    queryBkashPayment: (paymentID) => {
        return api.get(`/payments/bkash/query/${paymentID}`);
    },

    // Initialize Nagad payment
    initiateNagadPayment: (orderData) => {
        return api.post('/payments/nagad/initiate', orderData);
    },

    // Verify Nagad payment
    verifyNagadPayment: (paymentRefId) => {
        return api.post('/payments/nagad/verify', { paymentRefId });
    },

    // Initialize Rocket payment
    initiateRocketPayment: (orderData) => {
        return api.post('/payments/rocket/initiate', orderData);
    },

    // Get payment history
    getPaymentHistory: () => {
        return api.get('/payments/history');
    },

    // Get payment details
    getPaymentDetails: (paymentId) => {
        return api.get(`/payments/${paymentId}`);
    },

    // Refund payment
    refundPayment: (paymentId, refundData) => {
        return api.post(`/payments/${paymentId}/refund`, refundData);
    },
};

export default paymentsService;