import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, ChevronDown } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [showFilters, setShowFilters] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
    const [sortBy, setSortBy] = useState('name');
    const [priceRange, setPriceRange] = useState([0, 1000]);

    // Sample categories
    const categories = [
        { id: 'all', name: 'All Products', namebn: 'সব পণ্য' },
        { id: 'vegetables', name: 'Vegetables', namebn: 'সবজি' },
        { id: 'fruits', name: 'Fruits', namebn: 'ফল' },
        { id: 'fish-meat', name: 'Fish & Meat', namebn: 'মাছ ও মাংস' },
        { id: 'dairy', name: 'Dairy', namebn: 'দুগ্ধজাত' },
        { id: 'rice-flour', name: 'Rice & Flour', namebn: 'চাল ও আটা' },
        { id: 'oil-spices', name: 'Oil & Spices', namebn: 'তেল ও মসলা' },
        { id: 'snacks', name: 'Snacks', namebn: 'স্ন্যাকস' },
    ];

    // Sample products data
    const [products] = useState([
        {
            id: 1,
            name: 'Fresh Tomatoes',
            namebn: 'তাজা টমেটো',
            price: 45,
            originalPrice: 60,
            image: '/api/placeholder/300/200',
            rating: 4.5,
            reviews: 24,
            inStock: true,
            unit: 'kg',
            category: 'vegetables',
            isOrganic: true,
            stock: 50
        },
        {
            id: 2,
            name: 'Organic Carrots',
            namebn: 'জৈব গাজর',
            price: 35,
            originalPrice: 50,
            image: '/api/placeholder/300/200',
            rating: 4.8,
            reviews: 18,
            inStock: true,
            unit: 'kg',
            category: 'vegetables',
            isOrganic: true,
            stock: 30
        },
        {
            id: 3,
            name: 'Fresh Milk',
            namebn: 'তাজা দুধ',
            price: 65,
            originalPrice: 75,
            image: '/api/placeholder/300/200',
            rating: 4.7,
            reviews: 32,
            inStock: true,
            unit: 'liter',
            category: 'dairy',
            isOrganic: false,
            stock: 25
        },
        {
            id: 4,
            name: 'Green Apples',
            namebn: 'সবুজ আপেল',
            price: 120,
            originalPrice: 150,
            image: '/api/placeholder/300/200',
            rating: 4.6,
            reviews: 45,
            inStock: true,
            unit: 'kg',
            category: 'fruits',
            isOrganic: false,
            stock: 40
        },
        {
            id: 5,
            name: 'Red Onions',
            namebn: 'লাল পেঁয়াজ',
            price: 38,
            originalPrice: 50,
            image: '/api/placeholder/300/200',
            rating: 4.4,
            reviews: 28,
            inStock: true,
            unit: 'kg',
            category: 'vegetables',
            isOrganic: false,
            stock: 60
        },
        {
            id: 6,
            name: 'Fresh Chicken',
            namebn: 'তাজা মুরগি',
            price: 180,
            originalPrice: 200,
            image: '/api/placeholder/300/200',
            rating: 4.9,
            reviews: 52,
            inStock: true,
            unit: 'kg',
            category: 'fish-meat',
            isOrganic: false,
            stock: 20
        },
        {
            id: 7,
            name: 'Basmati Rice',
            namebn: 'বাসমতি চাল',
            price: 95,
            originalPrice: 110,
            image: '/api/placeholder/300/200',
            rating: 4.7,
            reviews: 38,
            inStock: true,
            unit: 'kg',
            category: 'rice-flour',
            isOrganic: false,
            stock: 100
        },
        {
            id: 8,
            name: 'Oranges',
            namebn: 'কমলা',
            price: 90,
            originalPrice: 110,
            image: '/api/placeholder/300/200',
            rating: 4.5,
            reviews: 22,
            inStock: false,
            unit: 'kg',
            category: 'fruits',
            isOrganic: false,
            stock: 0
        },
    ]);

    // Filter products based on selected filters
    const filteredProducts = products.filter((product) => {
        const matchesCategory = !selectedCategory || selectedCategory === 'all' || product.category === selectedCategory;
        const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
        return matchesCategory && matchesPrice;
    }).sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'rating':
                return b.rating - a.rating;
            case 'name':
            default:
                return a.name.localeCompare(b.name);
        }
    });

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
                                            key={category.id}
                                            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                                        >
                                            <input
                                                type="radio"
                                                name="category"
                                                checked={selectedCategory === category.id || (!selectedCategory && category.id === 'all')}
                                                onChange={() => handleCategoryChange(category.id)}
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
                                Showing <span className="font-semibold">{filteredProducts.length}</span> products
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
                        {filteredProducts.length > 0 ? (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
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

                        {/* Pagination */}
                        {filteredProducts.length > 0 && (
                            <div className="flex justify-center mt-12">
                                <div className="flex items-center gap-2">
                                    <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                                        Previous
                                    </button>
                                    <button className="px-4 py-2 rounded-lg bg-green-500 text-white">
                                        1
                                    </button>
                                    <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                                        2
                                    </button>
                                    <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                                        3
                                    </button>
                                    <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;