import React, { useState } from 'react';
import { Package, Clock, CheckCircle, XCircle, Truck, Eye, MapPin, CreditCard } from 'lucide-react';

const Orders = () => {
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [expandedOrder, setExpandedOrder] = useState(null);

    // Sample orders data
    const orders = [
        {
            id: 'ORD-001',
            date: '2024-09-25',
            status: 'delivered',
            items: 5,
            total: 450,
            paymentMethod: 'bKash',
            deliveryAddress: 'House #123, Dhanmondi, Dhaka',
            products: [
                { name: 'Fresh Tomatoes', quantity: 2, price: 45, image: '/api/placeholder/80/80' },
                { name: 'Organic Carrots', quantity: 1, price: 35, image: '/api/placeholder/80/80' },
                { name: 'Fresh Milk', quantity: 2, price: 65, image: '/api/placeholder/80/80' },
            ]
        },
        {
            id: 'ORD-002',
            date: '2024-09-28',
            status: 'processing',
            items: 3,
            total: 320,
            paymentMethod: 'Nagad',
            deliveryAddress: 'House #456, Gulshan, Dhaka',
            products: [
                { name: 'Fresh Milk', quantity: 2, price: 65, image: '/api/placeholder/80/80' },
                { name: 'Green Apples', quantity: 1, price: 120, image: '/api/placeholder/80/80' },
            ]
        },
        {
            id: 'ORD-003',
            date: '2024-09-29',
            status: 'shipping',
            items: 4,
            total: 580,
            paymentMethod: 'Cash on Delivery',
            deliveryAddress: 'House #789, Banani, Dhaka',
            products: [
                { name: 'Fresh Chicken', quantity: 1, price: 180, image: '/api/placeholder/80/80' },
                { name: 'Basmati Rice', quantity: 2, price: 95, image: '/api/placeholder/80/80' },
                { name: 'Red Onions', quantity: 1, price: 38, image: '/api/placeholder/80/80' },
            ]
        },
        {
            id: 'ORD-004',
            date: '2024-09-20',
            status: 'cancelled',
            items: 2,
            total: 180,
            paymentMethod: 'bKash',
            deliveryAddress: 'House #321, Mirpur, Dhaka',
            products: [
                { name: 'Red Onions', quantity: 2, price: 38, image: '/api/placeholder/80/80' },
            ]
        },
    ];

    const statusConfig = {
        all: { label: 'All Orders', color: 'bg-gray-100 text-gray-700', icon: Package },
        processing: { label: 'Processing', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
        shipping: { label: 'Shipping', color: 'bg-blue-100 text-blue-700', icon: Truck },
        delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: CheckCircle },
        cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle },
    };

    const filteredOrders = selectedStatus === 'all'
        ? orders
        : orders.filter(order => order.status === selectedStatus);

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

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container">
                <h1 className="text-3xl font-bold mb-8">My Orders</h1>

                {/* Status Filter Tabs */}
                <div className="bg-white rounded-xl border border-gray-200 p-2 mb-6">
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(statusConfig).map(([key, config]) => {
                            const IconComponent = config.icon;
                            const count = key === 'all' ? orders.length : orders.filter(o => o.status === key).length;
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
                            <div key={order.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                {/* Order Header */}
                                <div className="p-4 bg-gray-50 border-b border-gray-200">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <p className="font-semibold text-lg">Order #{order.id}</p>
                                                <p className="text-sm text-gray-600">Placed on {new Date(order.date).toLocaleDateString('en-GB')}</p>
                                            </div>
                                            {getStatusBadge(order.status)}
                                        </div>
                                        <button
                                            onClick={() => toggleOrderDetails(order.id)}
                                            className="btn-outline flex items-center gap-2"
                                        >
                                            <Eye size={18} />
                                            {expandedOrder === order.id ? 'Hide Details' : 'View Details'}
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
                                                <p className="font-semibold">{order.items} products</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <CreditCard className="text-gray-400" size={20} />
                                            <div>
                                                <p className="text-sm text-gray-600">Payment</p>
                                                <p className="font-semibold">{order.paymentMethod}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <MapPin className="text-gray-400" size={20} />
                                            <div>
                                                <p className="text-sm text-gray-600">Delivery</p>
                                                <p className="font-semibold">৳{order.total}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Order Details */}
                                    {expandedOrder === order.id && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <h3 className="font-semibold text-lg mb-4">Order Items</h3>
                                            <div className="space-y-3">
                                                {order.products.map((product, index) => (
                                                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="w-16 h-16 object-cover rounded-lg"
                                                        />
                                                        <div className="flex-1">
                                                            <p className="font-medium">{product.name}</p>
                                                            <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                                                        </div>
                                                        <p className="font-semibold">৳{product.price * product.quantity}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                                <div className="flex items-start gap-3">
                                                    <MapPin className="text-green-500 mt-1" size={20} />
                                                    <div>
                                                        <p className="font-semibold mb-1">Delivery Address</p>
                                                        <p className="text-gray-600">{order.deliveryAddress}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex justify-end gap-3">
                                                {order.status === 'delivered' && (
                                                    <button className="btn-outline">
                                                        Reorder
                                                    </button>
                                                )}
                                                {order.status === 'processing' && (
                                                    <button className="text-red-600 hover:text-red-700 font-medium">
                                                        Cancel Order
                                                    </button>
                                                )}
                                                <button className="btn-primary">
                                                    Download Invoice
                                                </button>
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
                        <p className="text-gray-600 mb-6">
                            {selectedStatus === 'all'
                                ? "You haven't placed any orders yet"
                                : `No ${selectedStatus} orders found`}
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