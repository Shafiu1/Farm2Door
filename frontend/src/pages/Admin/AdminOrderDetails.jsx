import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ArrowLeft,
    Package,
    MapPin,
    CreditCard,
    User,
    Phone,
    Mail,
    Calendar,
    CheckCircle,
    Clock,
    Truck,
    XCircle,
    Download
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Loading from '../../components/common/Loading';

const AdminOrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/orders/${id}`);
            setOrder(response.order);
        } catch (error) {
            console.error('Error fetching order:', error);
            toast.error('Failed to load order details');
            navigate('/admin/orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        if (!window.confirm(`Are you sure you want to change status to ${newStatus}?`)) {
            return;
        }

        try {
            setUpdating(true);
            await api.put(`/orders/${id}/status`, { status: newStatus });
            toast.success('Order status updated successfully');
            fetchOrderDetails();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update order status');
        } finally {
            setUpdating(false);
        }
    };

    const statusConfig = {
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
            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${config.color}`}>
                <IconComponent size={16} />
                {config.label}
            </span>
        );
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

    if (loading) {
        return <Loading fullScreen />;
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Package size={64} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-600">Order not found</p>
                    <button onClick={() => navigate('/admin/orders')} className="btn-primary mt-4">
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="container py-6">
                    <button
                        onClick={() => navigate('/admin/orders')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeft size={20} />
                        Back to Orders
                    </button>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold">Order #{order.orderNumber}</h1>
                            <p className="text-gray-600 mt-1">
                                Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            {getStatusBadge(order.orderStatus)}
                            <button className="btn-outline flex items-center gap-2">
                                <Download size={18} />
                                Invoice
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-8">
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Items */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Package size={20} />
                                Order Items
                            </h2>
                            <div className="space-y-4">
                                {order.orderItems.map((item, index) => (
                                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                        <img
                                            src={item.image || item.product?.images?.[0]?.url || '/api/placeholder/80/80'}
                                            alt={item.name}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                            <p className="text-sm text-gray-600">
                                                Quantity: {item.quantity} × ৳{item.price}
                                            </p>
                                        </div>
                                        <p className="font-bold text-lg">৳{item.price * item.quantity}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Price Summary */}
                            <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                                <div className="flex justify-between text-gray-600">
                                    <span>Items Price:</span>
                                    <span>৳{order.itemsPrice}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery Charge:</span>
                                    <span>৳{order.deliveryCharge}</span>
                                </div>
                                {order.taxPrice > 0 && (
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tax:</span>
                                        <span>৳{order.taxPrice}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                                    <span>Total:</span>
                                    <span className="text-green-600">৳{order.totalPrice}</span>
                                </div>
                            </div>
                        </div>

                        {/* Customer Information */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <User size={20} />
                                Customer Information
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3">
                                    <User className="text-gray-400 mt-1" size={20} />
                                    <div>
                                        <p className="text-sm text-gray-600">Name</p>
                                        <p className="font-semibold">{order.user?.name || order.shippingInfo.fullName}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Mail className="text-gray-400 mt-1" size={20} />
                                    <div>
                                        <p className="text-sm text-gray-600">Email</p>
                                        <p className="font-semibold">{order.user?.email || order.shippingInfo.email || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Phone className="text-gray-400 mt-1" size={20} />
                                    <div>
                                        <p className="text-sm text-gray-600">Phone</p>
                                        <p className="font-semibold">{order.shippingInfo.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Calendar className="text-gray-400 mt-1" size={20} />
                                    <div>
                                        <p className="text-sm text-gray-600">Customer Since</p>
                                        <p className="font-semibold">
                                            {order.user?.createdAt ? new Date(order.user.createdAt).toLocaleDateString('en-GB') : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Address */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <MapPin size={20} />
                                Delivery Address
                            </h2>
                            <div className="flex items-start gap-3">
                                <MapPin className="text-green-500 mt-1" size={20} />
                                <div>
                                    <p className="font-semibold text-gray-900">{order.shippingInfo.fullName}</p>
                                    <p className="text-gray-700">{order.shippingInfo.phone}</p>
                                    <p className="text-gray-600 mt-2">
                                        {order.shippingInfo.address}<br />
                                        {order.shippingInfo.area}, {order.shippingInfo.city}
                                        {order.shippingInfo.postalCode && `, ${order.shippingInfo.postalCode}`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Status Update */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-lg font-bold mb-4">Update Status</h2>
                            <div className="space-y-2">
                                {Object.entries(statusConfig).map(([status, config]) => {
                                    const IconComponent = config.icon;
                                    return (
                                        <button
                                            key={status}
                                            onClick={() => handleStatusUpdate(status)}
                                            disabled={updating || order.orderStatus === status}
                                            className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${order.orderStatus === status
                                                    ? config.color
                                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
                                            <IconComponent size={18} />
                                            {config.label}
                                            {order.orderStatus === status && (
                                                <CheckCircle size={16} className="ml-auto" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Payment Information */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <CreditCard size={20} />
                                Payment Info
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-600">Payment Method</p>
                                    <p className="font-semibold capitalize">{formatPaymentMethod(order.paymentInfo.method)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Payment Status</p>
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${order.paymentInfo.status === 'completed'
                                            ? 'bg-green-100 text-green-700'
                                            : order.paymentInfo.status === 'failed'
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {order.paymentInfo.status}
                                    </span>
                                </div>
                                {order.paymentInfo.transactionId && (
                                    <div>
                                        <p className="text-sm text-gray-600">Transaction ID</p>
                                        <p className="font-mono text-sm font-semibold">{order.paymentInfo.transactionId}</p>
                                    </div>
                                )}
                                {order.paymentInfo.paidAt && (
                                    <div>
                                        <p className="text-sm text-gray-600">Paid At</p>
                                        <p className="font-semibold">
                                            {new Date(order.paymentInfo.paidAt).toLocaleString('en-GB')}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-lg font-bold mb-4">Order Timeline</h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                                    <div>
                                        <p className="font-semibold">Order Placed</p>
                                        <p className="text-sm text-gray-600">
                                            {new Date(order.createdAt).toLocaleString('en-GB')}
                                        </p>
                                    </div>
                                </div>
                                {order.paidAt && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                                        <div>
                                            <p className="font-semibold">Payment Completed</p>
                                            <p className="text-sm text-gray-600">
                                                {new Date(order.paidAt).toLocaleString('en-GB')}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {order.deliveredAt && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                                        <div>
                                            <p className="font-semibold">Delivered</p>
                                            <p className="text-sm text-gray-600">
                                                {new Date(order.deliveredAt).toLocaleString('en-GB')}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {order.cancelledAt && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
                                        <div>
                                            <p className="font-semibold">Cancelled</p>
                                            <p className="text-sm text-gray-600">
                                                {new Date(order.cancelledAt).toLocaleString('en-GB')}
                                            </p>
                                            {order.cancellationReason && (
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Reason: {order.cancellationReason}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOrderDetails;
