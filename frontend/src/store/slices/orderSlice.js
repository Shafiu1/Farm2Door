import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for creating order
export const createOrder = createAsyncThunk(
    'orders/createOrder',
    async (orderData, { rejectWithValue }) => {
        try {
            const response = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                const error = await response.json();
                return rejectWithValue(error.message);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk for fetching user orders
export const fetchUserOrders = createAsyncThunk(
    'orders/fetchUserOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/orders/user', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                const error = await response.json();
                return rejectWithValue(error.message);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk for fetching single order
export const fetchOrderById = createAsyncThunk(
    'orders/fetchOrderById',
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                const error = await response.json();
                return rejectWithValue(error.message);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk for updating order status
export const updateOrderStatus = createAsyncThunk(
    'orders/updateOrderStatus',
    async ({ orderId, status }, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) {
                const error = await response.json();
                return rejectWithValue(error.message);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    orders: [],
    currentOrder: null,
    isLoading: false,
    error: null,
    orderStatus: 'idle', // idle, creating, created, failed
};

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearCurrentOrder: (state) => {
            state.currentOrder = null;
        },
        resetOrderStatus: (state) => {
            state.orderStatus = 'idle';
        },
    },
    extraReducers: (builder) => {
        builder
            // Create order cases
            .addCase(createOrder.pending, (state) => {
                state.isLoading = true;
                state.orderStatus = 'creating';
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderStatus = 'created';
                state.currentOrder = action.payload;
                state.orders.unshift(action.payload);
                state.error = null;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.orderStatus = 'failed';
                state.error = action.payload;
            })
            // Fetch user orders cases
            .addCase(fetchUserOrders.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orders = action.payload;
                state.error = null;
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Fetch single order cases
            .addCase(fetchOrderById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentOrder = action.payload;
                state.error = null;
            })
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Update order status cases
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                const updatedOrder = action.payload;
                const index = state.orders.findIndex(order => order.id === updatedOrder.id);
                if (index !== -1) {
                    state.orders[index] = updatedOrder;
                }
                if (state.currentOrder && state.currentOrder.id === updatedOrder.id) {
                    state.currentOrder = updatedOrder;
                }
            });
    },
});

export const {
    clearError,
    clearCurrentOrder,
    resetOrderStatus,
} = orderSlice.actions;

export default orderSlice.reducer;