import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

// Upload single image
export const uploadImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded',
            });
        }

        // Convert buffer to stream
        const stream = Readable.from(req.file.buffer);

        // Upload to cloudinary
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'freshmart/products',
                    resource_type: 'image',
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            stream.pipe(uploadStream);
        });

        res.status(200).json({
            success: true,
            message: 'Image uploaded successfully',
            image: {
                url: result.secure_url,
                public_id: result.public_id,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Upload multiple images
export const uploadMultipleImages = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No files uploaded',
            });
        }

        const uploadPromises = req.files.map((file) => {
            const stream = Readable.from(file.buffer);

            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'freshmart/products',
                        resource_type: 'image',
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve({
                            url: result.secure_url,
                            public_id: result.public_id,
                        });
                    }
                );
                stream.pipe(uploadStream);
            });
        });

        const images = await Promise.all(uploadPromises);

        res.status(200).json({
            success: true,
            message: 'Images uploaded successfully',
            images,
        });
    } catch (error) {
        next(error);
    }
};

// Delete image
export const deleteImage = async (req, res, next) => {
    try {
        const { public_id } = req.body;

        if (!public_id) {
            return res.status(400).json({
                success: false,
                message: 'Public ID is required',
            });
        }

        await cloudinary.uploader.destroy(public_id);

        res.status(200).json({
            success: true,
            message: 'Image deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};