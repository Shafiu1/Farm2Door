import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { sendOrderConfirmationEmail,sendOrderStatusEmail } from '../utils/emailService.js';
// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
    try {
        const {
            orderItems,
            shippingInfo,
            paymentInfo,
            itemsPrice,
            deliveryCharge,
            taxPrice,
            totalPrice,
        } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No order items provided',
            });
        }

        // Validate stock and update quantities
        for (const item of orderItems) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product not found: ${item.name}`,
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}`,
                });
            }

            // Reduce stock
            product.stock -= item.quantity;
            await product.save();
        }

        const order = await Order.create({
            user: req.user.id,
            orderItems,
            shippingInfo,
            paymentInfo,
            itemsPrice,
            deliveryCharge,
            taxPrice,
            totalPrice,
        });

        res.status(201).json({
            success: true,
            order,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user orders
// @route   GET /api/orders/user
// @access  Private
export const getUserOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate('orderItems.product', 'name images')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: orders.length,
            orders,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email phone')
            .populate('orderItems.product', 'name images');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        // Check if user owns the order or is admin
        if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this order',
            });
        }

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        order.orderStatus = status;

        if (status === 'delivered') {
            order.deliveredAt = Date.now();
            order.paymentInfo.status = 'completed';
        }

        if (status === 'cancelled') {
            order.cancelledAt = Date.now();

            // Restore stock
            for (const item of order.orderItems) {
                const product = await Product.findById(item.product);
                if (product) {
                    product.stock += item.quantity;
                    await product.save();
                }
            }
        }

        await order.save();

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        // Check if user owns the order
        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this order',
            });
        }

        // Can only cancel pending or processing orders
        if (!['pending', 'processing'].includes(order.orderStatus)) {
            return res.status(400).json({
                success: false,
                message: 'Cannot cancel order in current status',
            });
        }

        order.orderStatus = 'cancelled';
        order.cancelledAt = Date.now();
        order.cancellationReason = req.body.reason || 'Cancelled by user';

        // Restore stock
        for (const item of order.orderItems) {
            const product = await Product.findById(item.product);
            if (product) {
                product.stock += item.quantity;
                await product.save();
            }
        }

        await order.save();

        res.status(200).json({
            success: true,
            message: 'Order cancelled successfully',
            order,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const query = {};

        if (req.query.status) {
            query.orderStatus = req.query.status;
        }

        const orders = await Order.find(query)
            .populate('user', 'name email phone')
            .populate('orderItems.product', 'name')
            .sort('-createdAt')
            .limit(limit)
            .skip(skip);

        const totalOrders = await Order.countDocuments(query);

        // Calculate total revenue
        const totalRevenue = await Order.aggregate([
            { $match: { orderStatus: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } },
        ]);

        res.status(200).json({
            success: true,
            count: orders.length,
            totalOrders,
            totalPages: Math.ceil(totalOrders / limit),
            currentPage: page,
            totalRevenue: totalRevenue[0]?.total || 0,
            orders,
        });
    } catch (error) {
        next(error);
    }
};

// Add this function to backend/src/controllers/orderController.js

// @desc    Get dashboard statistics (Admin)
// @route   GET /api/orders/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res, next) => {
    try {
        // Get total products
        const totalProducts = await Product.countDocuments({ isActive: true });

        // Get total orders
        const totalOrders = await Order.countDocuments();

        // Get total users
        const totalUsers = await User.countDocuments({ role: 'user' });

        // Calculate total revenue (exclude cancelled orders)
        const revenueData = await Order.aggregate([
            {
                $match: {
                    orderStatus: { $ne: 'cancelled' },
                    'paymentInfo.status': 'completed'
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$totalPrice' }
                }
            }
        ]);
        const totalRevenue = revenueData[0]?.total || 0;

        // Get recent orders (last 5)
        const recentOrders = await Order.find()
            .populate('user', 'name email')
            .populate('orderItems.product', 'name')
            .sort('-createdAt')
            .limit(5)
            .select('orderNumber orderItems totalPrice orderStatus createdAt user');

        // Get order status counts
        const orderStatusCounts = await Order.aggregate([
            {
                $group: {
                    _id: '$orderStatus',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Format order status counts
        const statusCounts = {
            pending: 0,
            processing: 0,
            shipping: 0,
            delivered: 0,
            cancelled: 0
        };
        orderStatusCounts.forEach(item => {
            statusCounts[item._id] = item.count;
        });

        // Get low stock products (stock < 10)
        const lowStockProducts = await Product.countDocuments({
            stock: { $lt: 10 },
            isActive: true
        });

        // Get today's orders
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayOrders = await Order.countDocuments({
            createdAt: { $gte: today }
        });

        // Get this month's revenue
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthRevenue = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startOfMonth },
                    orderStatus: { $ne: 'cancelled' }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$totalPrice' }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            stats: {
                totalProducts,
                totalOrders,
                totalUsers,
                totalRevenue: Math.round(totalRevenue),
                todayOrders,
                monthRevenue: Math.round(monthRevenue[0]?.total || 0),
                lowStockProducts,
                statusCounts,
                recentOrders: recentOrders.map(order => ({
                    id: order._id,
                    orderNumber: order.orderNumber,
                    customerName: order.user?.name || 'Unknown',
                    customerEmail: order.user?.email,
                    items: order.orderItems.length,
                    totalAmount: order.totalPrice,
                    status: order.orderStatus,
                    date: order.createdAt
                }))
            }
        });
    } catch (error) {
        next(error);
    }
};