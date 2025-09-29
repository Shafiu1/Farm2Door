import api from './api';

// Cart API services (for syncing with backend)
export const cartService = {
    // Get user's cart from server
    getCart: () => {
        return api.get('/cart');
    },

    // Add item to cart
    addToCart: (productId, quantity) => {
        return api.post('/cart/add', { productId, quantity });
    },

    // Update cart item quantity
    updateCartItem: (itemId, quantity) => {
        return api.put(`/cart/items/${itemId}`, { quantity });
    },

    // Remove item from cart
    removeFromCart: (itemId) => {
        return api.delete(`/cart/items/${itemId}`);
    },

    // Clear entire cart
    clearCart: () => {
        return api.delete('/cart');
    },

    // Sync local cart with server
    syncCart: (cartItems) => {
        return api.post('/cart/sync', { items: cartItems });
    },

    // Apply coupon code
    applyCoupon: (couponCode) => {
        return api.post('/cart/coupon', { code: couponCode });
    },

    // Remove coupon
    removeCoupon: () => {
        return api.delete('/cart/coupon');
    },

    // Get cart summary (totals, taxes, etc)
    getCartSummary: () => {
        return api.get('/cart/summary');
    },
};

export default cartService;