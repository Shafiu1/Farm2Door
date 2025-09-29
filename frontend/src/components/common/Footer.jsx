import React from 'react';
import { Link } from 'react-router-dom';
import {
    Phone,
    Mail,
    MapPin,
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    Truck,
    Shield,
    Clock,
    CreditCard
} from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white">
            {/* Top Section - Features */}
            <div className="bg-green-600 py-8">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                <Truck size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Free Delivery</h3>
                                <p className="text-sm opacity-90">On orders over ৳500</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                <Shield size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Quality Guarantee</h3>
                                <p className="text-sm opacity-90">Fresh & organic products</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                <Clock size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">24/7 Support</h3>
                                <p className="text-sm opacity-90">Customer service</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                <CreditCard size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Secure Payment</h3>
                                <p className="text-sm opacity-90">bKash, Nagad & Cards</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="py-12">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                                    F
                                </div>
                                <span className="text-2xl font-bold">
                                    Fresh<span className="text-green-500">mart</span>
                                </span>
                            </div>
                            <p className="text-gray-300 leading-relaxed">
                                বাংলাদেশের সবচেয়ে বিশ্বস্ত অনলাইন গ্রোসারি শপ। তাজা সবজি, ফল এবং দৈনন্দিন প্রয়োজনীয় পণ্য ঘরে বসে পান।
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
                                    <Facebook size={20} />
                                </a>
                                <a href="#" className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center hover:bg-pink-700 transition-colors">
                                    <Instagram size={20} />
                                </a>
                                <a href="#" className="w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors">
                                    <Twitter size={20} />
                                </a>
                                <a href="#" className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center hover:bg-red-700 transition-colors">
                                    <Youtube size={20} />
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link to="/about" className="text-gray-300 hover:text-green-400 transition-colors">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/products" className="text-gray-300 hover:text-green-400 transition-colors">
                                        All Products
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/categories" className="text-gray-300 hover:text-green-400 transition-colors">
                                        Categories
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/offers" className="text-gray-300 hover:text-green-400 transition-colors">
                                        Special Offers
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/blog" className="text-gray-300 hover:text-green-400 transition-colors">
                                        Blog
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/contact" className="text-gray-300 hover:text-green-400 transition-colors">
                                        Contact Us
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Customer Service */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white">Customer Service</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link to="/help" className="text-gray-300 hover:text-green-400 transition-colors">
                                        Help Center
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/shipping" className="text-gray-300 hover:text-green-400 transition-colors">
                                        Shipping Info
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/returns" className="text-gray-300 hover:text-green-400 transition-colors">
                                        Returns & Refunds
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/terms" className="text-gray-300 hover:text-green-400 transition-colors">
                                        Terms & Conditions
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/privacy" className="text-gray-300 hover:text-green-400 transition-colors">
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/faq" className="text-gray-300 hover:text-green-400 transition-colors">
                                        FAQ
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white">Get in Touch</h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <MapPin size={20} className="text-green-400 mt-1 flex-shrink-0" />
                                    <div className="text-gray-300">
                                        <p>House #123, Road #12</p>
                                        <p>Dhanmondi, Dhaka-1209</p>
                                        <p className="text-bangla">ঢাকা, বাংলাদেশ</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Phone size={20} className="text-green-400" />
                                    <div className="text-gray-300">
                                        <p>+880 1700-000000</p>
                                        <p>+880 2-55668899</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Mail size={20} className="text-green-400" />
                                    <div className="text-gray-300">
                                        <p>support@freshmart.bd</p>
                                        <p>info@freshmart.bd</p>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Apps */}
                            <div className="pt-4">
                                <h4 className="font-semibold mb-3">Download Our App</h4>
                                <div className="space-y-2">
                                    <a href="#" className="block">
                                        <img
                                            src="/api/placeholder/140/40"
                                            alt="Download on App Store"
                                            className="h-10 bg-gray-700 rounded-lg"
                                        />
                                    </a>
                                    <a href="#" className="block">
                                        <img
                                            src="/api/placeholder/140/40"
                                            alt="Get it on Google Play"
                                            className="h-10 bg-gray-700 rounded-lg"
                                        />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Methods */}
            <div className="border-t border-gray-800 py-6">
                <div className="container">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-center md:text-left">
                            <h4 className="font-semibold mb-2">We Accept</h4>
                            <div className="flex gap-3 justify-center md:justify-start">
                                <div className="w-12 h-8 bg-pink-600 rounded flex items-center justify-center text-xs font-bold">
                                    bKash
                                </div>
                                <div className="w-12 h-8 bg-red-600 rounded flex items-center justify-center text-xs font-bold">
                                    Nagad
                                </div>
                                <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-xs font-bold">
                                    Rocket
                                </div>
                                <div className="w-12 h-8 bg-purple-600 rounded flex items-center justify-center text-xs font-bold">
                                    VISA
                                </div>
                                <div className="w-12 h-8 bg-yellow-600 rounded flex items-center justify-center text-xs font-bold">
                                    MC
                                </div>
                            </div>
                        </div>

                        {/* Delivery Areas */}
                        <div className="text-center md:text-right">
                            <h4 className="font-semibold mb-2 text-bangla">ডেলিভারি এলাকা</h4>
                            <p className="text-sm text-gray-300 text-bangla">
                                ঢাকা • চট্টগ্রাম • সিলেট • রাজশাহী • খুলনা • বরিশাল
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800 py-4">
                <div className="container">
                    <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                        <p>&copy; 2024 Freshmart. All rights reserved.</p>
                        <p>Made with ❤️ in Bangladesh</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;