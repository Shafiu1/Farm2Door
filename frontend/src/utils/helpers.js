// Format price to Bangladeshi currency
export const formatPrice = (price) => {
    return `৳${price.toLocaleString('en-BD')}`;
};

// Format date to Bangladesh format
export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

// Format date with time
export const formatDateTime = (date) => {
    return new Date(date).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

// Truncate text
export const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

// Calculate discount percentage
export const calculateDiscount = (originalPrice, salePrice) => {
    if (!originalPrice || originalPrice <= salePrice) return 0;
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};

// Validate email
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validate Bangladesh phone number
export const isValidBDPhone = (phone) => {
    const phoneRegex = /^(\+880|880)?1[3-9]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s|-/g, ''));
};

// Format phone number
export const formatPhoneNumber = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('880')) {
        return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
    }
    if (cleaned.startsWith('0')) {
        return `+880 ${cleaned.slice(1, 5)}-${cleaned.slice(5)}`;
    }
    return phone;
};

// Debounce function for search
export const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

// Get delivery estimate
export const getDeliveryEstimate = (city) => {
    const estimates = {
        'Dhaka': '30-60 minutes',
        'Chittagong': '1-2 hours',
        'Sylhet': '2-3 hours',
        'Rajshahi': '2-3 hours',
        'Khulna': '2-3 hours',
        'Barisal': '3-4 hours',
        'Rangpur': '3-4 hours',
        'Mymensingh': '1-2 hours',
    };
    return estimates[city] || '2-4 hours';
};

// Generate order ID
export const generateOrderId = () => {
    return 'ORD-' + Date.now().toString().slice(-8);
};

// Get status color
export const getStatusColor = (status) => {
    const colors = {
        pending: 'bg-yellow-100 text-yellow-700',
        processing: 'bg-blue-100 text-blue-700',
        shipping: 'bg-purple-100 text-purple-700',
        delivered: 'bg-green-100 text-green-700',
        cancelled: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
};

// Check if product is in stock
export const isInStock = (stock) => {
    return stock > 0;
};

// Get stock status text
export const getStockStatus = (stock) => {
    if (stock === 0) return 'Out of Stock';
    if (stock < 10) return 'Low Stock';
    return 'In Stock';
};

// Convert to slug
export const toSlug = (text) => {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
};