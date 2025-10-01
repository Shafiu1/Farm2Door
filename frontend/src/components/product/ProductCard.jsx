import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { addToCart } from '../../store/slices/cartSlice';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();

    const handleAddToCart = (e) => {
        e.preventDefault();
        dispatch(addToCart({
            id: product._id,
            name: product.name,
            price: product.price,
            image: product.images?.[0]?.url || '/api/placeholder/400/300',
            unit: product.unit,
            stock: product.stock,
        }));
        toast.success(`${product.name} added to cart!`);
    };

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <Link
            to={`/products/${product._id}`}
            className="group bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden transition-all duration-300"
        >
            {/* Product Image */}
            <div className="relative overflow-hidden bg-gray-100">
                <img
                    src={product.images?.[0]?.url || '/api/placeholder/400/300'}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {discount > 0 && (
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            {discount}% OFF
                        </span>
                    )}
                    {product.isOrganic && (
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            Organic
                        </span>
                    )}
                </div>

                {/* Stock Badge */}
                {product.stock > 0 ? (
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        In Stock
                    </div>
                ) : (
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Out of Stock
                    </div>
                )}

                {/* Wishlist Button */}
                <button
                    className="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                        e.preventDefault();
                        toast.success('Added to wishlist!');
                    }}
                >
                    <Heart size={18} />
                </button>
            </div>

            {/* Product Info */}
            <div className="p-4 space-y-3">
                {/* Category */}
                {product.category?.name && (
                    <span className="text-xs text-green-600 font-medium uppercase">
                        {product.category.name}
                    </span>
                )}

                {/* Product Name */}
                <div>
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-green-600 transition-colors">
                        {product.name}
                    </h3>
                    {product.namebn && (
                        <p className="text-sm text-gray-600 text-bangla line-clamp-1">
                            {product.namebn}
                        </p>
                    )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center text-yellow-400">
                        <Star size={16} fill="currentColor" />
                        <span className="text-sm text-gray-600 ml-1 font-medium">
                            {product.rating || 0}
                        </span>
                    </div>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-600">
                        ({product.numReviews || 0} reviews)
                    </span>
                </div>

                {/* Unit */}
                <p className="text-sm text-gray-500">
                    Price per {product.unit}
                </p>

                {/* Price and Add to Cart */}
                <div className="flex items-center justify-between pt-2">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-gray-900">
                                ৳{product.price}
                            </span>
                            {product.originalPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                    ৳{product.originalPrice}
                                </span>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className={`p-2 rounded-lg transition-colors ${product.stock > 0
                                ? 'bg-green-500 hover:bg-green-600 text-white'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        <ShoppingCart size={20} />
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;