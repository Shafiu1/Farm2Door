import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const AddProduct = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        namebn: '',
        description: '',
        descriptionbn: '',
        price: '',
        originalPrice: '',
        category: '',
        unit: 'kg',
        stock: '',
        isOrganic: false,
        isFeatured: false,
        features: '',
        tags: '',
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await api.get('/categories');
            // Make sure to access `data.categories` if your backend sends {categories:[]}
            setCategories(data.categories || []);
        } catch (error) {
            toast.error('Failed to fetch categories');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                originalPrice: formData.originalPrice
                    ? parseFloat(formData.originalPrice)
                    : null,
                stock: parseInt(formData.stock),
                features: formData.features
                    .split(',')
                    .map(f => f.trim())
                    .filter(f => f),
                tags: formData.tags
                    .split(',')
                    .map(t => t.trim())
                    .filter(t => t),
                images: [{ url: '/api/placeholder/400/300' }], // Temporary placeholder
            };

            await api.post('/products', productData);

            toast.success('Product added successfully!');
            navigate('/admin/products');
        } catch (error) {
            toast.error(
                error.response?.data?.message || 'Failed to add product'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-green-600 mb-4"
                    >
                        <ArrowLeft size={20} />
                        Back
                    </button>
                    <h1 className="text-3xl font-bold">Add New Product</h1>
                    <p className="text-gray-600 mt-1">
                        Fill in the product details below
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-xl border border-gray-200 p-6 space-y-6"
                >
                    {/* Basic Information */}
                    <div>
                        <h2 className="text-xl font-bold mb-4">
                            Basic Information
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product Name (English) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="Fresh Tomatoes"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product Name (বাংলা)
                                </label>
                                <input
                                    type="text"
                                    name="namebn"
                                    value={formData.namebn}
                                    onChange={handleChange}
                                    className="input-field text-bangla"
                                    placeholder="তাজা টমেটো"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description (English) <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="input-field"
                                    rows="3"
                                    placeholder="Fresh, juicy tomatoes..."
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description (বাংলা)
                                </label>
                                <textarea
                                    name="descriptionbn"
                                    value={formData.descriptionbn}
                                    onChange={handleChange}
                                    className="input-field text-bangla"
                                    rows="3"
                                    placeholder="তাজা, রসালো টমেটো..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Stock */}
                    <div>
                        <h2 className="text-xl font-bold mb-4">
                            Pricing & Stock
                        </h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price (৳) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="45"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Original Price (৳)
                                </label>
                                <input
                                    type="number"
                                    name="originalPrice"
                                    value={formData.originalPrice}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="60"
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Stock <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="100"
                                    min="0"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Category & Unit */}
                    <div>
                        <h2 className="text-xl font-bold mb-4">Category & Unit</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="input-field"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.name} ({cat.namebn})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Unit <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleChange}
                                    className="input-field"
                                    required
                                >
                                    <option value="kg">Kilogram (kg)</option>
                                    <option value="gram">Gram (g)</option>
                                    <option value="liter">Liter (L)</option>
                                    <option value="ml">Milliliter (ml)</option>
                                    <option value="piece">Piece</option>
                                    <option value="dozen">Dozen</option>
                                    <option value="bundle">Bundle</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Features & Tags */}
                    <div>
                        <h2 className="text-xl font-bold mb-4">Additional Details</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Features (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    name="features"
                                    value={formData.features}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="Organically grown, No pesticides, Farm fresh"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Example: Organically grown, No pesticides
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tags (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="Vegetables, Fresh, Seasonal"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Example: Vegetables, Fresh
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="isOrganic"
                                        checked={formData.isOrganic}
                                        onChange={handleChange}
                                    />
                                    <span>Organic Product</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="isFeatured"
                                        checked={formData.isFeatured}
                                        onChange={handleChange}
                                    />
                                    <span>Featured Product</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Add Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
