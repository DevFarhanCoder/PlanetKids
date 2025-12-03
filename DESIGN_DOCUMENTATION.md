# PlanetKids E-Commerce Platform - Design Documentation

**Project**: PlanetKids Online Store  
**Tech Stack**: Next.js 14+ (App Router) + PostgreSQL + Prisma ORM  
**Date**: November 28, 2025

---

## 1. Brand Identity & Design Philosophy

### Brand: PlanetKids
- **Tagline**: "Explore, Learn, and Play - Your Child's Universe"
- **Mission**: Create a modern, trustworthy, and delightful shopping experience for parents looking for quality kids' products

### Design Principles
1. **Clean & Spacious**: Generous whitespace, clear typography, uncluttered layouts
2. **Playful but Professional**: Fun elements without sacrificing credibility
3. **Mobile-First**: Seamless experience across all devices
4. **Trust-Building**: Clear policies, visible reviews, secure checkout indicators
5. **Discovery-Focused**: Easy browsing through multiple filter combinations

---

## 2. Color Scheme & Visual Identity

### Primary Color Palette
- **Primary Brand**: `#6C63FF` (Vibrant Purple) - Modern, energetic, distinct from competitors
- **Secondary**: `#FF6B9D` (Coral Pink) - Playful, warm, kid-friendly
- **Accent**: `#FFB800` (Sunny Yellow) - Highlights, sale badges, CTAs
- **Success**: `#00D9A3` (Mint Green) - Confirmations, positive actions
- **Neutral Dark**: `#2D3748` (Charcoal) - Text, headings
- **Neutral Light**: `#F7FAFC` (Off-White) - Backgrounds, sections
- **White**: `#FFFFFF` - Cards, modals, clean surfaces

### Typography
- **Headings**: Inter (Bold, Semi-Bold) - Modern, clean, highly readable
- **Body**: Inter (Regular, Medium) - Consistent with headings
- **Accent/Fun**: Nunito (for playful elements) - Rounded, friendly

### Visual Elements
- **Rounded corners**: 8px-16px radius for cards and buttons
- **Shadows**: Subtle elevation (0 4px 6px rgba(0,0,0,0.1))
- **Icons**: Lucide React or Heroicons - consistent line weight
- **Illustrations**: Custom SVG spot illustrations for empty states, onboarding

---

## 3. Layout Structure & Page Breakdown

### 3.1 Homepage Layout

```
┌─────────────────────────────────────────────┐
│         HEADER / NAVIGATION BAR             │
│  [Logo] [Categories▾] [Search] [Cart][User]│
├─────────────────────────────────────────────┤
│           PROMOTIONAL BANNER                │
│  "Extra 10% OFF on Prepaid | Free Shipping" │
├─────────────────────────────────────────────┤
│              HERO SECTION                   │
│  [Large Banner Image + CTA] [Carousel]      │
├─────────────────────────────────────────────┤
│         SHOP BY CATEGORY (Grid)             │
│  [🎨 Toys] [📚 Learning] [🎒 Bags] [✏️ Stationery]│
│  [👶 Baby] [🎁 Hampers] [🏫 School] [🎭 Art&Craft]│
├─────────────────────────────────────────────┤
│            NEW ARRIVALS                     │
│  [Product Grid - 8 items] [View All →]     │
├─────────────────────────────────────────────┤
│          TRENDING PRODUCTS                  │
│  [Product Grid - 8 items] [View All →]     │
├─────────────────────────────────────────────┤
│           SHOP BY AGE GROUP                 │
│  [0-1yrs] [1-2yrs] [2-4yrs] [4-6yrs]       │
│  [6-8yrs] [8+yrs]                           │
├─────────────────────────────────────────────┤
│         PROMOTIONAL SECTION                 │
│  [Sale Banner] [Bundle Deals] [Gift Ideas]  │
├─────────────────────────────────────────────┤
│          SHOP BY PRICE RANGE                │
│  [Under ₹199] [Under ₹399] [Under ₹699]    │
│  [Under ₹999] [Under ₹1499] [₹1500+]       │
├─────────────────────────────────────────────┤
│        CUSTOMER TESTIMONIALS                │
│  [Review Cards Carousel]                    │
├─────────────────────────────────────────────┤
│          WHY SHOP WITH US?                  │
│  [✓ Free Shipping] [✓ Easy Returns]        │
│  [✓ Secure Payments] [✓ Quality Assured]   │
├─────────────────────────────────────────────┤
│         NEWSLETTER SIGNUP                   │
│  "Join 100k+ parents" [Email Input] [CTA]  │
├─────────────────────────────────────────────┤
│              FOOTER                         │
│  [Links] [Contact] [Social] [Policies]     │
└─────────────────────────────────────────────┘
```

### 3.2 Navigation Bar (Sticky Header)

**Desktop Layout:**
```
┌────────────────────────────────────────────────────────────┐
│ [🌍 PlanetKids Logo]  [Categories ▾]  [🔍 Search Products...] │
│                                        [💝 Wishlist (3)]    │
│                                        [🛒 Cart (2)]        │
│                                        [👤 Account ▾]       │
└────────────────────────────────────────────────────────────┘
│ [All] [Toys & Games] [Learning Kits] [School Essentials]   │
│ [Bags] [Stationery] [Baby] [Hampers] [Art & Craft] [Sale]  │
└────────────────────────────────────────────────────────────┘
```

**Mobile Layout:**
```
┌──────────────────────────────────┐
│ [☰]  [PlanetKids]  [🔍] [🛒] [👤]│
└──────────────────────────────────┘
```

### 3.3 Product Listing Page (Category/Collection)

```
┌─────────────────────────────────────────────┐
│         BREADCRUMB                          │
│  Home > Toys & Games > Educational Toys     │
├──────────────┬──────────────────────────────┤
│   FILTERS    │   PRODUCTS GRID              │
│   SIDEBAR    │                              │
│              │   [Sort By: ▾] [24 Items]   │
│ Categories   │                              │
│ ☐ Category1  │   ┌────┬────┬────┬────┐      │
│ ☐ Category2  │   │Prd1│Prd2│Prd3│Prd4│      │
│              │   └────┴────┴────┴────┘      │
│ Price Range  │   ┌────┬────┬────┬────┐      │
│ ₹0 ━━●━━ ₹5k │   │Prd5│Prd6│Prd7│Prd8│      │
│              │   └────┴────┴────┴────┘      │
│ Age Group    │                              │
│ ☐ 0-1 years  │   [Load More Products]       │
│ ☐ 1-2 years  │                              │
│ ☐ 2-4 years  │                              │
│              │                              │
│ Rating       │                              │
│ ☐ 4★ & above │                              │
│ ☐ 3★ & above │                              │
│              │                              │
│ [Clear All]  │                              │
└──────────────┴──────────────────────────────┘
```

### 3.4 Product Detail Page

```
┌─────────────────────────────────────────────┐
│         BREADCRUMB                          │
│  Home > Toys > Educational > Product Name   │
├──────────────────┬──────────────────────────┤
│  IMAGE GALLERY   │   PRODUCT INFO           │
│                  │                          │
│  ┌────────────┐  │  Product Name            │
│  │            │  │  ⭐⭐⭐⭐⭐ (124 reviews)   │
│  │   MAIN     │  │                          │
│  │   IMAGE    │  │  ₹2,699  ₹3,499 (23% OFF)│
│  │            │  │  [Sale Badge]            │
│  └────────────┘  │                          │
│  [○][○][○][○]   │  • Age: 3-6 years        │
│   Thumbnails     │  • In Stock (12 left)    │
│                  │  • Free Shipping         │
│  [🔍 Zoom]       │                          │
│                  │  Quantity: [-] 1 [+]     │
│                  │                          │
│                  │  [💝 Add to Wishlist]    │
│                  │  [🛒 Add to Cart]        │
│                  │  [⚡ Buy Now]            │
│                  │                          │
│                  │  🚚 Delivery: 3-5 days   │
│                  │  💰 COD Available (₹60)  │
│                  │  🔄 Easy Returns         │
├──────────────────┴──────────────────────────┤
│  [Description] [Specifications] [Reviews]  │
│                                             │
│  Detailed product description...            │
│  Features, materials, safety info...        │
├─────────────────────────────────────────────┤
│     CUSTOMER REVIEWS & RATINGS              │
│  ⭐ 4.8/5  (124 reviews)                    │
│  [Review Cards...]                          │
├─────────────────────────────────────────────┤
│     SIMILAR PRODUCTS                        │
│  [Product Grid...]                          │
└─────────────────────────────────────────────┘
```

### 3.5 Shopping Cart Page

```
┌─────────────────────────────────────────────┐
│           SHOPPING CART (3 items)           │
├─────────────────────────┬───────────────────┤
│   CART ITEMS            │   ORDER SUMMARY   │
│                         │                   │
│ ┌─────────────────────┐ │  Subtotal: ₹6,997│
│ │[Img] Product 1      │ │  Discount: -₹1,200│
│ │ ₹2,699  [-] 1 [+]   │ │  Shipping: FREE   │
│ │ [Remove] [Wishlist] │ │  COD Charge: ₹60  │
│ └─────────────────────┘ │  ─────────────────│
│ ┌─────────────────────┐ │  Total:   ₹5,857 │
│ │[Img] Product 2      │ │                   │
│ │ ₹1,599  [-] 2 [+]   │ │  [Apply Coupon]   │
│ │ [Remove] [Wishlist] │ │  [___________][✓] │
│ └─────────────────────┘ │                   │
│                         │  ☑ Prepaid (Save  │
│ [← Continue Shopping]   │     ₹60 + Get 5%  │
│                         │     Extra OFF)    │
│                         │                   │
│                         │  [Proceed to      │
│                         │   Checkout →]     │
└─────────────────────────┴───────────────────┘
```

### 3.6 User Account Dashboard

```
┌─────────────────────────────────────────────┐
│         MY ACCOUNT                          │
├──────────────┬──────────────────────────────┤
│  SIDEBAR     │   CONTENT AREA               │
│              │                              │
│ • Dashboard  │   Welcome, Rizwan!           │
│ • Orders     │                              │
│ • Wishlist   │   [Recent Orders]            │
│ • Profile    │   [Saved Addresses]          │
│ • Addresses  │   [Quick Actions]            │
│ • Reviews    │                              │
│ • Logout     │                              │
└──────────────┴──────────────────────────────┘
```

### 3.7 Admin Panel Layout

```
┌─────────────────────────────────────────────┐
│  [🌍 PlanetKids Admin]         [👤 Admin ▾] │
├──────────────┬──────────────────────────────┤
│  SIDEBAR     │   DASHBOARD                  │
│              │                              │
│ 📊 Dashboard │   [Stats Cards]              │
│ 📦 Products  │   • Total Sales              │
│ 📂 Categories│   • Orders Today             │
│ 🛍️ Orders    │   • Total Products           │
│ 👥 Customers │   • Active Users             │
│ 💬 Reviews   │                              │
│ 🎯 Marketing │   [Charts & Analytics]       │
│ ⚙️ Settings  │   [Recent Orders Table]      │
│              │   [Low Stock Alerts]         │
└──────────────┴──────────────────────────────┘
```

---

## 4. Component Breakdown

### 4.1 Core Components

#### Navigation Components
- `Navbar` - Main navigation with search, cart, user menu
- `MegaMenu` - Category dropdown with subcategories
- `MobileMenu` - Hamburger menu for mobile
- `SearchBar` - Autocomplete search with suggestions
- `CategoryNav` - Secondary navigation bar with category links

#### Product Components
- `ProductCard` - Reusable product display with image, price, rating, quick actions
- `ProductGrid` - Responsive grid layout for product listings
- `ProductCarousel` - Horizontal scrolling product showcase
- `ProductImageGallery` - Image viewer with zoom and thumbnails
- `ProductInfo` - Price, stock, specifications display
- `AddToCartButton` - Add to cart with quantity selector
- `QuickView` - Modal for quick product preview

#### Filter Components
- `FilterSidebar` - Complete filtering interface
- `PriceRangeSlider` - Dual-handle price filter
- `CategoryFilter` - Collapsible category tree
- `AgeGroupFilter` - Age range selection
- `RatingFilter` - Star rating filter
- `ActiveFilters` - Display active filters with remove option
- `SortDropdown` - Product sorting options

#### Cart & Checkout Components
- `CartDrawer` - Slide-out cart panel
- `CartItem` - Individual cart item with controls
- `OrderSummary` - Price breakdown and totals
- `CheckoutForm` - Multi-step checkout flow
- `AddressForm` - Shipping address input
- `PaymentSelector` - Payment method selection

#### User Components
- `UserMenu` - Account dropdown
- `LoginModal` - Sign in/register modal
- `UserDashboard` - Account overview
- `OrderCard` - Order history item
- `WishlistGrid` - Saved products display

#### Review Components
- `ReviewCard` - Individual review display
- `RatingStars` - Star rating display/input
- `ReviewForm` - Write review interface
- `ReviewSummary` - Aggregate rating breakdown

#### UI Components
- `Button` - Primary, secondary, outline variants
- `Badge` - Sale, new, trending indicators
- `Card` - Container with shadow and border
- `Modal` - Overlay dialog
- `Toast` - Notification messages
- `Breadcrumb` - Navigation path
- `Pagination` - Page navigation
- `Skeleton` - Loading placeholders
- `EmptyState` - No results display

### 4.2 Admin Components

- `AdminLayout` - Admin dashboard shell
- `Sidebar` - Admin navigation
- `StatsCard` - Metric display cards
- `DataTable` - Sortable, filterable tables
- `ProductForm` - Add/edit product
- `OrderManagement` - Order processing interface
- `CustomerList` - Customer management
- `AnalyticsDashboard` - Charts and reports

---

## 5. Key Features & Functionality

### 5.1 User-Facing Features

#### Homepage
- Dynamic promotional banners with countdown timers
- Featured categories with custom imagery
- New arrivals section (auto-updated based on product creation date)
- Trending products (based on views/sales)
- Shop by age groups
- Shop by price ranges
- Customer testimonials carousel
- Newsletter subscription

#### Product Browsing
- **Multiple Filter Options:**
  - By category and subcategory
  - By price range (slider + preset ranges)
  - By age group (0-1, 1-2, 2-4, 4-6, 6-8, 8+)
  - By rating (4★+, 3★+)
  - By availability (in stock/out of stock)
  - By discount percentage
- **Sorting Options:**
  - Price: Low to High
  - Price: High to Low
  - Newest First
  - Best Rated
  - Most Popular
- Infinite scroll or pagination
- Grid/List view toggle
- Quick view modal

#### Product Detail
- Image gallery with zoom functionality
- Product variants (size, color if applicable)
- Stock availability indicator
- Add to cart / Buy now (direct checkout)
- Add to wishlist
- Share product (social media)
- Size guide / Age recommendation
- Delivery estimates based on pincode
- Similar products recommendations
- Recently viewed products
- Customer reviews with images
- Q&A section

#### Shopping Cart
- Add/remove/update quantities
- Save for later / Move to wishlist
- Apply coupon codes
- Real-time price calculation
- Prepaid discount highlight
- COD charges notification
- Free shipping threshold indicator
- Cart persistence (logged in users)

#### Checkout
- Guest checkout option
- Saved addresses selection
- New address form with pincode validation
- Multiple payment methods:
  - Custom payment gateway integration
  - Cash on Delivery (COD)
- Order summary review
- Terms & conditions acceptance
- Order confirmation page
- Email confirmation

#### User Account
- Profile management
- Order history with tracking
- Order details and invoice download
- Saved addresses (add/edit/delete/set default)
- Wishlist management
- Product reviews (write/edit)
- Account settings
- Password change

#### Additional Features
- **Wishlist:**
  - Add/remove products
  - Move to cart
  - Share wishlist
  - Out of stock notifications
  
- **Product Comparison:**
  - Compare up to 4 products
  - Side-by-side specifications
  - Price comparison
  
- **Reviews & Ratings:**
  - 5-star rating system
  - Text reviews with images
  - Verified purchase badge
  - Helpful vote system
  - Review moderation
  
- **Email Notifications:**
  - Order confirmation
  - Shipping updates
  - Delivery notification
  - Abandoned cart recovery
  - Back-in-stock alerts
  - Newsletter

### 5.2 Admin Panel Features

#### Dashboard
- Sales overview (today, week, month)
- Order statistics
- Revenue charts
- Top-selling products
- Low stock alerts
- Recent orders
- Customer growth metrics

#### Product Management
- Add/edit/delete products
- Bulk product upload (CSV)
- Product variants management
- Inventory tracking
- Image upload and management
- SEO fields (meta title, description)
- Product scheduling (publish date)
- Featured/trending flags

#### Category Management
- Create/edit/delete categories
- Nested subcategories
- Category images
- Display order management
- Category-specific filters

#### Order Management
- Order listing with filters
- Order status updates
- Invoice generation
- Shipping label printing
- Order notes
- Refund processing
- Order analytics

#### Customer Management
- Customer listing
- Customer details view
- Order history per customer
- Customer segments
- Email communication

#### Review Management
- Approve/reject reviews
- Respond to reviews
- Flag inappropriate content
- Review analytics

#### Marketing Tools
- Coupon code creation
- Discount management
- Sale event scheduling
- Banner management
- Email campaign triggers

#### Settings
- Store information
- Payment gateway configuration
- Shipping zones and rates
- Tax configuration
- Email templates
- User roles and permissions

---

## 6. Technical Architecture

### 6.1 Tech Stack Details

**Frontend:**
- Next.js 14+ (App Router)
- React 18+
- TypeScript
- Tailwind CSS
- Shadcn/ui components
- Framer Motion (animations)
- React Hook Form + Zod validation
- TanStack Query (data fetching)
- Zustand (state management)

**Backend:**
- Next.js API Routes
- NextAuth.js (authentication)
- Prisma ORM
- PostgreSQL database

**Additional Services:**
- Cloudinary/S3 (image storage)
- Resend/Nodemailer (email)
- Custom payment gateway integration

### 6.2 Folder Structure

```
planetkids/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (shop)/
│   │   │   ├── page.tsx (homepage)
│   │   │   ├── products/
│   │   │   ├── categories/
│   │   │   ├── cart/
│   │   │   └── checkout/
│   │   ├── account/
│   │   │   ├── dashboard/
│   │   │   ├── orders/
│   │   │   ├── wishlist/
│   │   │   └── profile/
│   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   ├── products/
│   │   │   ├── orders/
│   │   │   └── customers/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── products/
│   │   │   ├── orders/
│   │   │   └── payments/
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/ (shadcn components)
│   │   ├── layout/
│   │   ├── products/
│   │   ├── cart/
│   │   ├── filters/
│   │   └── admin/
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   ├── utils.ts
│   │   └── validations/
│   ├── hooks/
│   ├── stores/
│   └── types/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
│   ├── images/
│   └── icons/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

---

## 7. UX/UI Enhancements

### 7.1 Distinguishing Features from Cots and Cuddles

**1. Modern Color Scheme:**
- Purple/pink gradient theme vs their pastel colors
- More vibrant and energetic feel

**2. Enhanced Navigation:**
- Sticky mega-menu with category images
- Persistent search bar with autocomplete
- Visual breadcrumbs with icons

**3. Superior Product Discovery:**
- Advanced filter combinations
- Product comparison tool
- Visual filter tags
- Smart search suggestions

**4. Interactive Elements:**
- Smooth page transitions
- Micro-animations on hover
- Loading skeletons
- Toast notifications

**5. Trust Builders:**
- Prominent security badges
- Real-time stock updates
- Delivery date estimator
- Customer photo reviews
- Verified purchase badges

**6. Better Mobile Experience:**
- Bottom navigation bar
- Swipeable product images
- Sticky add-to-cart
- Mobile-optimized filters

**7. Personalization:**
- Recently viewed products
- Recommended for you section
- Abandoned cart recovery
- Personalized email campaigns

### 7.2 Performance Optimizations

- Image optimization with Next.js Image
- Lazy loading below-the-fold content
- Code splitting and dynamic imports
- Server-side rendering for SEO
- Static generation for category pages
- Edge caching for product listings
- Progressive Web App (PWA) support

### 7.3 Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- High contrast mode
- Focus indicators
- Alt text for all images
- Aria labels

---

## 8. Database Schema Overview

*(Detailed schema in separate DATABASE_SCHEMA.md file)*

**Core Tables:**
- Users
- Products
- Categories
- Orders
- OrderItems
- Cart
- CartItems
- Wishlist
- Reviews
- Addresses
- Coupons
- PaymentTransactions

**Relationships:**
- One-to-Many: User → Orders, Product → Reviews
- Many-to-Many: Products ↔ Categories
- One-to-One: User → Cart

---

## 9. SEO Strategy

- Dynamic meta tags per page
- Open Graph tags for social sharing
- JSON-LD structured data
- XML sitemap generation
- Robots.txt configuration
- Canonical URLs
- Breadcrumb markup
- Product schema markup
- Review schema markup

---

## 10. Success Metrics & Analytics

**Key Metrics to Track:**
- Conversion rate
- Average order value
- Cart abandonment rate
- Product page views
- Search queries
- Filter usage patterns
- Page load times
- Mobile vs desktop traffic
- Customer lifetime value
- Return customer rate

**Tools Integration:**
- Google Analytics 4
- Google Tag Manager
- Facebook Pixel
- Hotjar (heatmaps)

---

## 11. Future Enhancements (Phase 2)

- Multi-language support
- Multi-currency support
- Live chat integration
- AR product preview
- Subscription boxes
- Loyalty rewards program
- Gift registry
- Affiliate program
- Mobile app (React Native)
- Voice search
- AI-powered recommendations
- Inventory management system
- Vendor marketplace

---

## 12. Development Timeline

**Phase 1: Foundation (Weeks 1-2)**
- Project setup
- Database design
- Authentication
- Basic layouts

**Phase 2: Core Features (Weeks 3-4)**
- Product catalog
- Category pages
- Product details
- Search & filters

**Phase 3: E-commerce (Weeks 5-6)**
- Cart functionality
- Checkout flow
- Payment integration
- Order management

**Phase 4: User Features (Week 7)**
- User dashboard
- Wishlist
- Reviews
- Comparison

**Phase 5: Admin Panel (Week 8)**
- Admin dashboard
- Product management
- Order processing
- Analytics

**Phase 6: Polish & Launch (Week 9-10)**
- Testing
- Performance optimization
- SEO setup
- Deployment
- Documentation

---

## 13. Security Considerations

- HTTPS enforcement
- CSRF protection
- XSS prevention
- SQL injection prevention (Prisma ORM)
- Rate limiting on API routes
- Secure session management
- Password hashing (bcrypt)
- Input validation and sanitization
- PCI DSS compliance for payments
- Regular security audits
- Environment variable protection
- Content Security Policy headers

---

## 14. Policy Pages Content Structure

**Shipping Policy:**
- Delivery timelines
- Shipping charges
- Order tracking
- International shipping (if applicable)

**Return & Refund Policy:**
- Return window (7/14/30 days)
- Return conditions
- Refund process
- Exchange policy

**Privacy Policy:**
- Data collection
- Data usage
- Cookie policy
- Third-party services
- User rights

**Terms & Conditions:**
- User agreement
- Product listings
- Pricing policy
- Limitation of liability

**Contact Us:**
- Email
- Phone
- Address
- Business hours
- Contact form

---

**End of Design Documentation**

This document serves as the comprehensive blueprint for the PlanetKids e-commerce platform. Refer to separate technical documentation files for detailed API specifications, database schema, and component API references.
