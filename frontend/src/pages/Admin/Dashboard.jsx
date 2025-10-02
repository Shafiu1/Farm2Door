import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
    Package,
    ShoppingCart,
    Users,
    DollarSign,
    TrendingUp,
    AlertCircle,
    Clock,
    CheckCircle,
    Truck,
    XCircle
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
        todayOrders: 0,
        monthRevenue: 0,
        lowStockProducts: 0,
        statusCounts: {
            pending: 0,
            processing: 0,
            shipping: 0,
            delivered: 0,
            cancelled: 0
        },
        recentOrders: []
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
        try {
            setLoading(true);
            const response = await api.get('/orders/admin/stats');
            setStats(response.stats);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: 'Total Products',
            value: stats.totalProducts,
            icon: Package,
            color: 'bg-blue-500',
            link: '/admin/products',
            subtitle: `${stats.lowStockProducts} low stock`
        },
        {
            title: 'Total Orders',
            value: stats.totalOrders,
            icon: ShoppingCart,
            color: 'bg-green-500',
            link: '/admin/orders',
            subtitle: `${stats.todayOrders} today`
        },
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: Users,
            color: 'bg-purple-500',
            link: '/admin/users',
            subtitle: 'Registered customers'
        },
        {
            title: 'Total Revenue',
            value: `৳${stats.totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: 'bg-orange-500',
            link: '/admin/revenue',
            subtitle: `৳${stats.monthRevenue.toLocaleString()} this month`
        },
    ];

    const statusConfig = {
        pending: { label: 'Pending', color: 'bg-gray-100 text-gray-700', icon: Clock },
        processing: { label: 'Processing', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
        shipping: { label: 'Shipping', color: 'bg-blue-100 text-blue-700', icon: Truck },
        delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: CheckCircle },
        cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle },
    };

    const getStatusBadge = (status) => {
        const config = statusConfig[status];
        const IconComponent = config.icon;
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                <IconComponent size={12} />
                {config.label}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

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
                                {stat.subtitle && (
                                    <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Order Status Overview */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                    <h2 className="text-xl font-bold mb-4">Order Status Overview</h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {Object.entries(stats.statusCounts).map(([status, count]) => {
                            const config = statusConfig[status];
                            const IconComponent = config.icon;
                            return (
                                <div key={status} className="text-center p-4 bg-gray-50 rounded-lg">
                                    <IconComponent className="mx-auto mb-2 text-gray-600" size={24} />
                                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                                    <p className="text-sm text-gray-600">{config.label}</p>
                                </div>
                            );
                        })}
                    </div>
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
                    {stats.recentOrders.length > 0 ? (
                        <div className="space-y-4">
                            {stats.recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <p className="font-semibold">{order.orderNumber}</p>
                                            {getStatusBadge(order.status)}
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {order.customerName} • {order.items} items
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(order.date).toLocaleString('en-GB', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-lg">৳{order.totalAmount}</p>
                                        <Link
                                            to={`/admin/orders/${order.id}`}
                                            className="text-sm text-green-600 hover:text-green-700"
                                        >
                                            View Details →
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <ShoppingCart className="mx-auto mb-2" size={48} />
                            <p>No orders yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;