# Inventory System - Complete Setup Guide

## ✅ Features Implemented

### 1. **User Authentication & Authorization**
- ✅ User Registration (name, email, password)
- ✅ User Login with JWT tokens (7-day expiry)
- ✅ Password hashing with bcryptjs
- ✅ Role-based access control (Admin/User)
- ✅ Protected routes with guards

### 2. **Admin-Only Features**
- ✅ Add/Edit/Delete products
- ✅ Manage users and roles
- ✅ Dashboard with statistics
- ✅ File uploads

### 3. **Product Management (CRUD)**
- ✅ Create products with image upload
- ✅ Read products with full details
- ✅ Update product information
- ✅ Delete products
- ✅ Search by name, description, or category
- ✅ Filter by category
- ✅ Sort by date or other fields
- ✅ Pagination (customizable page size)

### 4. **Dashboard & Statistics**
- ✅ Total products count
- ✅ Total inventory value
- ✅ Low stock alerts (≤10 items)
- ✅ Category count
- ✅ Recent products list

### 5. **File Management**
- ✅ Image upload (JPEG, PNG, WebP, GIF)
- ✅ 5MB file size limit
- ✅ Supabase Storage integration
- ✅ Public URL generation

### 6. **Frontend Integration**
- ✅ Angular 17+ with standalone components
- ✅ Reactive forms with validation
- ✅ Signal-based state management
- ✅ HTTP interceptor for auth
- ✅ Tailwind CSS styling
- ✅ Responsive design

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Supabase account (free tier available at supabase.com)

### Step 1: Set Up Supabase Database

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to **SQL Editor** in your project dashboard
3. Create a new query and paste the entire contents of [schema.sql](./schema.sql)
4. Click **Run** to execute

This creates:
- `users` table
- `products` table
- Automatic `updated_at` triggers
- Row-level security policies
- Storage bucket for product images

### Step 2: Configure Server Environment

1. Edit [server/.env](./server/.env) with your Supabase credentials:

```bash
# Get these from Supabase Dashboard → Project Settings → API
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
JWT_SECRET=generate-a-random-string-here
```

Generate a strong JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 3: Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# In another terminal, install client dependencies
cd client
npm install
```

### Step 4: Start the Application

```bash
# Terminal 1: Start the backend server
cd server
npm run dev
# Server runs on http://localhost:5000

# Terminal 2: Start the frontend dev server
cd client
npm start
# Frontend runs on http://localhost:4200
```

---

## 📋 Testing the Features

### 1. **Register a New Account**
- Go to http://localhost:4200/register
- Fill in name, email, and password
- Click "Create Account"
- You'll be automatically logged in as a regular user

### 2. **View Products**
- Click "Products" in the sidebar
- Try search, filter by category, and pagination
- Click any product to view details

### 3. **Add a Product (Admin Only)**
- (First, you need admin access - see step 4)
- Click "Add Product" button
- Fill in product details
- Upload an image (max 5MB)
- Click "Save Product"

### 4. **Get Admin Access**
- Register/login as a user
- Use Supabase console to manually update your role:
  1. Go to Supabase Dashboard → SQL Editor
  2. Run: `UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com'`
  3. Refresh the page

### 5. **Manage Users (Admin Only)**
- Click "Users" in the sidebar
- View all system users
- Change roles (Admin/User)
- Delete users (can't delete yourself)

### 6. **Dashboard**
- Click "Dashboard" to see inventory statistics
- View total products, total value, low stock items, and categories

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List products (with pagination, search, filter)
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)
- `GET /api/products/categories` - Get all categories
- `GET /api/products/dashboard` - Get dashboard statistics

### Users (Admin Only)
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user details
- `PATCH /api/users/:id/role` - Update user role
- `DELETE /api/users/:id` - Delete user

---

## 🛠️ Development Commands

```bash
# Server
npm run dev        # Start development server with hot reload
npm run build      # Compile TypeScript
npm run start      # Run compiled server
npm run lint       # Run ESLint

# Client
npm start          # Start dev server
npm run build      # Build for production
npm run lint       # Run linter
```

---

## 🐛 Troubleshooting

### "Could not find the table 'public.users' in the schema cache"
- **Solution**: Run the [schema.sql](./schema.sql) in your Supabase SQL Editor

### "Http failure response: 0 Unknown Error"
- **Solution**: 
  1. Make sure server is running: `npm run dev` in server folder
  2. Check .env file has correct Supabase credentials
  3. Check CORS settings in server/src/index.ts

### "Cannot GET /login"
- **Solution**: The frontend needs to be running. Start it with `npm start` in client folder

### Image upload not working
- **Solution**:
  1. Check Supabase Storage bucket exists (should be created by schema.sql)
  2. Verify storage policies are set up
  3. Check file size is under 5MB

---

## 📁 Project Structure

```
inventory-system/
├── server/                 # Express.js backend
│   ├── src/
│   │   ├── config/        # Supabase configuration
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/    # Auth, error handling, uploads
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── types/         # TypeScript interfaces
│   ├── .env               # Environment variables
│   └── package.json
│
├── client/                # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/      # Guards, services, interceptors
│   │   │   ├── features/  # Feature components
│   │   │   └── shared/    # Shared components
│   │   └── environments/  # API configuration
│   └── package.json
│
├── schema.sql             # Database schema
└── SETUP_GUIDE.md        # This file
```

---

## 🎨 Customization

### Change API URL
Edit [client/src/environments/environment.ts](client/src/environments/environment.ts):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api', // Change this
};
```

### Change Server Port
Edit [server/.env](server/.env):
```
PORT=3000  # Change from 5000 to your port
```

### Add More Product Fields
1. Update database schema in Supabase
2. Update `Product` interface in [server/src/types/index.ts](server/src/types/index.ts)
3. Update `Product` interface in [client/src/app/core/models/index.ts](client/src/app/core/models/index.ts)
4. Update components as needed

---

## 📞 Support

For issues or questions:
1. Check console for error messages
2. Review Supabase dashboard for data
3. Check network tab in browser DevTools
4. Review server logs in terminal

---

## ✨ Next Steps (Optional)

- [ ] Add email verification on registration
- [ ] Implement password reset
- [ ] Add product reviews/ratings
- [ ] Implement bulk product import (CSV)
- [ ] Add inventory movement history
- [ ] Add low stock alerts via email
- [ ] Implement audit logging
- [ ] Add API rate limiting
- [ ] Deploy to production (Vercel/Render)

---

**Your inventory system is fully functional! 🎉**
