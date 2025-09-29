import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
    Star,
    ShoppingCart,
    Heart,
    Truck,
    Shield,
    ArrowLeft,
    Plus,
    Minus,
    Check
} from 'lucide-react';
import { addToCart } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);

    // Sample product data (in real app, fetch from API)
    const product = {
        id: parseInt(id),
        name: 'Fresh Tomatoes',
        namebn: 'তাজা টমেটো',
        price: 45,
        originalPrice: 60,
        images: [
            '/api/placeholder/600/400',
            '/api/placeholder/600/400',
            '/api/placeholder/600/400',
        ],
        rating: 4.5,
        reviews: 24,
        inStock: true,
        stock: 50,
        unit: 'kg',
        category: 'Vegetables',
        isOrganic: true,
        description: 'Fresh, juicy tomatoes handpicked from local farms. Rich in vitamins and minerals, perfect for cooking or eating fresh.',
        descriptionbn: 'স্থানীয় খামার থেকে হাতে বাছাই করা তাজা, রসালো টমেটো। ভিটামিন এবং খনিজে সমৃদ্ধ, রান্না বা তাজা খাওয়ার জন্য উপযুক্ত।',
        features: [
            'Organically grown',
            'No pesticides',
            'Farm fresh',
            'Rich in nutrients',
        ],
        nutritions: {
            calories: '18 kcal',
            protein: '0.9g',
            carbs: '3.9g',
            fiber: '1.2g',
        }
    };

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            dispatch(addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0],
                unit: product.unit,
                stock: product.stock,
            }));
        }
        toast.success(`${quantity} ${product.name} added to cart!`);
    };

    const handleBuyNow = () => {
        handleAddToCart();
        navigate('/checkout');
    };

    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-200">
                <div className="container py-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-green-600"
                    >
                        <ArrowLeft size={20} />
                        Back to Products
                    </button>
                </div>
            </div>

            <div className="container py-8">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Product Images */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden relative">
                            <img
                                src={product.images[selectedImage]}
                                alt={product.name}
                                className="w-full h-96 object-cover"
                            />
                            {discount > 0 && (
                                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                    {discount}% OFF
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Images */}
                        <div className="grid grid-cols-3 gap-4">
                            {product.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`rounded-lg overflow-hidden border-2 ${selectedImage === index ? 'border-green-500' : 'border-gray-200'
                                        }`}
                                >
                                    <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-24 object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            {product.isOrganic && (
                                <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
                                    🌿 Organic
                                </span>
                            )}
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                            <p className="text-xl text-gray-600 text-bangla">{product.namebn}</p>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={20}
                                        className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                                    />
                                ))}
                            </div>
                            <span className="text-gray-600">
                                {product.rating} ({product.reviews} reviews)
                            </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-4">
                            <span className="text-4xl font-bold text-gray-900">৳{product.price}</span>
                            {product.originalPrice && (
                                <span className="text-2xl text-gray-500 line-through">৳{product.originalPrice}</span>
                            )}
                            <span className="text-sm text-gray-600">per {product.unit}</span>
                        </div>

                        {/* Stock Status */}
                        <div>
                            {product.inStock ? (
                                <div className="flex items-center gap-2 text-green-600">
                                    <Check size={20} />
                                    <span className="font-medium">In Stock ({product.stock} available)</span>
                                </div>
                            ) : (
                                <div className="text-red-600 font-medium">Out of Stock</div>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                            <p className="text-gray-600 leading-relaxed">{product.description}</p>
                            <p className="text-gray-600 leading-relaxed text-bangla mt-2">{product.descriptionbn}</p>
                        </div>

                        {/* Features */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3">Key Features</h3>
                            <ul className="grid grid-cols-2 gap-2">
                                {product.features.map((feature, index) => (
                                    <li key={index} className="flex items-center gap-2 text-gray-600">
                                        <Check size={16} className="text-green-500" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Quantity Selector */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-3 border border-gray-300 rounded-lg">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-4 py-3 hover:bg-gray-50"
                                    >
                                        <Minus size={20} />
                                    </button>
                                    <span className="w-12 text-center font-semibold">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        className="px-4 py-3 hover:bg-gray-50"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                                <span className="text-gray-600">
                                    Total: ৳{product.price * quantity}
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={!product.inStock}
                                className="flex-1 btn-outline flex items-center justify-center gap-2"
                            >
                                <ShoppingCart size={20} />
                                Add to Cart
                            </button>
                            <button
                                onClick={handleBuyNow}
                                disabled={!product.inStock}
                                className="flex-1 btn-primary"
                            >
                                Buy Now
                            </button>
                            <button className="p-3 border border-gray-300 rounded-lg hover:bg-red-50 hover:border-red-300 hover:text-red-500 transition-colors">
                                <Heart size={24} />
                            </button>
                        </div>

                        {/* Delivery Info */}
                        <div className="bg-green-50 rounded-lg p-4 space-y-3">
                            <div className="flex items-center gap-3">
                                <Truck className="text-green-600" size={24} />
                                <div>
                                    <p className="font-medium text-gray-900">Free Delivery</p>
                                    <p className="text-sm text-gray-600">On orders over ৳500</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Shield className="text-green-600" size={24} />
                                <div>
                                    <p className="font-medium text-gray-900">Quality Guarantee</p>
                                    <p className="text-sm text-gray-600">100% fresh products</p>
                                </div>
                            </div>
                        </div>

                        {/* Nutritional Info */}
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <h3 className="font-semibold text-gray-900 mb-3">Nutritional Information (per 100g)</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <p className="text-sm text-gray-600">Calories</p>
                                    <p className="font-medium">{product.nutritions.calories}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Protein</p>
                                    <p className="font-medium">{product.nutritions.protein}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Carbohydrates</p>
                                    <p className="font-medium">{product.nutritions.carbs}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Fiber</p>
                                    <p className="font-medium">{product.nutritions.fiber}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;