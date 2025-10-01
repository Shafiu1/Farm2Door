import express from 'express';
import { uploadImage, uploadMultipleImages, deleteImage } from '../controllers/uploadController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Upload single image
router.post('/image', protect, admin, upload.single('image'), uploadImage);

// Upload multiple images
router.post('/images', protect, admin, upload.array('images', 5), uploadMultipleImages);

// Delete image
router.delete('/image', protect, admin, deleteImage);

export default router;