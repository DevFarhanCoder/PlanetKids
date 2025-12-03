# PlanetKids E-commerce Flow Documentation

## 📋 Complete Admin to Frontend Flow

### **Step 1: Create Categories (Required First!)**

**Admin Panel → Categories → Add Category**

1. Go to: `http://localhost:3000/admin/categories/add`
2. Fill in:
   - **Category Name**: e.g., "Mugs", "Kids Toys", "School Supplies"
   - **Slug**: Auto-generated (e.g., "mugs", "kids-toys")
   - **Description**: Short description of the category
   - **Parent Category**: Leave as "None" for main category, or select a parent for subcategory
   - **Image**: Upload a category banner image (optional)
3. Click "Create Category"

**Result**: Category is now available in the category dropdown when adding products.

---

### **Step 2: Add Products to Categories**

**Admin Panel → Products → Add Product**

1. Go to: `http://localhost:3000/admin/products/add`
2. Fill in:
   
   **Basic Information:**
   - Product Name (e.g., "Coffee Mug")
   - Slug (auto-generated)
   - Description
   
   **Pricing:**
   - Price (required) - e.g., 637
   - Compare Price (optional) - e.g., 1000 (for showing discount)
   - Cost (optional) - your purchase cost
   
   **Inventory:**
   - SKU (optional)
   - Barcode (optional)
   - Check "Track quantity" if you want stock management
   - Quantity - e.g., 10
   
   **Product Images:**
   - Click "Upload" and select images
   - Add multiple images (first image becomes the main image)
   
   **Variants** (optional):
   - Add size/color variants if product has options
   
   **Sidebar:**
   - **Status**: Active (to show on website)
   - **Category**: Select the category you created ⭐ **REQUIRED**
   - **Tags**: toy, educational, kids (comma-separated)
   - **Featured Product**: Check this to show in "New Arrivals" on homepage

3. Click "Create Product"

**Result**: Product is now saved in database and linked to the selected category.

---

### **Step 3: View Products on Frontend**

**Products appear in 3 places:**

#### **A. Homepage** (`http://localhost:3000`)
- **"New Arrivals" section**: Shows products marked as "Featured"
- **"Shop by Category"**: Shows all categories you created
- Clicking a category takes you to that category page

#### **B. Category Page** (`http://localhost:3000/categories/[slug]`)
- Shows all products assigned to that specific category
- Example: `http://localhost:3000/categories/mugs`
- Has filters: price range, sorting
- Shows subcategories if any exist

#### **C. Product Detail Page** (`http://localhost:3000/products/[slug]`)
- Individual product page (coming soon - needs to be created)

---

## 🔄 **Complete Data Flow:**

```
┌─────────────────────────────────────────────────────────────────┐
│                         ADMIN PANEL                             │
│                  http://localhost:3000/admin                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  STEP 1: Create Categories                                      │
│  /admin/categories/add                                          │
│                                                                  │
│  Input: Name, Slug, Description, Parent (optional), Image       │
│  Output: Category saved to PostgreSQL database                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  STEP 2: Add Products                                           │
│  /admin/products/add                                            │
│                                                                  │
│  Input: Name, Price, Images, Category ID, Stock, etc.           │
│  Output: Product saved and linked to category via               │
│          ProductCategory junction table                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    POSTGRESQL DATABASE                          │
│                                                                  │
│  Tables:                                                         │
│  • Category (id, name, slug, description, imageUrl)            │
│  • Product (id, name, price, description, quantity, status)    │
│  • ProductCategory (productId, categoryId) - Links them        │
│  • ProductImage (productId, url, order)                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                         API ROUTES                              │
│                                                                  │
│  /api/categories → Fetches all categories                       │
│  /api/products → Fetches products (with filters)                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND WEBSITE                             │
│                  http://localhost:3000                          │
│                                                                  │
│  • Homepage: Shows featured products + categories               │
│  • Category Pages: Shows products filtered by category          │
│  • Product Pages: Individual product details (TODO)             │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⚠️ **Why Your Mug Isn't Showing:**

### **Issue 1: No Category Selected**
- When you added the "Test Product", the category dropdown was empty
- The product was saved WITHOUT a category link
- Solution: Delete the product and re-add it with a category selected

### **Issue 2: No Categories Created**
- The category dropdown is empty because no categories exist yet
- Solution: Create categories FIRST, then add products

### **Issue 3: Product Status**
- Make sure product status is "Active" (not Draft or Archived)
- Only Active products show on the website

### **Issue 4: Not Marked as Featured**
- To show in "New Arrivals" on homepage, check "Featured Product"
- Otherwise it only shows on its category page

---

## 🎯 **Quick Start Checklist:**

- [ ] **Step 1**: Create your first category
  - Go to `/admin/categories/add`
  - Create "Mugs" category

- [ ] **Step 2**: Delete and re-add your Test Product
  - Go to `/admin/products`
  - Delete the "Test Product"
  - Click "Add Product"
  - Fill in all details
  - **SELECT THE CATEGORY** (Mugs)
  - Upload images
  - Check "Featured Product"
  - Click "Create Product"

- [ ] **Step 3**: View on website
  - Go to homepage: See in "New Arrivals"
  - Go to `/categories/mugs`: See in category page
  - Click on product: (Product detail page needs to be created)

---

## 📊 **Database Relationships:**

```
Category (1) ←→ (Many) ProductCategory (Many) ←→ (1) Product
                         (Junction Table)

Example:
Category: "Mugs" (id: 1)
           ↓
ProductCategory: (productId: 1, categoryId: 1)
           ↓
Product: "Coffee Mug" (id: 1)
```

---

## 🚀 **What's Working Now:**

✅ Admin login page
✅ Admin dashboard with stats
✅ Categories management (add, list, delete)
✅ Products management (add, list, delete)
✅ Orders management (list, update status)
✅ Customers page
✅ Settings page
✅ Homepage fetches real categories and products
✅ Category pages fetch real products from database
✅ Product-Category linking via junction table

---

## 📝 **What Still Needs to Be Done:**

❌ Product detail page (`/products/[slug]`) - Currently dummy data
❌ Edit Product page - To update existing products
❌ Edit Category page - To update existing categories
❌ Order detail page - To view full order information
❌ Shopping cart functionality - Frontend cart system
❌ Checkout process - Payment integration
❌ User authentication - Frontend login/register
❌ Product search page - Search results
❌ Other static pages (About, Contact, etc.) - Still have dummy content

---

## 💡 **Pro Tips:**

1. **Always create categories first** before adding products
2. **Use descriptive slugs** - they become the URL
3. **Upload good quality images** - first image is the main product photo
4. **Set "Featured" flag** to show products on homepage
5. **Use "Compare Price"** to show discounts (e.g., ₹1000 → ₹637 = 36% OFF)
6. **Track inventory** - Enable "Track quantity" to manage stock
7. **Create subcategories** - Select a parent when adding new category

---

## 🔧 **Testing Your Flow:**

### Test 1: Add Category
```
1. Go to /admin/categories/add
2. Name: "Test Category"
3. Submit
4. Go to /admin/categories - Should see it listed
5. Go to / - Should see it in "Shop by Category"
```

### Test 2: Add Product
```
1. Go to /admin/products/add
2. Name: "Test Product 2"
3. Price: 500
4. Category: Select "Test Category"
5. Upload image
6. Check "Featured Product"
7. Submit
8. Go to / - Should see in "New Arrivals"
9. Go to /categories/test-category - Should see it there
```

---

## 📞 **Need Help?**

If products still don't show:
1. Check browser console (F12) for errors
2. Check database in Prisma Studio: `npx prisma studio`
3. Verify product has categoryId linked
4. Verify product status is "ACTIVE"
5. Clear browser cache (Ctrl+Shift+R)
