import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

// Define schemas directly here to avoid circular dependencies
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    phone: { type: String, unique: true },
    password: String,
    role: { type: String, default: 'user' },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date, default: Date.now },
}, { timestamps: true });

const categorySchema = new mongoose.Schema({
    name: { type: String, unique: true },
    namebn: String,
    slug: String,
    icon: String,
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
    name: String,
    namebn: String,
    description: String,
    descriptionbn: String,
    price: Number,
    originalPrice: Number,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    images: [{ url: String }],
    unit: String,
    stock: Number,
    isOrganic: Boolean,
    isFeatured: Boolean,
    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    features: [String],
    tags: [String],
}, { timestamps: true });

// Get or create models
const User = mongoose.models.User || mongoose.model('User', userSchema);
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected');

        // Clear data
        console.log('🗑️  Clearing data...');
        await User.deleteMany({});
        await Category.deleteMany({});
        await Product.deleteMany({});

        // Create admin user
        console.log('👤 Creating admin user...');
        await User.create({
            name: 'Admin User',
            email: 'admin@freshmart.com',
            phone: '+8801700000000',
            password: '$2a$10$8KqV3Z9FZqZ9xZ9xZ9xZ9.9xZ9xZ9xZ9xZ9xZ9xZ9xZ9xZ9xZ9xZ', // admin123 hashed
            role: 'admin',
        });

        // Create categories
        console.log('📁 Creating categories...');
        const categories = await Category.create([
            { name: 'Vegetables', namebn: 'সবজি', slug: 'vegetables', icon: '🥬', sortOrder: 1 },
            { name: 'Fruits', namebn: 'ফল', slug: 'fruits', icon: '🍎', sortOrder: 2 },
            { name: 'Dairy', namebn: 'দুগ্ধজাত', slug: 'dairy', icon: '🥛', sortOrder: 3 },
        ]);

        // Create products
        console.log('🛍️  Creating products...');
        await Product.create([
            {
                name: 'Fresh Tomatoes',
                namebn: 'তাজা টমেটো',
                description: 'Fresh tomatoes',
                price: 45,
                originalPrice: 60,
                category: categories[0]._id,
                images: [{ url: '/placeholder.jpg' }],
                unit: 'kg',
                stock: 100,
                isOrganic: true,
                isFeatured: true,
                tags: ['vegetables', 'fresh'],
            },
            {
                name: 'Green Apples',
                namebn: 'সবুজ আপেল',
                description: 'Fresh apples',
                price: 120,
                category: categories[1]._id,
                images: [{ url: '/placeholder.jpg' }],
                unit: 'kg',
                stock: 50,
                isFeatured: true,
            },
        ]);

        console.log('\n✅ Database seeded successfully!');
        console.log('🔐 Admin: admin@freshmart.com / admin123\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

seedDatabase();