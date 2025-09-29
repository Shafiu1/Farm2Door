import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User, Mail, Phone, MapPin, Camera, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user } = useSelector((state) => state.auth);
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.name || 'John Doe',
        email: user?.email || 'john@example.com',
        phone: user?.phone || '+880 1700-000000',
        address: 'House #123, Road #12, Dhanmondi',
        city: 'Dhaka',
        postalCode: '1209',
    });

    const handleInputChange = (e) => {
        setProfileData({
            ...profileData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = () => {
        // In real app, dispatch update user action
        toast.success('Profile updated successfully!');
        setIsEditing(false);
    };

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
                                    <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center text-4xl font-bold text-green-600 mx-auto">
                                        {profileData.name.charAt(0).toUpperCase()}
                                    </div>
                                    <button className="absolute bottom-0 right-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600 transition-colors">
                                        <Camera size={20} />
                                    </button>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 mt-4">{profileData.name}</h2>
                                <p className="text-gray-600">{profileData.email}</p>
                            </div>

                            {/* Stats */}
                            <div className="space-y-4">
                                <div className="p-4 bg-green-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Total Orders</p>
                                    <p className="text-2xl font-bold text-green-600">12</p>
                                </div>
                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Total Spent</p>
                                    <p className="text-2xl font-bold text-blue-600">৳4,580</p>
                                </div>
                                <div className="p-4 bg-orange-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Member Since</p>
                                    <p className="text-lg font-bold text-orange-600">Jan 2024</p>
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
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="text-green-600 hover:text-green-700 font-medium"
                                >
                                    {isEditing ? 'Cancel' : 'Edit'}
                                </button>
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
                                            className={`input-field pl-10 ${!isEditing && 'bg-gray-50'}`}
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
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className={`input-field pl-10 ${!isEditing && 'bg-gray-50'}`}
                                        />
                                    </div>
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
                                            className={`input-field pl-10 ${!isEditing && 'bg-gray-50'}`}
                                        />
                                    </div>
                                </div>

                                {isEditing && (
                                    <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                                        <Save size={20} />
                                        Save Changes
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Address Information */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-xl font-bold mb-6">Delivery Address</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Street Address
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            name="address"
                                            value={profileData.address}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className={`input-field pl-10 ${!isEditing && 'bg-gray-50'}`}
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={profileData.city}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className={`input-field ${!isEditing && 'bg-gray-50'}`}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Postal Code
                                        </label>
                                        <input
                                            type="text"
                                            name="postalCode"
                                            value={profileData.postalCode}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className={`input-field ${!isEditing && 'bg-gray-50'}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Change Password */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-xl font-bold mb-6">Change Password</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        className="input-field"
                                        placeholder="Enter current password"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        className="input-field"
                                        placeholder="Enter new password"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        className="input-field"
                                        placeholder="Confirm new password"
                                    />
                                </div>

                                <button className="btn-primary">
                                    Update Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;