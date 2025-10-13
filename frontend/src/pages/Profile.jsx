import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Camera, Save, Lock, Package, DollarSign, Calendar } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import Loading from '../components/common/Loading';

const Profile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState(null);
    const [orderStats, setOrderStats] = useState({
        totalOrders: 0,
        totalSpent: 0
    });

    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
        avatar: '',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        fetchUserProfile();
        fetchOrderStats();
    }, []);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const response = await api.get('/auth/profile');

            if (response.success) {
                setUserData(response.user);
                setProfileData({
                    name: response.user.name,
                    email: response.user.email,
                    phone: response.user.phone,
                    avatar: response.user.avatar || '',
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            if (error.response?.status === 401) {
                toast.error('Please login to view profile');
                navigate('/login');
            } else {
                toast.error('Failed to load profile');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchOrderStats = async () => {
        try {
            const response = await api.get('/orders/user');
            if (response.success) {
                const orders = response.orders || [];
                const totalOrders = orders.length;
                const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0);

                setOrderStats({ totalOrders, totalSpent });
            }
        } catch (error) {
            console.error('Error fetching order stats:', error);
        }
    };

    const handleInputChange = (e) => {
        setProfileData({
            ...profileData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSaveProfile = async () => {
        try {
            setUpdating(true);
            const response = await api.put('/auth/profile', profileData);

            if (response.success) {
                setUserData(response.user);
                toast.success('Profile updated successfully!');
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setUpdating(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        // Validation
        if (passwordData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        try {
            setUpdating(true);
            const response = await api.put('/auth/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });

            if (response.success) {
                toast.success('Password changed successfully!');
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
            }
        } catch (error) {
            console.error('Error changing password:', error);
            toast.error(error.response?.data?.message || 'Failed to change password');
        } finally {
            setUpdating(false);
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error('Image size should be less than 2MB');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('image', file);

            const uploadResponse = await api.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (uploadResponse.success) {
                // Update profile with new avatar
                const response = await api.put('/auth/profile', {
                    ...profileData,
                    avatar: uploadResponse.image.url
                });

                if (response.success) {
                    setUserData(response.user);
                    setProfileData(prev => ({ ...prev, avatar: uploadResponse.image.url }));
                    toast.success('Profile picture updated!');
                }
            }
        } catch (error) {
            console.error('Error uploading avatar:', error);
            toast.error('Failed to upload image');
        }
    };

    if (loading) {
        return <Loading fullScreen />;
    }

    if (!userData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Unable to load profile</p>
                    <button onClick={() => navigate('/')} className="btn-primary mt-4">
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container">
                <h1 className="text-3xl font-bold mb-8">My Profile</h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            {/* Profile Picture */}
                            <div className="text-center mb-6">
                                <div className="relative inline-block">
                                    {profileData.avatar ? (
                                        <img
                                            src={profileData.avatar}
                                            alt={profileData.name}
                                            className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-green-100"
                                        />
                                    ) : (
                                        <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center text-4xl font-bold text-green-600 mx-auto">
                                            {profileData.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <label className="absolute bottom-0 right-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600 transition-colors cursor-pointer">
                                        <Camera size={20} />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarUpload}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 mt-4">{userData.name}</h2>
                                <p className="text-gray-600">{userData.email}</p>
                                {userData.isVerified && (
                                    <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                        ✓ Verified
                                    </span>
                                )}
                            </div>

                            {/* Stats */}
                            <div className="space-y-4">
                                <div className="p-4 bg-green-50 rounded-lg">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Package className="text-green-600" size={24} />
                                        <p className="text-sm text-gray-600">Total Orders</p>
                                    </div>
                                    <p className="text-2xl font-bold text-green-600">{orderStats.totalOrders}</p>
                                </div>
                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <div className="flex items-center gap-3 mb-2">
                                        <DollarSign className="text-blue-600" size={24} />
                                        <p className="text-sm text-gray-600">Total Spent</p>
                                    </div>
                                    <p className="text-2xl font-bold text-blue-600">৳{orderStats.totalSpent.toLocaleString()}</p>
                                </div>
                                <div className="p-4 bg-orange-50 rounded-lg">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Calendar className="text-orange-600" size={24} />
                                        <p className="text-sm text-gray-600">Member Since</p>
                                    </div>
                                    <p className="text-lg font-bold text-orange-600">
                                        {new Date(userData.createdAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal Information */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold">Personal Information</h2>
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="text-green-600 hover:text-green-700 font-medium"
                                    >
                                        Edit
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setProfileData({
                                                name: userData.name,
                                                email: userData.email,
                                                phone: userData.phone,
                                                avatar: userData.avatar || '',
                                            });
                                        }}
                                        className="text-red-600 hover:text-red-700 font-medium"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            name="name"
                                            value={profileData.name}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${!isEditing && 'bg-gray-50'
                                                }`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="email"
                                            name="email"
                                            value={profileData.email}
                                            disabled
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={profileData.phone}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${!isEditing && 'bg-gray-50'
                                                }`}
                                        />
                                    </div>
                                </div>

                                {isEditing && (
                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={updating}
                                        className="btn-primary flex items-center gap-2 disabled:opacity-50"
                                    >
                                        <Save size={20} />
                                        {updating ? 'Saving...' : 'Save Changes'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Delivery Addresses */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold">Delivery Addresses</h2>
                                <button
                                    onClick={() => navigate('/profile/addresses')}
                                    className="text-green-600 hover:text-green-700 font-medium"
                                >
                                    Manage
                                </button>
                            </div>

                            {userData.addresses && userData.addresses.length > 0 ? (
                                <div className="space-y-3">
                                    {userData.addresses.slice(0, 2).map((address, index) => (
                                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                                            <div className="flex items-start gap-3">
                                                <MapPin className="text-green-500 mt-1" size={20} />
                                                <div className="flex-1">
                                                    <p className="font-semibold">{address.fullName}</p>
                                                    <p className="text-sm text-gray-600">{address.phone}</p>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {address.address}, {address.area}, {address.city}
                                                        {address.postalCode && `, ${address.postalCode}`}
                                                    </p>
                                                    {address.isDefault && (
                                                        <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                                                            Default
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-4">No addresses added yet</p>
                            )}
                        </div>

                        {/* Change Password */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Lock size={24} />
                                Change Password
                            </h2>

                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Enter current password"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Enter new password"
                                        required
                                        minLength={6}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Confirm new password"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="btn-primary disabled:opacity-50"
                                >
                                    {updating ? 'Updating...' : 'Update Password'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
