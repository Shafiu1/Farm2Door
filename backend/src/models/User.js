import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide your name'],
            trim: true,
            maxlength: [50, 'Name cannot exceed 50 characters'],
        },
        email: {
            type: String,
            required: [true, 'Please provide your email'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email',
            ],
        },
        phone: {
            type: String,
            required: [true, 'Please provide your phone number'],
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        avatar: {
            type: String,
            default: null,
        },
        addresses: [
            {
                fullName: String,
                phone: String,
                address: String,
                city: String,
                area: String,
                postalCode: String,
                isDefault: {
                    type: Boolean,
                    default: false,
                },
            },
        ],
        isVerified: {
            type: Boolean,
            default: false,
        },
        verificationCode: {
            type: String,
            select: false,
        },
        verificationCodeExpires: {
            type: Date,
            select: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        lastLogin: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate verification code
userSchema.methods.generateVerificationCode = function () {
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash the code before saving
    this.verificationCode = crypto.createHash('sha256').update(code).digest('hex');

    // Set expiry to 15 minutes
    this.verificationCodeExpires = Date.now() + 15 * 60 * 1000;

    return code;
};

// Remove password from JSON response
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    delete user.verificationCode;
    delete user.verificationCodeExpires;
    return user;
};

const User = mongoose.model('User', userSchema);

export default User;
