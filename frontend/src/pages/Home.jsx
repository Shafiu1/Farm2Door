import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
} from 'lucide-react';

// Map category slugs (preferred) or names to icon components
const iconMap = {
    vegetables: Carrot,
    fruits: Apple,
    'fish-meat': Fish,
    dairy: Milk,
};

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const controller = new AbortController();

        const fetchCategories = async () => {
            try {
                setLoading(true);
                const res = await axios.get('http://localhost:5000/api/categories', {
                    signal: controller.signal,
                });

                // backend returns { success: true, count, categories }
                if (res.data && Array.isArray(res.data.categories)) {
                    setCategories(res.data.categories);
                } else if (Array.isArray(res.data)) {
                    // in case backend returns raw array
                    setCategories(res.data);
                } else {
                    throw new Error(res.data?.message || 'Invalid categories response');
                }
            } catch (err) {
                if (axios.isCancel(err)) return;
                setError(err.response?.data?.message || err.message || 'Failed to load categories');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
        return () => controller.abort();
    }, []);

    // static featured products (kept as-is)
    const featuredProducts = [
        {
            id: 1,
            name: 'Fresh Tomatoes',
            namebn: 'তাজা টমেটো',
            price: 45,
            originalPrice: 60,
            image: '/api/placeholder/250/200',
            rating: 4.5,
            inStock: true,
            unit: 'kg',
        },
        {
            id: 2,
            name: 'Organic Carrots',
            namebn: 'জৈব গাজর',
            price: 35,
            originalPrice: 50,
            image: '/api/placeholder/250/200',
            rating: 4.8,
            inStock: true,
            unit: 'kg',
        },
        {
            id: 3,
            name: 'Fresh Milk',
            namebn: 'তাজা দুধ',
            price: 65,
            originalPrice: 75,
            image: '/api/placeholder/250/200',
            rating: 4.7,
            inStock: true,
            unit: 'liter',
        },
        {
            id: 4,
            name: 'Green Apples',
            namebn: 'সবুজ আপেল',
            price: 120,
            originalPrice: 150,
            image: '/api/placeholder/250/200',
            rating: 4.6,
            inStock: true,
            unit: 'kg',
        },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-green-600 to-green-500 text-white">
                <div className="container py-20">
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
                                    className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-colors inline-flex items-center gap-2"
                                >
                                    Shop Now <ArrowRight size={20} />
                                </Link>
                                <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-green-600 transition-colors">
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
                                <div className="absolute -top-4 -right-4 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-bold text-sm">30% OFF</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-16 bg-gray-50">
                <div className="container">
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
                <div className="container">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
                        <p className="text-xl text-gray-600 text-bangla">আপনার প্রয়োজনীয় পণ্যের ক্যাটেগরি নির্বাচন করুন</p>
                    </div>

                    {loading ? (
                        <p className="text-center text-gray-600">Loading categories...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {categories.map((category) => {
                                const slugKey = (category.slug || category.name || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                                const IconComponent = iconMap[slugKey] || Leaf;
                                return (
                                    <Link
                                        key={category._id}
                                        to={`/products?category=${category._id}`}  // Changed from category.slug
                                        className="group p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-green-200 transition-all duration-300"
                                    >
                                        <div className={`w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                                            {category.image?.url ? (
                                                <img src={category.image.url} alt={category.name} className="w-10 h-10 object-cover rounded" />
                                            ) : (
                                                <IconComponent size={32} />
                                            )}
                                        </div>

                                        <h3 className="text-lg font-semibold text-center mb-2">{category.name}</h3>
                                        {category.namebn && <p className="text-center text-bangla text-gray-700 mb-2">{category.namebn}</p>}
                                        {typeof category.count !== 'undefined' && (
                                            <p className="text-center text-sm text-gray-500">{category.count}</p>
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
                <div className="container">
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-2">Featured Products</h2>
                            <p className="text-xl text-gray-600 text-bangla">আজকের বিশেষ অফার</p>
                        </div>
                        <Link to="/products" className="text-green-600 hover:text-green-700 font-semibold flex items-center gap-2">
                            View All <ArrowRight size={20} />
                        </Link>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProducts.map((product) => (
                            <div key={product.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 group">
                                <div className="relative">
                                    <img src={product.image} alt={product.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                                    </div>
                                    {product.inStock && (
                                        <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">In Stock</div>
                                    )}
                                </div>

                                <div className="p-4 space-y-3">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                                        <p className="text-sm text-gray-600 text-bangla">{product.namebn}</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center text-yellow-400">
                                            <Star size={16} fill="currentColor" />
                                            <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                                        </div>
                                        <span className="text-xs text-gray-400">•</span>
                                        <span className="text-xs text-gray-600">per {product.unit}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold text-gray-900">৳{product.price}</span>
                                            <span className="text-sm text-gray-500 line-through">৳{product.originalPrice}</span>
                                        </div>
                                        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">Add to Cart</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-16 bg-green-600 text-white">
                <div className="container text-center">
                    <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
                    <p className="text-xl text-green-100 mb-8 text-bangla">বিশেষ অফার এবং নতুন পণ্যের খবর পেতে সাবস্ক্রাইব করুন</p>
                    <div className="max-w-md mx-auto flex gap-4">
                        <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-300" />
                        <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">Subscribe</button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
