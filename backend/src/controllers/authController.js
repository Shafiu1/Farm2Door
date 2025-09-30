import User from '../models/User.js';
import { sendTokenResponse } from '../utils/jwtToken.js';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
    try {
        const { name, email, phone, password } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ $or: [{ email }, { phone }] });

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: userExists.email === email
                    ? 'Email already registered'
                    : 'Phone number already registered',
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            phone,
            password,
        });

        sendTokenResponse(user, 201, res);
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password',
            });
        }

        // Check for user (include password)
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Check if password matches
        const isPasswordMatched = await user.comparePassword(password);

        if (!isPasswordMatched) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Your account has been deactivated',
            });
        }

        // Update last login
        user.lastLogin = Date.now();
        await user.save({ validateBeforeSave: false });

        sendTokenResponse(user, 200, res);
    } catch (error) {
        next(error);
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            message: 'Logged out successfully',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
    try {
        const { name, phone, avatar } = req.body;

        const user = await User.findById(req.user.id);

        if (user) {
            user.name = name || user.name;
            user.phone = phone || user.phone;
            user.avatar = avatar || user.avatar;

            const updatedUser = await user.save();

            res.status(200).json({
                success: true,
                user: updatedUser,
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide current and new password',
            });
        }

        const user = await User.findById(req.user.id).select('+password');

        // Check current password
        const isPasswordMatched = await user.comparePassword(currentPassword);

        if (!isPasswordMatched) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect',
            });
        }

        user.password = newPassword;
        await user.save();

        sendTokenResponse(user, 200, res);
    } catch (error) {
        next(error);
    }
};

// @desc    Add delivery address
// @route   POST /api/auth/address
// @access  Private
export const addAddress = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        const newAddress = {
            fullName: req.body.fullName,
            phone: req.body.phone,
            address: req.body.address,
            city: req.body.city,
            area: req.body.area,
            postalCode: req.body.postalCode,
            isDefault: req.body.isDefault || false,
        };

        // If this is set as default, unset others
        if (newAddress.isDefault) {
            user.addresses.forEach((addr) => {
                addr.isDefault = false;
            });
        }

        user.addresses.push(newAddress);
        await user.save();

        res.status(201).json({
            success: true,
            addresses: user.addresses,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update delivery address
// @route   PUT /api/auth/address/:id
// @access  Private
export const updateAddress = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const address = user.addresses.id(req.params.id);

        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Address not found',
            });
        }

        address.fullName = req.body.fullName || address.fullName;
        address.phone = req.body.phone || address.phone;
        address.address = req.body.address || address.address;
        address.city = req.body.city || address.city;
        address.area = req.body.area || address.area;
        address.postalCode = req.body.postalCode || address.postalCode;

        if (req.body.isDefault) {
            user.addresses.forEach((addr) => {
                addr.isDefault = false;
            });
            address.isDefault = true;
        }

        await user.save();

        res.status(200).json({
            success: true,
            addresses: user.addresses,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete delivery address
// @route   DELETE /api/auth/address/:id
// @access  Private
export const deleteAddress = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        user.addresses = user.addresses.filter(
            (addr) => addr._id.toString() !== req.params.id
        );

        await user.save();

        res.status(200).json({
            success: true,
            addresses: user.addresses,
        });
    } catch (error) {
        next(error);
    }
};