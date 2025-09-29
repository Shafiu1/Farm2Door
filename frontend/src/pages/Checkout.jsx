import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { MapPin, Phone, Mail, CreditCard, Wallet } from 'lucide-react';
import { clearCart } from '../store/slices/cartSlice';
import { createOrder } from '../store/slices/orderSlice';
import toast from 'react-hot-toast';

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items, totalAmount } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    const [isProcessing, setIsProcessing] = useState(false);

    const [shippingInfo, setShippingInfo] = useState({
        fullName: user?.name || '',
        phone: user?.phone || '',
        email: user?.email || '',
        address: '',
        city: 'Dhaka',
        area: '',
        postalCode: '',
    });

    const [paymentMethod, setPaymentMethod] = useState('bkash');

    const deliveryCharge = totalAmount >= 500 ? 0 : 50;
    const finalTotal = totalAmount + deliveryCharge;

    const divisions = [
        'Dhaka', 'Chittagong', 'Rajshahi', 'Khulna',
        'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh'
    ];

    const paymentMethods = [
        { id: 'bkash', name: 'bKash', icon: '📱', color: 'bg-pink-500' },
        { id: 'nagad', name: 'Nagad', icon: '💰', color: 'bg-orange-500' },
        { id: 'rocket', name: 'Rocket', icon: '🚀', color: 'bg-purple-500' },
        { id: 'cod', name: 'Cash on Delivery', icon: '💵', color: 'bg-green-500' },
    ];

    const handleInputChange = (e) => {
        setShippingInfo({
            ...shippingInfo,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (items.length === 0) {
            toast.error('Your cart is empty!');
            return;
        }

        // Validate shipping info
        if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address) {
            toast.error('Please fill all required fields!');
            return;
        }

        setIsProcessing(true);

        try {
            // Create order object
            const orderData = {
                items: items,
                shippingInfo: shippingInfo,
                paymentMethod: paymentMethod,
                totalAmount: finalTotal,
                deliveryCharge: deliveryCharge,
                orderDate: new Date().toISOString(),
            };

            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Dispatch create order action
            await dispatch(createOrder(orderData));

            // Clear cart
            dispatch(clearCart());

            // Show success message
            toast.success('Order placed successfully!');

            // Navigate to orders page
            navigate('/orders');
        } catch (error) {
            toast.error('Failed to place order. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="container py-16 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                <p className="text-gray-600 mb-6">Add some products to checkout</p>
                <button onClick={() => navigate('/products')} className="btn-primary">
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container">
                <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                <form onSubmit={handleSubmit}>
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column - Forms */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Shipping Information */}
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <MapPin className="text-green-500" />
                                    Shipping Information
                                </h2>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={shippingInfo.fullName}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={shippingInfo.phone}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            placeholder="+880 1700-000000"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={shippingInfo.email}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            placeholder="your@email.com"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Street Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={shippingInfo.address}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            placeholder="House no, Street, Area"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            City/Division <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="city"
                                            value={shippingInfo.city}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            required
                                        >
                                            {divisions.map((division) => (
                                                <option key={division} value={division}>
                                                    {division}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Area/Thana <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="area"
                                            value={shippingInfo.area}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            placeholder="Enter your area"
                                            required
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Postal Code
                                        </label>
                                        <input
                                            type="text"
                                            name="postalCode"
                                            value={shippingInfo.postalCode}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            placeholder="1200"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <Wallet className="text-green-500" />
                                    Payment Method
                                </h2>

                                <div className="grid md:grid-cols-2 gap-4">
                                    {paymentMethods.map((method) => (
                                        <label
                                            key={method.id}
                                            className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === method.id
                                                    ? 'border-green-500 bg-green-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value={method.id}
                                                checked={paymentMethod === method.id}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="sr-only"
                                            />
                                            <div className="flex items-center gap-3 w-full">
                                                <div className={`w-12 h-12 ${method.color} rounded-lg flex items-center justify-center text-2xl`}>
                                                    {method.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-900">{method.name}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {method.id === 'cod' ? 'Pay when you receive' : 'Mobile payment'}
                                                    </p>
                                                </div>
                                                {paymentMethod === method.id && (
                                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        </label>
                                    ))}
                                </div>

                                {/* Payment Instructions */}
                                {paymentMethod !== 'cod' && (
                                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                        <p className="text-sm text-blue-800">
                                            <strong>Payment Instructions:</strong> After placing the order, you will be redirected to {paymentMethod.toUpperCase()} to complete the payment.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
                                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                                {/* Cart Items */}
                                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-3">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium text-sm">{item.name}</p>
                                                <p className="text-sm text-gray-600">
                                                    ৳{item.price} × {item.quantity}
                                                </p>
                                            </div>
                                            <p className="font-semibold">৳{item.price * item.quantity}</p>
                                        </div>
                                    ))}
                                </div>

                                <hr className="my-4" />

                                {/* Pricing */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>৳{totalAmount}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Delivery Charge</span>
                                        <span className={deliveryCharge === 0 ? 'text-green-600 font-medium' : ''}>
                                            {deliveryCharge === 0 ? 'Free' : `৳${deliveryCharge}`}
                                        </span>
                                    </div>
                                    <hr />
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span>৳{finalTotal}</span>
                                    </div>
                                </div>

                                {/* Free Delivery Notice */}
                                {totalAmount < 500 && (
                                    <div className="mb-4 p-3 bg-yellow-50 rounded-lg text-sm text-yellow-800">
                                        Add ৳{500 - totalAmount} more to get free delivery!
                                    </div>
                                )}

                                {/* Place Order Button */}
                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="btn-primary w-full"
                                >
                                    {isProcessing ? 'Processing...' : 'Place Order'}
                                </button>

                                <p className="text-xs text-gray-500 text-center mt-4">
                                    By placing your order, you agree to our terms and conditions
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;