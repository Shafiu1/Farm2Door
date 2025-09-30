import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Note: Cart is handled on frontend with localStorage
// These routes are for syncing cart with backend if needed

router.get('/', protect, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Cart sync endpoint - implement as needed',
    });
});

router.post('/sync', protect, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Cart synced successfully',
    });
});

export default router;