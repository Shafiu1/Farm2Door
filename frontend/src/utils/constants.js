// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// App Configuration
export const APP_NAME = 'Freshmart';
export const APP_VERSION = '1.0.0';

// Pagination
export const ITEMS_PER_PAGE = 12;
export const MAX_PAGE_BUTTONS = 5;

// Free Delivery Threshold
export const FREE_DELIVERY_THRESHOLD = 500;
export const DELIVERY_CHARGE = 50;

// Order Status
export const ORDER_STATUS = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    SHIPPING: 'shipping',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
};

// Payment Methods
export const PAYMENT_METHODS = {
    BKASH: 'bkash',
    NAGAD: 'nagad',
    ROCKET: 'rocket',
    COD: 'cod',
    CARD: 'card',
};

// Product Categories
export const CATEGORIES = [
    { id: 'vegetables', name: 'Vegetables', namebn: 'সবজি' },
    { id: 'fruits', name: 'Fruits', namebn: 'ফল' },
    { id: 'fish-meat', name: 'Fish & Meat', namebn: 'মাছ ও মাংস' },
    { id: 'dairy', name: 'Dairy', namebn: 'দুগ্ধজাত' },
    { id: 'rice-flour', name: 'Rice & Flour', namebn: 'চাল ও আটা' },
    { id: 'oil-spices', name: 'Oil & Spices', namebn: 'তেল ও মসলা' },
    { id: 'snacks', name: 'Snacks', namebn: 'স্ন্যাকস' },
    { id: 'beverages', name: 'Beverages', namebn: 'পানীয়' },
];

// Bangladesh Divisions
export const BD_DIVISIONS = [
    'Dhaka',
    'Chittagong',
    'Rajshahi',
    'Khulna',
    'Barisal',
    'Sylhet',
    'Rangpur',
    'Mymensingh',
];

// Sort Options
export const SORT_OPTIONS = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Rating' },
    { value: 'newest', label: 'Newest First' },
];

// Local Storage Keys
export const STORAGE_KEYS = {
    TOKEN: 'token',
    CART: 'freshmart_cart',
    USER: 'freshmart_user',
    THEME: 'freshmart_theme',
};

// API Endpoints
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        PROFILE: '/auth/profile',
    },
    PRODUCTS: {
        LIST: '/products',
        DETAIL: '/products/:id',
        FEATURED: '/products/featured',
        CATEGORIES: '/categories',
    },
    CART: {
        GET: '/cart',
        ADD: '/cart/add',
        UPDATE: '/cart/update',
        REMOVE: '/cart/remove',
        CLEAR: '/cart/clear',
    },
    ORDERS: {
        CREATE: '/orders',
        LIST: '/orders/user',
        DETAIL: '/orders/:id',
        TRACK: '/orders/:id/track',
    },
    PAYMENTS: {
        BKASH: '/payments/bkash',
        NAGAD: '/payments/nagad',
        ROCKET: '/payments/rocket',
    },
};

// Validation Rules
export const VALIDATION = {
    PASSWORD_MIN_LENGTH: 6,
    PHONE_LENGTH: 11,
    MAX_CART_QUANTITY: 99,
    MIN_ORDER_AMOUNT: 50,
};

// Toast Duration
export const TOAST_DURATION = 3000;

// Image Placeholder
export const PLACEHOLDER_IMAGE = '/api/placeholder/400/300';