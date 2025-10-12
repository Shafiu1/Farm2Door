import express from 'express';
import {
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder,
    getAllOrders,
    getDashboardStats, // Add this import
} from '../controllers/orderController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Protected routes
router.post('/', protect, createOrder);
router.get('/user', protect, getUserOrders);



// Admin routes (specific one first)
router.get('/admin/stats', protect, admin, getDashboardStats); // Add this route BEFORE '/'
router.get('/', protect, admin, getAllOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);

//Routes with :id shoud come after admin routes
router.get('/:id', protect, getOrderById);
router.put('/:id/cancel', protect, cancelOrder);

export default router;