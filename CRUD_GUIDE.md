# CRUD Operations Guide - Inventory System

## Quick Start: Seeding Sample Products

The system comes with 25 sample products across 5 categories. Here's how to populate them:

### Step 1: Prerequisites
Make sure you have:
- ✅ Backend server running (`npm run dev`)
- ✅ User account created (register at http://localhost:4200/register)
- ✅ Admin role set (ask admin to set your role in Supabase)

### Step 2: Run the Seed Script

```bash
cd server
npm run seed
```

**Expected Output:**
```
🌱 Starting product seed...

✅ Using user ID: xxxxx

✅ Successfully seeded 25 products!

📊 Products by category:
   • Electronics: 5 products
   • Home & Garden: 5 products
   • Office Supplies: 5 products
   • Fashion: 5 products
   • Sports & Outdoors: 5 products

🎉 Seeding complete!
```

---

## Sample Products Added

The seed includes 25 products across 5 categories:

### 1️⃣ Electronics (5 products)
- Samsung Galaxy S24 Ultra - $1,299.99 (45 in stock)
- iPhone 15 Pro Max - $1,199.99 (32 in stock)
- MacBook Pro 16" - $3,499.99 (12 in stock) ⚠️ Low stock
- iPad Air 2024 - $799.99 (28 in stock)
- Sony WH-1000XM5 - $399.99 (67 in stock)

### 2️⃣ Home & Garden (5 products)
- Smart Home Hub - $149.99 (18 in stock)
- Robot Vacuum Cleaner - $599.99 (8 in stock) ⚠️ Low stock
- Smart Thermostat - $249.99 (25 in stock)
- LED Smart Bulbs (4-pack) - $89.99 (156 in stock)
- Outdoor Security Camera - $299.99 (14 in stock)

### 3️⃣ Office Supplies (5 products)
- Ergonomic Office Chair - $449.99 (9 in stock) ⚠️ Low stock
- Standing Desk Converter - $299.99 (16 in stock)
- Wireless Keyboard & Mouse - $79.99 (94 in stock)
- USB-C Hub Multi-port - $129.99 (43 in stock)
- Monitor Light Bar - $179.99 (22 in stock)

### 4️⃣ Fashion (5 products)
- Designer Messenger Bag - $199.99 (11 in stock)
- Stainless Steel Watch - $299.99 (19 in stock)
- Wireless Earbuds Case - $49.99 (213 in stock)
- Laptop Backpack Pro - $149.99 (34 in stock)
- Screen Protector (10-pack) - $29.99 (456 in stock)

### 5️⃣ Sports & Outdoors (5 products)
- Portable Bluetooth Speaker - $149.99 (56 in stock)
- Fitness Tracker Watch - $199.99 (38 in stock)
- Yoga Mat Premium - $69.99 (127 in stock)
- Camping Tent 4-person - $349.99 (7 in stock) ⚠️ Low stock
- Water Bottle Smart - $89.99 (82 in stock)

---

## CRUD Operations

### READ - View Products

#### Via Frontend
1. Go to http://localhost:4200/products
2. Products display in a grid with images, prices, and stock levels
3. Use search, filter by category, sort by date

#### Via API
```bash
# List all products (with pagination)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:5000/api/products?page=1&limit=10&category=Electronics"

# Get single product
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:5000/api/products/{PRODUCT_ID}"

# Get dashboard statistics
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:5000/api/products/dashboard"
```

---

### CREATE - Add New Product

#### Via Frontend (Admin Only)
1. Go to http://localhost:4200/products
2. Click "Add Product" button
3. Fill in form:
   - Product Name (required)
   - Price (required)
   - Quantity (required)
   - Category (required)
   - Description (optional)
   - Image upload (optional)
4. Click "Save Product"

#### Via API
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: multipart/form-data" \
  -F "name=New Product" \
  -F "price=99.99" \
  -F "quantity=50" \
  -F "category=Electronics" \
  -F "description=Product description" \
  -F "image=@/path/to/image.jpg"
```

---

### UPDATE - Edit Product

#### Via Frontend (Admin Only)
1. Go to http://localhost:4200/products
2. Click "Edit" button on a product card
3. Modify any field
4. Upload new image if needed
5. Click "Update Product"

#### Via API
```bash
curl -X PUT http://localhost:5000/api/products/{PRODUCT_ID} \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: multipart/form-data" \
  -F "name=Updated Name" \
  -F "price=89.99" \
  -F "quantity=75" \
  -F "category=Electronics" \
  -F "description=Updated description" \
  -F "image=@/path/to/new-image.jpg"
```

---

### DELETE - Remove Product

#### Via Frontend (Admin Only)
1. Go to http://localhost:4200/products
2. Click "Delete" button on a product card
3. Product is removed immediately

#### Via API
```bash
curl -X DELETE http://localhost:5000/api/products/{PRODUCT_ID} \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Features Integrated

### ✅ Search
- Real-time search across product names, descriptions, categories
- Debounced (300ms) for performance

### ✅ Filter
- Filter by category
- Shows available categories from database

### ✅ Sort
- Sort by date created (newest/oldest)
- Customizable sort direction

### ✅ Pagination
- Page navigation with configurable page size
- Shows total count and current position
- Previous/Next buttons with disabled states

### ✅ Image Upload
- JPEG, PNG, WebP, GIF support
- 5MB file size limit
- Automatic upload to Supabase Storage
- Public URL generated for display

### ✅ Validation
- Field validation on form submission
- Backend validation on all endpoints
- Error messages displayed to user

### ✅ Low Stock Alerts
- Products with ≤10 items show "Low" badge
- Dashboard shows low stock count
- Helps with inventory management

---

## Testing CRUD Operations

### 1. Test CREATE
```bash
# Add a new product via API
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: multipart/form-data" \
  -F "name=Test Product" \
  -F "price=79.99" \
  -F "quantity=100" \
  -F "category=Electronics" \
  -F "description=Test product description"

# Verify in frontend: Product list should show new item
# Visit: http://localhost:4200/products
```

### 2. Test READ
```bash
# List products
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:5000/api/products"

# Get specific product
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:5000/api/products/{PRODUCT_ID}"

# Verify in frontend: Click on product card to view details
```

### 3. Test UPDATE
```bash
# Update product quantity
curl -X PUT http://localhost:5000/api/products/{PRODUCT_ID} \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: multipart/form-data" \
  -F "quantity=50"

# Verify in frontend: Edit product and change quantity
```

### 4. Test DELETE
```bash
# Delete product
curl -X DELETE http://localhost:5000/api/products/{PRODUCT_ID} \
  -H "Authorization: Bearer YOUR_TOKEN"

# Verify in frontend: Product should disappear from list
```

---

## Dashboard Statistics

The dashboard shows real-time inventory stats:

- **Total Products**: Count of all products
- **Total Value**: Sum of (price × quantity) for all products
- **Low Stock Items**: Count of products with ≤10 quantity
- **Categories**: Count of unique product categories

These update automatically when products are created/edited/deleted.

---

## Common Issues & Solutions

### ❌ "Seed script fails: No users found"
**Solution**: Register a user first at http://localhost:4200/register

### ❌ "Cannot add/edit/delete products"
**Solution**: You need admin role. Contact your admin or:
1. Go to Supabase dashboard
2. Run: `UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com'`
3. Refresh the page

### ❌ "Image upload fails"
**Solution**:
1. Check file is under 5MB
2. Check format is JPEG/PNG/WebP/GIF
3. Check Supabase Storage bucket exists

### ❌ "Products not showing in list"
**Solution**:
1. Check backend is running
2. Check auth token is valid
3. Check database has products (run seed script)

---

## API Response Examples

### Create Product (Success)
```json
{
  "success": true,
  "message": "Product created",
  "data": {
    "id": "uuid",
    "name": "New Product",
    "price": 99.99,
    "quantity": 50,
    "category": "Electronics",
    "image_url": "https://storage.url/product.jpg",
    "created_by": "user-uuid",
    "created_at": "2026-05-07T08:00:00Z",
    "updated_at": "2026-05-07T08:00:00Z"
  }
}
```

### List Products (Success)
```json
{
  "success": true,
  "message": "Products fetched",
  "data": [
    { "id": "uuid", "name": "Product 1", ... },
    { "id": "uuid", "name": "Product 2", ... }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

## Next Steps

1. ✅ Run seed script to populate products
2. ✅ Visit http://localhost:4200/products to see products
3. ✅ Test CREATE by adding a new product (admin only)
4. ✅ Test UPDATE by editing a product (admin only)
5. ✅ Test DELETE by removing a product (admin only)
6. ✅ Test SEARCH by typing in search box
7. ✅ Test FILTER by selecting category
8. ✅ Test PAGINATION by navigating pages

---

**Your inventory system is fully operational! 🎉**
