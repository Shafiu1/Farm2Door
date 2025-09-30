# Freshmart Backend API

Backend API for Freshmart - Bangladesh's trusted online grocery e-commerce platform.

## 🚀 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting
- **Payment**: bKash, Nagad (Integration ready)

## 📁 Project Structure

```
freshmart-server/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── categoryController.js
│   │   └── orderController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── cartRoutes.js
│   │   └── paymentRoutes.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── utils/
│   │   ├── jwtToken.js
│   │   └── seeder.js
│   ├── app.js
│   └── server.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
cd freshmart-server
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/freshmart
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:3000
```

### 3. Setup MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB locally
# Start MongoDB service
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update MONGODB_URI in .env

### 4. Seed Database (Optional)

Populate database with sample data:

```bash
node src/utils/seeder.js
```

This will create:
- 2 users (admin & demo)
- 8 categories
- 6 sample products

### 5. Start Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will run on: `http://localhost:5000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/address` - Add delivery address
- `PUT /api/auth/address/:id` - Update address
- `DELETE /api/auth/address/:id` - Delete address

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured` - Get featured products
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `POST /api/products/:id/reviews` - Add product review

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/user` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/cancel` - Cancel order
- `GET /api/orders` - Get all orders (Admin)
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Payments
- `POST /api/payments/bkash/initiate` - Initiate bKash payment
- `POST /api/payments/bkash/execute` - Execute bKash payment
- `POST /api/payments/nagad/initiate` - Initiate Nagad payment
- `POST /api/payments/nagad/verify` - Verify Nagad payment
- `GET /api/payments/history` - Get payment history

## 🔐 Default Credentials (After Seeding)

**Admin Account:**
- Email: `admin@freshmart.com`
- Password: `admin123`

**Demo User:**
- Email: `demo@freshmart.com`
- Password: `demo123`

## 🧪 Testing API

Use Postman, Thunder Client, or any API testing tool:

1. Register/Login to get JWT token
2. Add token to Authorization header:
   ```
   Authorization: Bearer <your-token>
   ```
3. Test protected endpoints

## 📦 NPM Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
node src/utils/seeder.js  # Seed database
```

## 🔒 Security Features

- JWT Authentication
- Password Hashing (bcrypt)
- Rate Limiting
- Helmet (Security headers)
- CORS Configuration
- Input Validation
- Error Handling

## 🚧 Payment Gateway Integration

To integrate bKash/Nagad:

1. Get API credentials from payment provider
2. Update `.env` with credentials
3. Implement payment logic in `src/routes/paymentRoutes.js`
4. Test in sandbox environment
5. Switch to production when ready

## 📝 Notes

- MongoDB must be running before starting the server
- Update JWT_SECRET in production
- Configure CORS for your frontend URL
- Implement payment gateway integration as per provider docs

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

This project is licensed under the ISC License.

---

**Made with ❤️ in Bangladesh**