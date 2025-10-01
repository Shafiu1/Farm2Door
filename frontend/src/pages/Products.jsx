import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, ChevronDown } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import Loading from '../components/common/Loading';
import api from '../services/api';
import toast from 'react-hot-toast';

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [showFilters, setShowFilters] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
    const [sortBy, setSortBy] = useState('name');
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalProducts, setTotalProducts] = useState(0);

    // Fetch categories
    useEffect(() => {
        fetchCategories();
    }, []);

    // Fetch products when filters change
    useEffect(() => {
        fetchProducts();
    }, [selectedCategory, sortBy, priceRange]);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories([
                { _id: 'all', name: 'All Products', namebn: 'সব পণ্য' },
                ...response.categories
            ]);
        } catch (error) {
            toast.error('Failed to fetch categories');
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = {
                sortBy: sortBy,
                minPrice: priceRange[0],
                maxPrice: priceRange[1],
            };

            if (selectedCategory && selectedCategory !== 'all') {
                params.category = selectedCategory;
            }

            const response = await api.get('/products', { params });
            setProducts(response.products || []);
            setTotalProducts(response.totalProducts || 0);
        } catch (error) {
            toast.error('Failed to fetch products');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        if (categoryId && categoryId !== 'all') {
            setSearchParams({ category: categoryId });
        } else {
            setSearchParams({});
        }
    };

    const clearFilters = () => {
        setSelectedCategory('');
        setSortBy('name');
        setPriceRange([0, 1000]);
        setSearchParams({});
    };

    if (loading) {
        return <Loading fullScreen />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="container py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
                            <p className="text-gray-600 mt-1 text-bangla">সকল পণ্য দেখুন</p>
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden btn-outline flex items-center gap-2"
                        >
                            <Filter size={20} />
                            Filters
                        </button>
                    </div>
                </div>
            </div>

            <div className="container py-8">
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar Filters - Desktop */}
                    <div className={`lg:block ${showFilters ? 'block' : 'hidden'}`}>
                        <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold">Filters</h2>
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                                >
                                    Clear All
                                </button>
                            </div>

                            {/* Categories Filter */}
                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
                                <div className="space-y-2">
                                    {categories.map((category) => (
                                        <label
                                            key={category._id}
                                            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                                        >
                                            <input
                                                type="radio"
                                                name="category"
                                                checked={selectedCategory === category._id || (!selectedCategory && category._id === 'all')}
                                                onChange={() => handleCategoryChange(category._id)}
                                                className="w-4 h-4 text-green-600 border-gray-300"
                                            />
                                            <span className="text-gray-700">{category.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range Filter */}
                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
                                <div className="space-y-3">
                                    <input
                                        type="range"
                                        min="0"
                                        max="1000"
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                                        className="w-full"
                                    />
                                    <div className="flex items-center justify-between text-sm text-gray-600">
                                        <span>৳{priceRange[0]}</span>
                                        <span>৳{priceRange[1]}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Sort By */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">Sort By</h3>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none"
                                >
                                    <option value="name">Name (A-Z)</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="rating">Rating</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="lg:col-span-3">
                        {/* Results Info */}
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-gray-600">
                                Showing <span className="font-semibold">{products.length}</span> of <span className="font-semibold">{totalProducts}</span> products
                            </p>

                            {/* Mobile Sort */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="lg:hidden px-4 py-2 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none"
                            >
                                <option value="name">Name (A-Z)</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Rating</option>
                            </select>
                        </div>

                        {/* Products Grid */}
                        {products.length > 0 ? (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <p className="text-gray-500 text-lg">No products found</p>
                                <button
                                    onClick={clearFilters}
                                    className="btn-primary mt-4"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;
