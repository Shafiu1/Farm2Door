import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    Search,
    ShoppingCart,
    User,
    Menu,
    X,
    MapPin,
    Phone,
    LogOut,
    Package,
    Settings,
    Heart
} from 'lucide-react';
import { logout } from '../../store/slices/authSlice';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { totalQuantity } = useSelector((state) => state.cart);
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        setIsUserMenuOpen(false);
        navigate('/');
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            {/* Top Bar */}
            <div className="bg-green-600 text-white text-sm py-2">
                <div className="container flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <Phone size={14} />
                            <span>+880 1700-000000</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            <span className="text-bangla">ঢাকা, চট্টগ্রাম, সিলেট - বিনামূল্যে ডেলিভারি</span>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-4">
                        <span>🇧🇩 বাংলা</span>
                        <span>English</span>
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <nav className="container py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                            F
                        </div>
                        <span className="text-2xl font-bold text-gray-900">
                            Fresh<span className="text-green-500">mart</span>
                        </span>
                    </Link>

                    {/* Search Bar - Desktop */}
                    <div className="hidden md:flex flex-1 max-w-lg mx-8">
                        <form onSubmit={handleSearch} className="w-full relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="তাজা সবজি, ফল, দুধ খুঁজুন..."
                                className="w-full pl-4 pr-12 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none text-bangla"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-green-500"
                            >
                                <Search size={20} />
                            </button>
                        </form>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4">
                        {/* Search Icon - Mobile */}
                        <button className="md:hidden p-2 text-gray-600">
                            <Search size={24} />
                        </button>

                        {/* Cart */}
                        <Link to="/cart" className="relative p-2 text-gray-600 hover:text-green-500">
                            <ShoppingCart size={24} />
                            {totalQuantity > 0 && (
                                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium">
                                    {totalQuantity}
                                </span>
                            )}
                        </Link>

                        {/* User Menu */}
                        <div className="relative">
                            {isAuthenticated ? (
                                <div>
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="flex items-center gap-2 p-2 text-gray-600 hover:text-green-500"
                                    >
                                        <User size={24} />
                                        <span className="hidden md:inline">
                                            {user?.name || 'Account'}
                                        </span>
                                    </button>

                                    {/* User Dropdown */}
                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                                            <Link
                                                to="/profile"
                                                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                <User size={16} />
                                                Profile
                                            </Link>
                                            <Link
                                                to="/orders"
                                                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                <Package size={16} />
                                                My Orders
                                            </Link>
                                            <Link
                                                to="/wishlist"
                                                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                <Heart size={16} />
                                                Wishlist
                                            </Link>
                                            <Link
                                                to="/settings"
                                                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                <Settings size={16} />
                                                Settings
                                            </Link>
                                            <hr className="my-1" />
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left"
                                            >
                                                <LogOut size={16} />
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link
                                        to="/login"
                                        className="text-gray-600 hover:text-green-500 px-3 py-2 rounded-lg font-medium"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMobileMenu}
                            className="md:hidden p-2 text-gray-600"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                <div className="md:hidden mt-4">
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="তাজা সবজি, ফল, দুধ খুঁজুন..."
                            className="w-full pl-4 pr-12 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none text-bangla"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-green-500"
                        >
                            <Search size={20} />
                        </button>
                    </form>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100">
                    <div className="container py-4">
                        <div className="flex flex-col space-y-4">
                            <Link
                                to="/products"
                                className="text-gray-700 hover:text-green-500 py-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                All Products
                            </Link>
                            <Link
                                to="/categories"
                                className="text-gray-700 hover:text-green-500 py-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Categories
                            </Link>
                            <Link
                                to="/offers"
                                className="text-gray-700 hover:text-green-500 py-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Special Offers
                            </Link>
                            <Link
                                to="/about"
                                className="text-gray-700 hover:text-green-500 py-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                About Us
                            </Link>
                            <Link
                                to="/contact"
                                className="text-gray-700 hover:text-green-500 py-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Contact
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;