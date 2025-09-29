import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// MOCK LOGIN - Remove this when backend is ready
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock validation
            if (email === 'demo@freshmart.com' && password === 'demo123') {
                const mockUser = {
                    id: 1,
                    name: 'Demo User',
                    email: 'demo@freshmart.com',
                    phone: '+880 1700-000000',
                };

                const mockToken = 'mock-jwt-token-' + Date.now();

                return {
                    user: mockUser,
                    token: mockToken,
                };
            } else {
                return rejectWithValue('Invalid email or password');
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// MOCK REGISTER - Remove this when backend is ready
export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData, { rejectWithValue }) => {
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock user creation
            const mockUser = {
                id: Date.now(),
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
            };

            const mockToken = 'mock-jwt-token-' + Date.now();

            return {
                user: mockUser,
                token: mockToken,
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    user: null,
    token: localStorage.getItem('token'),
    isLoading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem('token'),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login cases
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.error = null;
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            })
            // Register cases
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.error = null;
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            });
    },
});

export const { clearError, logout, setUser } = authSlice.actions;
export default authSlice.reducer;