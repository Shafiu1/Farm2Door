import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
    Package,
    ShoppingCart,
    Users,
    DollarSign,
    TrendingUp,
    AlertCircle
} from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
    });

    useEffect(() => {
        // Check if user is admin
        if (!user || user.role !== 'admin') {
            navigate('/');
        }

        // Fetch dashboard stats
        fetchStats();
    }, [user, navigate]);

    const fetchStats = async () => {
        // TODO: Fetch real stats from backend
        setStats({
            totalProducts: 25,
            totalOrders: 150,
            totalUsers: 320,
            totalRevenue: 45680,
        });
    };

    const statCards = [
        {
            title: 'Total Products',
            value: stats.totalProducts,
            icon: Package,
            color: 'bg-blue-500',
            link: '/admin/products',
        },
        {
            title: 'Total Orders',
            value: stats.totalOrders,
            icon: ShoppingCart,
            color: 'bg-green-500',
            link: '/admin/orders',
        },
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: Users,
            color: 'bg-purple-500',
            link: '/admin/users',
        },
        {
            title: 'Total Revenue',
            value: `৳${stats.totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: 'bg-orange-500',
            link: '/admin/revenue',
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="container py-6">
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome back, {user?.name}!</p>
                </div>
            </div>

            <div className="container py-8">
                {/* Stats Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statCards.map((stat, index) => {
                        const IconComponent = stat.icon;
                        return (
                            <Link
                                key={index}
                                to={stat.link}
                                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white`}>
                                        <IconComponent size={24} />
                                    </div>
                                    <TrendingUp className="text-green-500" size={20} />
                                </div>
                                <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            </Link>
                        );
                    })}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                    <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Link
                            to="/admin/products/add"
                            className="btn-primary text-center"
                        >
                            + Add New Product
                        </Link>
                        <Link
                            to="/admin/categories/add"
                            className="btn-outline text-center"
                        >
                            + Add Category
                        </Link>
                        <Link
                            to="/admin/orders"
                            className="btn-outline text-center"
                        >
                            View Orders
                        </Link>
                        <Link
                            to="/admin/users"
                            className="btn-outline text-center"
                        >
                            Manage Users
                        </Link>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Recent Orders</h2>
                        <Link to="/admin/orders" className="text-green-600 hover:text-green-700 font-medium">
                            View All
                        </Link>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-semibold">Order #ORD-001</p>
                                <p className="text-sm text-gray-600">John Doe • 2 items</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold">৳450</p>
                                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                                    Pending
                                </span>
                            </div>
                        </div>
                        <div className="text-center py-4 text-gray-500">
                            <AlertCircle className="mx-auto mb-2" size={32} />
                            <p>No recent orders to display</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;