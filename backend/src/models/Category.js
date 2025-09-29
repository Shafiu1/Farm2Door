import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
            maxlength: [100, 'Product name cannot exceed 100 characters'],
        },
        namebn: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Product description is required'],
        },
        descriptionbn: {
            type: String,
        },
        price: {
            type: Number,
            required: [true, 'Product price is required'],
            min: [0, 'Price cannot be negative'],
        },
        originalPrice: {
            type: Number,
            min: [0, 'Original price cannot be negative'],
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Product category is required'],
        },
        images: [
            {
                url: {
                    type: String,
                    required: true,
                },
                public_id: String,
            },
        ],
        unit: {
            type: String,
            required: [true, 'Product unit is required'],
            enum: ['kg', 'gram', 'liter', 'ml', 'piece', 'dozen', 'bundle'],
            default: 'kg',
        },
        stock: {
            type: Number,
            required: [true, 'Product stock is required'],
            min: [0, 'Stock cannot be negative'],
            default: 0,
        },
        isOrganic: {
            type: Boolean,
            default: false,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        rating: {
            type: Number,
            default: 0,
            min: [0, 'Rating cannot be less than 0'],
            max: [5, 'Rating cannot be more than 5'],
        },
        numReviews: {
            type: Number,
            default: 0,
        },
        reviews: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
                name: {
                    type: String,
                    required: true,
                },
                rating: {
                    type: Number,
                    required: true,
                    min: 1,
                    max: 5,
                },
                comment: {
                    type: String,
                    required: true,
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        nutritions: {
            calories: String,
            protein: String,
            carbs: String,
            fiber: String,
            fat: String,
        },
        features: [String],
        tags: [String],
    },
    {
        timestamps: true,
    }
);

// Index for search
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Calculate average rating
productSchema.methods.calculateAverageRating = function () {
    if (this.reviews.length === 0) {
        this.rating = 0;
        this.numReviews = 0;
    } else {
        const totalRating = this.reviews.reduce((acc, review) => acc + review.rating, 0);
        this.rating = (totalRating / this.reviews.length).toFixed(1);
        this.numReviews = this.reviews.length;
    }
};

const Product = mongoose.model('Product', productSchema);

export default Product;