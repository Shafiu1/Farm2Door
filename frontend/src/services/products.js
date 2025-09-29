import api from './api';

// Products API services
export const productsService = {
    // Get all products with filters
    getAllProducts: (filters = {}) => {
        const params = new URLSearchParams();

        if (filters.page) params.append('page', filters.page);
        if (filters.limit) params.append('limit', filters.limit);
        if (filters.category) params.append('category', filters.category);
        if (filters.search) params.append('search', filters.search);
        if (filters.sortBy) params.append('sortBy', filters.sortBy);
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

        return api.get(`/products?${params.toString()}`);
    },

    // Get single product by ID
    getProductById: (productId) => {
        return api.get(`/products/${productId}`);
    },

    // Get featured products
    getFeaturedProducts: () => {
        return api.get('/products/featured');
    },

    // Get products by category
    getProductsByCategory: (category) => {
        return api.get(`/products/category/${category}`);
    },

    // Search products
    searchProducts: (query) => {
        return api.get(`/products/search?q=${encodeURIComponent(query)}`);
    },

    // Get all categories
    getCategories: () => {
        return api.get('/categories');
    },

    // Add product review
    addReview: (productId, reviewData) => {
        return api.post(`/products/${productId}/reviews`, reviewData);
    },

    // Get product reviews
    getReviews: (productId) => {
        return api.get(`/products/${productId}/reviews`);
    },
};

export default productsService;