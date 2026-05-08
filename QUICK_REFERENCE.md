# Quick Reference Card - Admin CRUD Operations

## Admin Login

```
Email:    admin@example.com
Password: Admin@123
URL:      http://localhost:4200/login
```

---

## CRUD Operations Quick Start

### CREATE - Add New Product
**URL:** http://localhost:4200/products/new
**Button:** Click "Add Product" (blue) on products page

1. Fill: Product Name, Price, Quantity, Category
2. Optional: Description, Image
3. Click: "Create Product"
4. Result: ✅ Product appears in list

### READ - View Products
**URL:** http://localhost:4200/products

Features:
- 📋 Grid view of all products
- 🔍 Search bar (real-time)
- 🏷️ Category filter dropdown
- 📅 Sort by newest/oldest
- 👁️ "View" link for details

### READ - Product Details
**URL:** http://localhost:4200/products/:id

Shows:
- Full product information
- Price & stock quantity
- Total value calculation
- Creation metadata
- Edit & Delete buttons

### UPDATE - Edit Product
**URL:** http://localhost:4200/products/:id/edit
**Shortcut:** Click "Edit" link on product card

1. Modify any field (Name, Price, Quantity, Category, Description, Image)
2. Click: "Update Product"
3. Result: ✅ Changes saved and reflected in product list

### DELETE - Remove Product
**Shortcut:** Click "Delete" button on product card

1. Confirm dialog appears
2. Click: "Delete" to confirm
3. Result: ✅ Product removed from database

---

## Product Fields Reference

| Field | Required | Type | Format | Example |
|-------|----------|------|--------|---------|
| Product Name | ✅ | Text | Any | Wireless Keyboard |
| Price | ✅ | Decimal | ₱ | 79.99 |
| Quantity | ✅ | Integer | Numbers | 150 |
| Category | ✅ | Text | Any | Office Equipment |
| Description | ❌ | Text | Up to 500 chars | Professional wireless keyboard... |
| Image | ❌ | File | PNG/JPG/WebP/GIF | (max 5MB) |

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Focus Search | Ctrl+K |
| Submit Form | Enter (when in form) |
| Go to Products | Click Products nav |
| Logout | Logout button |

---

## Common URLs

| Page | URL |
|------|-----|
| Dashboard | http://localhost:4200/dashboard |
| Products List | http://localhost:4200/products |
| Add Product | http://localhost:4200/products/new |
| Edit Product | http://localhost:4200/products/:id/edit |
| View Product | http://localhost:4200/products/:id |
| Users | http://localhost:4200/users |

---

## Product List

### 10 Curated Products

1. **Wireless Keyboard** - Office Equipment - ₱79.99 - 150 qty
2. **Optical Mouse** - Office Equipment - ₱49.99 - 200 qty
3. **Stylus Pen** - Digital Accessories - ₱89.99 - 85 qty
4. **Portable Mini Sound Speaker** - Audio Equipment - ₱59.99 - 120 qty
5. **USB-C Cable** - Cables & Connectors - ₱19.99 - 500 qty
6. **Laptop Stand** - Office Equipment - ₱39.99 - 90 qty
7. **Screen Protector** - Digital Accessories - ₱14.99 - 400 qty
8. **Monitor Lamp** - Office Equipment - ₱44.99 - 75 qty
9. **Webcam HD** - Digital Accessories - ₱79.99 - 110 qty
10. **Phone Holder** - Mobile Accessories - ₱24.99 - 300 qty

### Inventory Stats

| Stat | Value |
|------|-------|
| Total Products | 10 |
| Total Quantity | 1,710 units |
| Total Value | ₱76,104.70 |
| Low Stock Items | 0 |
| Categories | 5 |

---

## Useful npm Commands

```bash
# Backend
npm run dev                # Start backend server
npm run seed              # Seed 25 sample products
npm run reset-products    # Reset to 10 products
npm run create-admin      # Create admin user
npm run add-images        # Add images to products
npm run verify-images     # Verify all have images

# Frontend
ng serve                  # Start Angular dev server
ng build                  # Build for production
```

---

## Form Validation Rules

| Field | Min | Max | Validation |
|-------|-----|-----|-----------|
| Product Name | 1 | 255 | Required, unique |
| Price | 0.01 | 999,999.99 | Required, positive |
| Quantity | 0 | 1,000,000 | Required, non-negative |
| Category | 1 | 100 | Required |
| Description | 0 | 500 | Optional |
| Image Size | - | 5MB | Optional, PNG/JPG/WebP/GIF |

---

## Dashboard Statistics

The admin dashboard displays:

- 📦 **Total Products** - Count of all products
- 💰 **Total Value** - Sum of (qty × price)
- ⚠️ **Low Stock** - Products with qty ≤ 10
- 🏷️ **Categories** - Number of unique categories
- 📊 **Recent Products** - Table of latest 5 products

---

## Search & Filter Tips

### Search
- Type product name (e.g., "Keyboard")
- Type category (e.g., "Office")
- Type description words
- Case-insensitive
- Real-time results

### Filter
- Select category from dropdown
- "All categories" = show all
- Combine with search for narrower results

### Sort
- "Newest first" = most recently added
- "Oldest first" = oldest first

---

## Common Issues & Quick Fixes

| Issue | Fix |
|-------|-----|
| Product not saving | Check all required fields filled |
| Image won't upload | Verify file <5MB and correct format |
| Search not working | Clear filters, check spelling |
| Form not submitting | Check for red validation messages |
| Product not updating | Ensure all required fields filled |
| Can't delete | Click confirmation button on dialog |
| Stuck on page | Refresh (F5) or clear browser cache |

---

## File Locations

| Resource | Path |
|----------|------|
| Backend API | `server/src/` |
| Product Controller | `server/src/controllers/product.controller.ts` |
| Product Service | `server/src/services/product.service.ts` |
| Frontend App | `client/src/app/` |
| Product Components | `client/src/app/features/products/` |
| Admin Guide | `ADMIN_CRUD_GUIDE.md` |
| Test Report | `CRUD_TEST_REPORT.md` |

---

## Getting Help

**Documentation Files:**
- ADMIN_CRUD_GUIDE.md - Comprehensive guide with examples
- CRUD_TEST_REPORT.md - Test verification and results
- PROJECT_COMPLETION_SUMMARY.md - Complete project overview

**Support:**
1. Check documentation files above
2. Review troubleshooting sections
3. Check backend console for errors
4. Check browser console (F12)
5. Verify both servers are running

---

## System Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend | 4200 | http://localhost:4200 |
| Backend | 5000 | http://localhost:5000 |
| Database | N/A | Supabase Cloud |

---

**Version:** 1.0 | **Date:** May 8, 2026 | **Status:** ✅ Complete
