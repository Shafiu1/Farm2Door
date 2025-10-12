import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, XCircle, Truck, Eye, MapPin, CreditCard, Download } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import Loading from '../components/common/Loading';

const Orders = () => {
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await api.get('/orders/user');
            setOrders(response.orders || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch orders');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) {
            return;
        }

        try {
            const response = await api.put(`/orders/${orderId}/cancel`, {
                reason: 'Cancelled by user'
            });

            toast.success(response.message || 'Order cancelled successfully');
            fetchOrders(); // Refresh orders
        } catch (error) {
            console.error('Error cancelling order:', error);
            toast.error(error.response?.data?.message || 'Failed to cancel order');
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

    const filteredOrders = selectedStatus === 'all'
        ? orders
        : orders.filter(order => order.orderStatus === selectedStatus);

    const getStatusBadge = (status) => {
        const config = statusConfig[status];
        const IconComponent = config.icon;
        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
                <IconComponent size={16} />
                {config.label}
            </span>
        );
    };

    const toggleOrderDetails = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const formatPaymentMethod = (method) => {
        const methods = {
            'bkash': 'bKash',
            'nagad': 'Nagad',
            'rocket': 'Rocket',
            'cod': 'Cash on Delivery',
            'card': 'Credit/Debit Card'
        };
        return methods[method] || method;
    };

    const getFullAddress = (shippingInfo) => {
        const { address, area, city, postalCode } = shippingInfo;
        return `${address}, ${area}, ${city}${postalCode ? `, ${postalCode}` : ''}`;
    };

    if (loading) {
        return <Loading fullScreen />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container">
                <h1 className="text-3xl font-bold mb-8">My Orders</h1>
                <p className="text-gray-600 mb-6 text-bangla">আপনার সকল অর্ডার দেখুন</p>

                {/* Status Filter Tabs */}
                <div className="bg-white rounded-xl border border-gray-200 p-2 mb-6">
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(statusConfig).map(([key, config]) => {
                            const IconComponent = config.icon;
                            const count = key === 'all'
                                ? orders.length
                                : orders.filter(o => o.orderStatus === key).length;

                            return (
                                <button
                                    key={key}
                                    onClick={() => setSelectedStatus(key)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${selectedStatus === key
                                            ? 'bg-green-500 text-white'
                                            : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    <IconComponent size={18} />
                                    {config.label}
                                    <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${selectedStatus === key
                                            ? 'bg-white/20'
                                            : 'bg-gray-200'
                                        }`}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Orders List */}
                {filteredOrders.length > 0 ? (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => (
                            <div key={order._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                {/* Order Header */}
                                <div className="p-4 bg-gray-50 border-b border-gray-200">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <p className="font-semibold text-lg">Order #{order.orderNumber}</p>
                                                <p className="text-sm text-gray-600">
                                                    Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            {getStatusBadge(order.orderStatus)}
                                        </div>
                                        <button
                                            onClick={() => toggleOrderDetails(order._id)}
                                            className="btn-outline flex items-center gap-2"
                                        >
                                            <Eye size={18} />
                                            {expandedOrder === order._id ? 'Hide Details' : 'View Details'}
                                        </button>
                                    </div>
                                </div>

                                {/* Order Summary */}
                                <div className="p-4">
                                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                                        <div className="flex items-center gap-3">
                                            <Package className="text-gray-400" size={20} />
                                            <div>
                                                <p className="text-sm text-gray-600">Items</p>
                                                <p className="font-semibold">{order.orderItems.length} products</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <CreditCard className="text-gray-400" size={20} />
                                            <div>
                                                <p className="text-sm text-gray-600">Payment</p>
                                                <p className="font-semibold">{formatPaymentMethod(order.paymentInfo.method)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <MapPin className="text-gray-400" size={20} />
                                            <div>
                                                <p className="text-sm text-gray-600">Total Amount</p>
                                                <p className="font-semibold">৳{order.totalPrice}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Order Details */}
                                    {expandedOrder === order._id && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <h3 className="font-semibold text-lg mb-4">Order Items</h3>
                                            <div className="space-y-3">
                                                {order.orderItems.map((item, index) => (
                                                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                                        <img
                                                            src={item.image || item.product?.images?.[0]?.url || '/api/placeholder/80/80'}
                                                            alt={item.name}
                                                            className="w-16 h-16 object-cover rounded-lg"
                                                        />
                                                        <div className="flex-1">
                                                            <p className="font-medium">{item.name}</p>
                                                            <p className="text-sm text-gray-600">
                                                                Quantity: {item.quantity} × ৳{item.price}
                                                            </p>
                                                        </div>
                                                        <p className="font-semibold">৳{item.price * item.quantity}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Price Breakdown */}
                                            <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Items Price:</span>
                                                    <span className="font-medium">৳{order.itemsPrice}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Delivery Charge:</span>
                                                    <span className="font-medium">৳{order.deliveryCharge}</span>
                                                </div>
                                                {order.taxPrice > 0 && (
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600">Tax:</span>
                                                        <span className="font-medium">৳{order.taxPrice}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between text-base font-semibold border-t pt-2">
                                                    <span>Total:</span>
                                                    <span className="text-green-600">৳{order.totalPrice}</span>
                                                </div>
                                            </div>

                                            {/* Delivery Address */}
                                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                                <div className="flex items-start gap-3">
                                                    <MapPin className="text-green-500 mt-1" size={20} />
                                                    <div>
                                                        <p className="font-semibold mb-1">Delivery Address</p>
                                                        <p className="text-gray-700">{order.shippingInfo.fullName}</p>
                                                        <p className="text-gray-600">{order.shippingInfo.phone}</p>
                                                        <p className="text-gray-600">{getFullAddress(order.shippingInfo)}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Payment Info */}
                                            {order.paymentInfo.transactionId && (
                                                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                                    <p className="text-sm text-gray-600">Transaction ID:</p>
                                                    <p className="font-mono font-medium">{order.paymentInfo.transactionId}</p>
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            <div className="mt-4 flex justify-end gap-3">
                                                {order.orderStatus === 'delivered' && (
                                                    <button
                                                        className="btn-outline"
                                                        onClick={() => window.location.href = '/products'}
                                                    >
                                                        Reorder
                                                    </button>
                                                )}
                                                {['pending', 'processing'].includes(order.orderStatus) && (
                                                    <button
                                                        onClick={() => handleCancelOrder(order._id)}
                                                        className="text-red-600 hover:text-red-700 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                                                    >
                                                        Cancel Order
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                        <Package size={64} className="mx-auto text-gray-300 mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 mb-2">No orders found</h2>
                        <p className="text-gray-600 mb-2">
                            {selectedStatus === 'all'
                                ? "You haven't placed any orders yet"
                                : `No ${selectedStatus} orders found`}
                        </p>
                        <p className="text-gray-500 mb-6 text-bangla">
                            {selectedStatus === 'all'
                                ? 'এখনও কোনো অর্ডার করা হয়নি'
                                : `কোনো ${selectedStatus} অর্ডার পাওয়া যায়নি`}
                        </p>
                        <button
                            onClick={() => window.location.href = '/products'}
                            className="btn-primary"
                        >
                            Start Shopping
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
