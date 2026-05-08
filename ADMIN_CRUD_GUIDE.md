# Admin Product Management (CRUD) Guide

## Overview

The Inventory Management System provides a complete admin interface for managing products with full CRUD (Create, Read, Update, Delete) functionality. This guide walks through each operation and best practices for product management.

---

## Quick Start

### Login as Admin

1. Navigate to **http://localhost:4200/login**
2. Enter admin credentials:
   - **Email:** `admin@example.com`
   - **Password:** `Admin@123`
3. Click **Sign in**

After successful login, you'll see the admin dashboard with access to the Products management panel.

---

## Admin Dashboard

The admin interface includes:

- **Left Sidebar Navigation:**
  - Dashboard - Overview and statistics
  - Products - Product management (CREATE, READ, UPDATE, DELETE)
  - Users - User management

- **Top Right:** Admin profile showing role and Logout button

### Dashboard Statistics

The dashboard displays real-time inventory metrics:
- **Total Products:** Count of all products in the system
- **Total Value:** Sum of (quantity × price) for all products
- **Low Stock:** Count of products with quantity ≤ 10
- **Categories:** Total number of unique categories
- **Recent Products:** Table showing the latest 5 products

---

## Product Management Interface

Navigate to **Products** (http://localhost:4200/products) to access the product management interface.

### Main Features

1. **Add Product Button** - Create new product (blue button, top right)
2. **Search Box** - Real-time product search by name, description, or category
3. **Category Filter** - Filter products by category (dropdown)
4. **Sort Order** - Sort by newest/oldest (dropdown)
5. **Product Grid** - Displays all products with action buttons

---

## CREATE - Adding New Products

### Method 1: Add Product Button

1. Click the **"Add Product"** button (blue button at top right)
2. You'll be taken to `/products/new` form page

### Fill in Product Details

**Required Fields** (marked with *)

| Field | Description | Example |
|-------|-------------|---------|
| **Product Name** | Unique name of the product | Wireless Keyboard |
| **Price (₱)** | Product price in Philippine Pesos | 79.99 |
| **Quantity** | Available stock quantity | 150 |
| **Category** | Product category (free text) | Office Equipment |

**Optional Fields**

| Field | Description |
|-------|-------------|
| **Description** | Detailed product description (up to 500 characters) |
| **Product Image** | Product photo (PNG, JPG, WebP, max 5MB) |

### Image Upload

1. Click **"Click to upload image"** area
2. Select a PNG, JPG, WebP, or GIF image (max 5MB)
3. Image will be uploaded to Supabase Storage
4. A preview will appear after upload

### Submit

1. Review all entered information
2. Click **"Create Product"** button
3. Product will be added and you'll return to product list
4. New product appears at the top of the list

### Success Indicators

- ✅ Product count increases by 1
- ✅ New product appears in the list
- ✅ Category automatically added to filter dropdown
- ✅ Product details visible in grid cards

### Example: Create Product

```
Product Name: USB-C Hub
Price: ₱1,299.99
Quantity: 50
Category: Computer Accessories
Description: 7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader
Image: usb-hub.jpg (uploaded)
```

**Result:** Product saved and visible in the product list

---

## READ - Viewing Products

### Product List View

The product grid displays:
- Product image thumbnail
- Product name (heading)
- Category label
- Description (partial)
- Price (₱ currency)
- Stock quantity
- Action buttons: View, Edit, Delete

### View Product Details

1. Click the **"View"** link on any product card
2. Navigate to product detail page (`/products/[id]`)

### Product Detail Page Shows

- Full product name and category
- Complete description
- Price per unit (₱)
- Available stock quantity
- Total value (price × quantity)
- Created by (admin name)
- Created date/time
- Last updated date/time
- Edit and Delete buttons for further actions

### Filtering & Search

**Search:**
- Type in the search box to find products by name, description, or category
- Search is real-time (results update as you type)
- Searches across all product fields

**Filter by Category:**
- Select a category from the dropdown to show only products in that category
- "All categories" shows all products

**Sort Order:**
- "Newest first" - Shows recently added products first
- "Oldest first" - Shows oldest products first

---

## UPDATE - Editing Products

### Access Edit Form

**From Product List:**
1. Find the product to edit
2. Click the **"Edit"** link on the product card

**From Product Detail Page:**
1. Click the **"Edit"** button at the top

### Edit Form

You'll see the same form as CREATE with all current product details pre-filled:
- Product Name (editable)
- Price (editable)
- Quantity (editable)
- Category (editable)
- Description (editable)
- Product Image (can replace with new image)

### Make Changes

1. Modify any field you want to update
2. To change the image:
   - Click the image area
   - Select a new image (old image will be replaced)

### Save Changes

1. Click **"Update Product"** button
2. Form shows "Saving..." while processing
3. Success: You're redirected to product list with updated data

### Update Examples

**Change Stock Quantity:**
- Original: 50 units
- Updated to: 75 units
- ✅ Product list shows "75 in stock"

**Change Price:**
- Original: ₱99.99
- Updated to: ₱129.99
- ✅ Dashboard "Total Value" recalculates automatically

**Add/Change Image:**
- Click image area
- Upload new product image
- ✅ New image displays in product grid

---

## DELETE - Removing Products

### Delete a Product

**From Product List:**
1. Find the product to delete
2. Click the **"Delete"** button on the product card

**From Product Detail Page:**
1. Click the **"Delete"** button at the top

### Confirmation Dialog

A confirmation dialog appears:
- **Title:** "Delete Product"
- **Message:** "Are you sure you want to delete [Product Name]? This action cannot be undone."
- **Buttons:** Cancel | Delete

### Confirm Deletion

1. Click **"Delete"** button (red) to confirm
2. Product is permanently removed from the database
3. Product count decreases by 1
4. You're returned to the product list

### Success Indicators

- ✅ Product count decreases
- ✅ Product no longer appears in list
- ✅ Total value recalculates
- ✅ Category filter updated (if no other products in that category)

---

## Database Constraints & Validations

### Field Requirements

| Field | Type | Validation |
|-------|------|-----------|
| Product Name | Text (required) | Must be unique |
| Price | Decimal (required) | Must be > 0 |
| Quantity | Integer (required) | Must be ≥ 0 |
| Category | Text (required) | Any text allowed |
| Description | Text | Optional, max 500 chars |
| Image URL | URL | Optional, max 500 chars |

### Image Specifications

- **Supported formats:** PNG, JPG, WebP, GIF
- **Maximum size:** 5MB
- **Storage:** Supabase Storage (cloud-based)
- **Accessibility:** Public URL generated automatically

### Categories

- Categories are **not pre-defined** - any text is accepted
- New categories are automatically added to the filter dropdown
- Multiple products can share the same category
- Category names are case-sensitive

---

## Bulk Operations

### Reset All Products

To quickly reset the product database to a fresh set of 10 curated products:

```bash
npm run reset-products
```

This script:
1. Deletes all existing products
2. Inserts 10 new products with matched Unsplash images
3. Organizes products into 5 categories
4. Ensures all products have valid images

**Note:** This is a destructive operation. Back up data before running.

### Seed Initial Products

To populate database with 25 sample products:

```bash
npm run seed
```

---

## Troubleshooting

### Issue: Product not saving

**Solution:**
1. Check all required fields are filled (Product Name, Price, Quantity, Category)
2. Ensure quantity is a valid number
3. Check internet connection for image uploads
4. Try submitting again

### Issue: Image won't upload

**Possible causes:**
- File is larger than 5MB
- File format not supported (must be PNG, JPG, WebP, GIF)
- Supabase Storage connection issue

**Solution:**
1. Verify file format and size
2. Try uploading a different image
3. Skip image upload (images are optional)

### Issue: Product deleted accidentally

**Note:** Deletions are permanent and cannot be undone. The confirmation dialog is the only safety measure.

**Prevention:**
- Always read confirmation dialog carefully
- Click Cancel if unsure
- Regular database backups recommended

### Issue: Search not finding products

**Troubleshooting:**
1. Check spelling in search box
2. Search is case-insensitive
3. Clear filters (select "All categories")
4. Refresh page with F5

---

## Best Practices

### Product Management

1. **Use descriptive names:** "Wireless Mouse" vs "mouse"
2. **Organize categories:** Keep category names consistent
3. **Update quantities regularly:** Reflect actual stock levels
4. **Add quality images:** Improves user experience
5. **Write clear descriptions:** Help customers understand products

### Admin Workflow

1. **Regular inventory reviews:** Check dashboard statistics
2. **Keep stock accurate:** Update quantities as items are sold
3. **Archive old products:** Delete discontinued items
4. **Maintain category structure:** Keep 5-10 main categories
5. **Monitor total value:** Useful for business planning

### Security

1. **Don't share admin credentials:** Only admins should access `/products/new`
2. **Use strong password:** Change from default `Admin@123`
3. **Log out properly:** Use Logout button after admin work
4. **Audit operations:** Review creation dates and recent updates

---

## Quick Reference

### CRUD Operations

| Operation | Action | Shortcut |
|-----------|--------|----------|
| **Create** | Add Product button | `/products/new` |
| **Read** | View link on product | `/products/[id]` |
| **Update** | Edit link on product | `/products/[id]/edit` |
| **Delete** | Delete button, confirm | Permanent |

### URLs

- Dashboard: http://localhost:4200/dashboard
- Products: http://localhost:4200/products
- Add Product: http://localhost:4200/products/new
- Edit Product: http://localhost:4200/products/[ID]/edit
- View Product: http://localhost:4200/products/[ID]

### Admin Credentials

- **Email:** admin@example.com
- **Password:** Admin@123
- **Role:** admin

---

## Additional Resources

- [Backend API Documentation](./server/src/controllers/product.controller.ts)
- [Product Service](./server/src/services/product.service.ts)
- [Frontend Product Component](./client/src/app/features/products/)

---

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Verify backend server is running (`npm run dev` in /server)
3. Verify frontend is running (`ng serve` in /client)
4. Check browser console for error messages
5. Contact development team

---

**Last Updated:** May 8, 2026  
**Version:** 1.0  
**Status:** ✅ Fully Operational
