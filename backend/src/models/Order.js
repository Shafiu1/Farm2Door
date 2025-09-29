import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        orderItems: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                name: {
                    type: String,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                price: {
                    type: Number,
                    required: true,
                },
                image: String,
            },
        ],
        shippingInfo: {
            fullName: {
                type: String,
                required: true,
            },
            phone: {
                type: String,
                required: true,
            },
            email: String,
            address: {
                type: String,
                required: true,
            },
            city: {
                type: String,
                required: true,
            },
            area: {
                type: String,
                required: true,
            },
            postalCode: String,
        },
        paymentInfo: {
            method: {
                type: String,
                required: true,
                enum: ['bkash', 'nagad', 'rocket', 'cod', 'card'],
            },
            status: {
                type: String,
                enum: ['pending', 'completed', 'failed'],
                default: 'pending',
            },
            transactionId: String,
            paidAt: Date,
        },
        itemsPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        deliveryCharge: {
            type: Number,
            required: true,
            default: 0.0,
        },
        taxPrice: {
            type: Number,
            default: 0.0,
        },
        totalPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        orderStatus: {
            type: String,
            enum: ['pending', 'processing', 'shipping', 'delivered', 'cancelled'],
            default: 'pending',
        },
        deliveredAt: Date,
        cancelledAt: Date,
        cancellationReason: String,
    },
    {
        timestamps: true,
    }
);

// Virtual for order number
orderSchema.virtual('orderNumber').get(function () {
    return `ORD-${this._id.toString().slice(-8).toUpperCase()}`;
});

// Ensure virtuals are included in JSON
orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;