import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Package,
    Clock,
    CheckCircle,
    XCircle,
    Truck,
    Eye,
    Filter,
    Download,
    Search
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Loading from '../../components/common/Loading';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalOrders: 0
    });

    useEffect(() => {
        fetchOrders();
    }, [selectedStatus, pagination.currentPage]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const params = {
                page: pagination.currentPage,
                limit: 20
            };

            if (selectedStatus !== 'all') {
                params.status = selectedStatus;
            }

            const response = await api.get('/orders', { params });
            setOrders(response.orders || []);
            setPagination({
                currentPage: response.currentPage,
                totalPages: response.totalPages,
                totalOrders: response.totalOrders
            });
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to fetch orders');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            toast.success('Order status updated successfully');
            fetchOrders();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update order status');
        }
    };

    const statusConfig = {
        all: { label: 'All Orders', color: 'bg-gray-100 text-gray-700', icon: Package },
        pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
        processing: { label: 'Processing', color: 'bg-blue-100 text-blue-700', icon: Clock },
        shipping: { label: 'Shipping', color: 'bg-indigo-100 text-indigo-700', icon: Truck },
        delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: CheckCircle },
        cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle },
    };

    const getStatusBadge = (status) => {
        const config = statusConfig[status];
        const IconComponent = config.icon;
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                <IconComponent size={14} />
                {config.label}
            </span>
        );
    };

    const filteredOrders = orders.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                            <h1 className="text-3xl font-bold">Orders Management</h1>
                            <p className="text-gray-600 mt-1">
                                Total {pagination.totalOrders} orders
                            </p>
                        </div>
                        <button
                            onClick={fetchOrders}
                            className="btn-primary flex items-center gap-2"
                        >
                            <Download size={18} />
                            Export Orders
                        </button>
                    </div>
                </div>
            </div>

            <div className="container py-8">
                {/* Filters */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Status Filter */}
                        <div className="flex-1 flex flex-wrap gap-2">
                            {Object.entries(statusConfig).map(([key, config]) => {
                                const IconComponent = config.icon;
                                return (
                                    <button
                                        key={key}
                                        onClick={() => setSelectedStatus(key)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${selectedStatus === key
                                                ? 'bg-green-500 text-white'
                                                : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        <IconComponent size={16} />
                                        {config.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search orders..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {filteredOrders.length > 0 ? (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Order
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Customer
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Items
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Payment
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredOrders.map((order) => (
                                            <tr key={order._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900">
                                                            {order.orderNumber}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {new Date(order.createdAt).toLocaleDateString('en-GB')}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {order.user?.name || 'N/A'}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {order.user?.email || order.shippingInfo?.email}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {order.orderItems.length} items
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                    ৳{order.totalPrice}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <p className="text-sm text-gray-900 capitalize">
                                                        {order.paymentInfo.method}
                                                    </p>
                                                    <p className={`text-xs ${order.paymentInfo.status === 'completed'
                                                            ? 'text-green-600'
                                                            : 'text-yellow-600'
                                                        }`}>
                                                        {order.paymentInfo.status}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <select
                                                        value={order.orderStatus}
                                                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                        className="text-sm rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="processing">Processing</option>
                                                        <option value="shipping">Shipping</option>
                                                        <option value="delivered">Delivered</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <Link
                                                        to={`/admin/orders/${order._id}`}
                                                        className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                                                    >
                                                        <Eye size={16} />
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                    <p className="text-sm text-gray-600">
                                        Page {pagination.currentPage} of {pagination.totalPages}
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                                            disabled={pagination.currentPage === 1}
                                            className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                                            disabled={pagination.currentPage === pagination.totalPages}
                                            className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <Package size={48} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500">No orders found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;
