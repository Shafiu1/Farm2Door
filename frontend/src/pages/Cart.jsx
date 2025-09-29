import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { incrementQuantity, decrementQuantity, removeFromCart } from '../store/slices/cartSlice';

const Cart = () => {
    const dispatch = useDispatch();
    const { items, totalQuantity, totalAmount } = useSelector((state) => state.cart);

    if (items.length === 0) {
        return (
            <div className="container py-16 text-center">
                <div className="max-w-md mx-auto">
                    <ShoppingBag size={80} className="mx-auto text-gray-300 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                    <p className="text-gray-600 mb-6 text-bangla">আপনার কার্ট খালি আছে</p>
                    <Link to="/products" className="btn-primary inline-block">
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex gap-4">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-24 h-24 object-cover rounded-lg"
                                />

                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg">{item.name}</h3>
                                    <p className="text-sm text-gray-600">৳{item.price} per {item.unit}</p>

                                    <div className="flex items-center gap-4 mt-3">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => dispatch(decrementQuantity(item.id))}
                                                className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="w-12 text-center font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => dispatch(incrementQuantity(item.id))}
                                                className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => dispatch(removeFromCart(item.id))}
                                            className="text-red-500 hover:text-red-700 ml-auto"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="text-xl font-bold">৳{item.price * item.quantity}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
                        <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                        <div className="space-y-3 mb-4">
                            <div className="flex justify-between">
                                <span>Subtotal ({totalQuantity} items)</span>
                                <span>৳{totalAmount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Delivery Fee</span>
                                <span className="text-green-600">Free</span>
                            </div>
                            <hr />
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>৳{totalAmount}</span>
                            </div>
                        </div>

                        <Link to="/checkout" className="btn-primary w-full text-center block">
                            Proceed to Checkout
                        </Link>

                        <Link to="/products" className="btn-outline w-full text-center block mt-3">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;