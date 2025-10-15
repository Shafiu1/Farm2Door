import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    Star,
    Truck,
    Shield,
    Leaf,
    Apple,
    Carrot,
    Fish,
    Milk,
    Pizza,
    X,
    Play,
    ShoppingCart
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

// Map category slugs to icon components
const iconMap = {
    vegetables: Carrot,
    fruits: Apple,
    fish: Fish,
    dairy: Milk,
    snacks:Pizza
};

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [showDemoModal, setShowDemoModal] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCategories();
        fetchFeaturedProducts();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoadingCategories(true);
            const response = await api.get('/categories');
            setCategories(response.categories || []);
        } catch (err) {
            console.error('Error fetching categories:', err);
            setError('Failed to load categories');
        } finally {
            setLoadingCategories(false);
        }
    };

    const fetchFeaturedProducts = async () => {
        try {
            setLoadingProducts(true);
            const response = await api.get('/products/featured');
            setFeaturedProducts(response.products || []);
        } catch (err) {
            console.error('Error fetching products:', err);
            toast.error('Failed to load featured products');
        } finally {
            setLoadingProducts(false);
        }
    };

    const handleAddToCart = (product) => {
        // TODO: Implement add to cart functionality
        toast.success(`${product.name} added to cart!`);
    };

    const calculateDiscount = (original, current) => {
        if (!original || original <= current) return 0;
        return Math.round(((original - current) / original) * 100);
    };

    return (
        <div className="min-h-screen w-full">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-green-600 to-green-500 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                                Fresh Groceries
                                <span className="block text-yellow-300">Delivered Fast</span>
                            </h1>
                            <p className="text-xl text-green-100 leading-relaxed">
                                <span className="text-bangla block">তাজা সবজি, ফল এবং দৈনন্দিন প্রয়োজনীয় পণ্য</span>
                                Get fresh, organic groceries delivered to your doorstep within 30 minutes
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    to="/products"
                                    className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-colors inline-flex items-center justify-center gap-2"
                                >
                                    Shop Now <ArrowRight size={20} />
                                </Link>
                                <button
                                    onClick={() => setShowDemoModal(true)}
                                    className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-green-600 transition-colors inline-flex items-center justify-center gap-2"
                                >
                                    <Play size={20} />
                                    Watch Demo
                                </button>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="bg-white/10 rounded-3xl p-8 backdrop-blur-sm">
                                <img
                                    src="/api/placeholder/500/400"
                                    alt="Fresh Groceries"
                                    className="w-full h-auto rounded-2xl shadow-2xl"
                                />
                                <div className="absolute -top-4 -right-4 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-bold text-sm">
                                    30% OFF
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                                <Truck size={32} className="text-white" />
                            </div>
                            <h3 className="text-xl font-semibold">Fast Delivery</h3>
                            <p className="text-gray-600">
                                <span className="text-bangla block">৩০ মিনিটে ডেলিভারি</span>
                                Get your groceries delivered within 30 minutes
                            </p>
                        </div>
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                                <Leaf size={32} className="text-white" />
                            </div>
                            <h3 className="text-xl font-semibold">100% Organic</h3>
                            <p className="text-gray-600">
                                <span className="text-bangla block">১০০% জৈব পণ্য</span>
                                Fresh, organic products sourced directly from farmers
                            </p>
                        </div>
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                                <Shield size={32} className="text-white" />
                            </div>
                            <h3 className="text-xl font-semibold">Quality Guarantee</h3>
                            <p className="text-gray-600">
                                <span className="text-bangla block">মানের নিশ্চয়তা</span>
                                100% satisfaction guarantee or your money back
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
                        <p className="text-xl text-gray-600 text-bangla">আপনার প্রয়োজনীয় পণ্যের ক্যাটেগরি নির্বাচন করুন</p>
                    </div>

                    {loadingCategories ? (
                        <p className="text-center text-gray-600">Loading categories...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {categories.map((category) => {
                                const slugKey = (category.slug || category.name || '')
                                    .toLowerCase()
                                    .replace(/\s+/g, '-')
                                    .replace(/[^a-z0-9-]/g, '');
                                const IconComponent = iconMap[slugKey] || Leaf;
                                return (
                                    <Link
                                        key={category._id}
                                        to={`/products?category=${category._id}`}
                                        className="group p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-green-200 transition-all duration-300"
                                    >
                                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                            {category.image?.url ? (
                                                <img
                                                    src={category.image.url}
                                                    alt={category.name}
                                                    className="w-10 h-10 object-cover rounded"
                                                />
                                            ) : (
                                                <IconComponent size={32} />
                                            )}
                                        </div>

                                        <h3 className="text-lg font-semibold text-center mb-2">
                                            {category.name}
                                        </h3>
                                        {category.namebn && (
                                            <p className="text-center text-bangla text-gray-700 mb-2">
                                                {category.namebn}
                                            </p>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-2">Featured Products</h2>
                            <p className="text-xl text-gray-600 text-bangla">আজকের বিশেষ অফার</p>
                        </div>
                        <Link
                            to="/products"
                            className="text-green-600 hover:text-green-700 font-semibold flex items-center gap-2"
                        >
                            View All <ArrowRight size={20} />
                        </Link>
                    </div>

                    {loadingProducts ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading products...</p>
                        </div>
                    ) : featuredProducts.length > 0 ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredProducts.map((product) => {
                                const discount = calculateDiscount(product.originalPrice, product.price);
                                return (
                                    <div
                                        key={product._id}
                                        className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 group"
                                    >
                                        <div className="relative">
                                            <Link to={`/products/${product._id}`}>
                                                <img
                                                    src={product.images?.[0]?.url || '/api/placeholder/250/200'}
                                                    alt={product.name}
                                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </Link>
                                            {discount > 0 && (
                                                <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                                    {discount}% OFF
                                                </div>
                                            )}
                                            {product.stock > 0 ? (
                                                <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                                    In Stock
                                                </div>
                                            ) : (
                                                <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                                    Out of Stock
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-4 space-y-3">
                                            <Link to={`/products/${product._id}`}>
                                                <h3 className="font-semibold text-gray-900 mb-1 hover:text-green-600">
                                                    {product.name}
                                                </h3>
                                                {product.namebn && (
                                                    <p className="text-sm text-gray-600 text-bangla">
                                                        {product.namebn}
                                                    </p>
                                                )}
                                            </Link>

                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center text-yellow-400">
                                                    <Star size={16} fill="currentColor" />
                                                    <span className="text-sm text-gray-600 ml-1">
                                                        {product.rating?.toFixed(1) || '0.0'}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-gray-400">•</span>
                                                <span className="text-xs text-gray-600">
                                                    per {product.unit}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg font-bold text-gray-900">
                                                        ৳{product.price}
                                                    </span>
                                                    {product.originalPrice && product.originalPrice > product.price && (
                                                        <span className="text-sm text-gray-500 line-through">
                                                            ৳{product.originalPrice}
                                                        </span>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => handleAddToCart(product)}
                                                    disabled={product.stock === 0}
                                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                                >
                                                    <ShoppingCart size={16} />
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No featured products available</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-16 bg-green-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
                    <p className="text-xl text-green-100 mb-8 text-bangla">
                        বিশেষ অফার এবং নতুন পণ্যের খবর পেতে সাবস্ক্রাইব করুন
                    </p>
                    <div className="max-w-md mx-auto flex gap-4">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-300"
                        />
                        <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">
                            Subscribe
                        </button>
                    </div>
                </div>
            </section>

            {/* Demo Video Modal */}
            {showDemoModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4" onClick={() => setShowDemoModal(false)}>
                    <div className="bg-white rounded-2xl max-w-4xl w-full relative" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setShowDemoModal(false)}
                            className="absolute -top-4 -right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors shadow-lg z-10"
                        >
                            <X size={24} />
                        </button>
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-4">FreshMart Demo</h2>
                            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                                <iframe
                                    className="w-full h-full"
                                    src="https://www.youtube.com/embed/E4JEK4-qaAA?si=xYa5jWfRi66Nd45J"
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <div className="mt-6 grid md:grid-cols-3 gap-4 text-center">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="text-green-600 mb-2">
                                        <ShoppingCart size={32} className="mx-auto" />
                                    </div>
                                    <p className="font-semibold">Easy Shopping</p>
                                    <p className="text-sm text-gray-600">Browse and order in minutes</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="text-green-600 mb-2">
                                        <Truck size={32} className="mx-auto" />
                                    </div>
                                    <p className="font-semibold">Fast Delivery</p>
                                    <p className="text-sm text-gray-600">Get it in 30 minutes</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="text-green-600 mb-2">
                                        <Leaf size={32} className="mx-auto" />
                                    </div>
                                    <p className="font-semibold">Fresh Products</p>
                                    <p className="text-sm text-gray-600">100% organic guaranteed</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
