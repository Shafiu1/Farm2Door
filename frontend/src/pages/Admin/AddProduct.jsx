import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const AddProduct = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
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
        imageUrl: '',
        imagePublicId: '',
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.categories);
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

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            return;
        }

        setUploadingImage(true);

        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await api.post('/upload/image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setFormData(prev => ({
                ...prev,
                imageUrl: response.image.url,
                imagePublicId: response.image.public_id,
            }));
            setImagePreview(response.image.url);
            toast.success('Image uploaded successfully!');
        } catch (error) {
            toast.error(error.message || 'Failed to upload image');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleRemoveImage = async () => {
        if (formData.imagePublicId) {
            try {
                await api.delete('/upload/image', {
                    data: { public_id: formData.imagePublicId }
                });
            } catch (error) {
                console.error('Failed to delete image:', error);
            }
        }
        setFormData(prev => ({
            ...prev,
            imageUrl: '',
            imagePublicId: '',
        }));
        setImagePreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.imageUrl) {
            toast.error('Please upload a product image');
            return;
        }

        setLoading(true);

        try {
            const productData = {
                name: formData.name,
                namebn: formData.namebn,
                description: formData.description,
                descriptionbn: formData.descriptionbn,
                price: parseFloat(formData.price),
                originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
                category: formData.category,
                unit: formData.unit,
                stock: parseInt(formData.stock),
                isOrganic: formData.isOrganic,
                isFeatured: formData.isFeatured,
                features: formData.features.split(',').map(f => f.trim()).filter(f => f),
                tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
                images: [{
                    url: formData.imageUrl,
                    public_id: formData.imagePublicId,
                }],
            };

            await api.post('/products', productData);
            toast.success('Product added successfully!');
            navigate('/admin/dashboard');
        } catch (error) {
            toast.error(error.message || 'Failed to add product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            {/* CHANGED: Replaced .container with proper centering classes */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-green-600 mb-4 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
                    <p className="text-gray-600 mt-1">Fill in the product details below</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-6 shadow-sm">
                    {/* Image Upload */}
                    <div>
                        <h2 className="text-xl font-bold mb-4 text-gray-900">Product Image</h2>
                        <div className="space-y-4">
                            {imagePreview ? (
                                <div className="relative inline-block w-full">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full max-w-md h-64 object-cover rounded-lg border-2 border-gray-200 mx-auto"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors">
                                    <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                                    <label className="cursor-pointer">
                                        <span className="inline-block bg-green-500 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-green-600 active:bg-green-700 transition duration-200">
                                            {uploadingImage ? 'Uploading...' : 'Upload Image'}
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            disabled={uploadingImage}
                                        />
                                    </label>
                                    <p className="text-sm text-gray-500 mt-2">
                                        PNG, JPG, GIF up to 5MB
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Basic Information */}
                    <div>
                        <h2 className="text-xl font-bold mb-4 text-gray-900">Basic Information</h2>
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-bangla"
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-bangla"
                                    rows="3"
                                    placeholder="তাজা, রসালো টমেটো..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Stock */}
                    <div>
                        <h2 className="text-xl font-bold mb-4 text-gray-900">Pricing & Stock</h2>
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    placeholder="100"
                                    min="0"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Category & Unit */}
                    <div>
                        <h2 className="text-xl font-bold mb-4 text-gray-900">Category & Unit</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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

                    {/* Additional Details */}
                    <div>
                        <h2 className="text-xl font-bold mb-4 text-gray-900">Additional Details</h2>
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    placeholder="Organically grown, No pesticides, Farm fresh"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Separate features with commas
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    placeholder="vegetables, organic, fresh"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Separate tags with commas
                                </p>
                            </div>

                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isOrganic"
                                        checked={formData.isOrganic}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        Organic Product
                                    </span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isFeatured"
                                        checked={formData.isFeatured}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        Featured Product
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading || uploadingImage}
                            className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Adding Product...' : 'Add Product'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 border-2 border-green-600 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
