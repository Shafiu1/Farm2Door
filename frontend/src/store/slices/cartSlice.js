import { createSlice } from '@reduxjs/toolkit';

// Load cart from localStorage
const loadCartFromStorage = () => {
    try {
        const cartData = localStorage.getItem('freshmart_cart');
        return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
        return [];
    }
};

// Save cart to localStorage
const saveCartToStorage = (cartItems) => {
    try {
        localStorage.setItem('freshmart_cart', JSON.stringify(cartItems));
    } catch (error) {
        console.error('Error saving cart to localStorage:', error);
    }
};

const initialState = {
    items: loadCartFromStorage(),
    totalQuantity: 0,
    totalAmount: 0,
    isLoading: false,
    error: null,
};

// Calculate totals
const calculateTotals = (items) => {
    const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
    const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    return { totalQuantity, totalAmount };
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        ...initialState,
        ...calculateTotals(initialState.items),
    },
    reducers: {
        addToCart: (state, action) => {
            const { id, name, price, image, unit, stock } = action.payload;

            const existingItem = state.items.find(item => item.id === id);

            if (existingItem) {
                if (existingItem.quantity < stock) {
                    existingItem.quantity += 1;
                }
            } else {
                state.items.push({
                    id,
                    name,
                    price,
                    image,
                    unit,
                    stock,
                    quantity: 1,
                });
            }

            // Recalculate totals
            const totals = calculateTotals(state.items);
            state.totalQuantity = totals.totalQuantity;
            state.totalAmount = totals.totalAmount;

            // Save to localStorage
            saveCartToStorage(state.items);
        },

        removeFromCart: (state, action) => {
            const itemId = action.payload;
            state.items = state.items.filter(item => item.id !== itemId);

            // Recalculate totals
            const totals = calculateTotals(state.items);
            state.totalQuantity = totals.totalQuantity;
            state.totalAmount = totals.totalAmount;

            // Save to localStorage
            saveCartToStorage(state.items);
        },

        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.items.find(item => item.id === id);

            if (item) {
                if (quantity > 0 && quantity <= item.stock) {
                    item.quantity = quantity;
                } else if (quantity === 0) {
                    state.items = state.items.filter(item => item.id !== id);
                }
            }

            // Recalculate totals
            const totals = calculateTotals(state.items);
            state.totalQuantity = totals.totalQuantity;
            state.totalAmount = totals.totalAmount;

            // Save to localStorage
            saveCartToStorage(state.items);
        },

        clearCart: (state) => {
            state.items = [];
            state.totalQuantity = 0;
            state.totalAmount = 0;

            // Clear localStorage
            localStorage.removeItem('freshmart_cart');
        },

        incrementQuantity: (state, action) => {
            const itemId = action.payload;
            const item = state.items.find(item => item.id === itemId);

            if (item && item.quantity < item.stock) {
                item.quantity += 1;

                // Recalculate totals
                const totals = calculateTotals(state.items);
                state.totalQuantity = totals.totalQuantity;
                state.totalAmount = totals.totalAmount;

                // Save to localStorage
                saveCartToStorage(state.items);
            }
        },

        decrementQuantity: (state, action) => {
            const itemId = action.payload;
            const item = state.items.find(item => item.id === itemId);

            if (item) {
                if (item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    state.items = state.items.filter(item => item.id !== itemId);
                }

                // Recalculate totals
                const totals = calculateTotals(state.items);
                state.totalQuantity = totals.totalQuantity;
                state.totalAmount = totals.totalAmount;

                // Save to localStorage
                saveCartToStorage(state.items);
            }
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    incrementQuantity,
    decrementQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;