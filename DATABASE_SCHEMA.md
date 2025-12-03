# PlanetKids - Database Schema Documentation

**Database**: PostgreSQL  
**ORM**: Prisma  
**Date**: November 28, 2025

---

## Schema Overview

This document defines the complete database structure for the PlanetKids e-commerce platform.

---

## Entity Relationship Diagram (Text Format)

```
User (1) ──< (M) Order
User (1) ──< (M) Review
User (1) ──< (M) Address
User (1) ──< (1) Cart
User (1) ──< (M) WishlistItem
User (1) ──< (M) Comparison

Product (M) ──< (M) Category [through ProductCategory]
Product (1) ──< (M) Review
Product (1) ──< (M) OrderItem
Product (1) ──< (M) CartItem
Product (1) ──< (M) WishlistItem
Product (1) ──< (M) ProductImage
Product (1) ──< (M) ProductVariant

Order (1) ──< (M) OrderItem
Order (1) ──< (1) Payment
Order (M) ──< (1) Coupon

Category (1) ──< (M) Category [self-referential]

Cart (1) ──< (M) CartItem
```

---

## Table Definitions

### 1. User Table

Stores customer and admin user information.

```prisma
model User {
  id                String    @id @default(cuid())
  email             String    @unique
  emailVerified     DateTime?
  name              String?
  password          String?   // null for OAuth users
  image             String?   // profile picture URL
  phone             String?   @unique
  role              Role      @default(CUSTOMER)
  
  // OAuth
  accounts          Account[]
  sessions          Session[]
  
  // Relations
  orders            Order[]
  reviews           Review[]
  addresses         Address[]
  cart              Cart?
  wishlistItems     WishlistItem[]
  comparisons       Comparison[]
  
  // Timestamps
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}

enum Role {
  CUSTOMER
  ADMIN
  SUPER_ADMIN
}
```

**Indexes:**
- `email` (unique)
- `phone` (unique)
- `role`

---

### 2. Account Table (NextAuth)

OAuth account connections.

```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}
```

---

### 3. Session Table (NextAuth)

User session management.

```prisma
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

### 4. Category Table

Product categories with hierarchical structure.

```prisma
model Category {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  description String?   @db.Text
  image       String?
  icon        String?   // icon name for UI
  
  // Hierarchy
  parentId    String?
  parent      Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryHierarchy")
  
  // Relations
  products    ProductCategory[]
  
  // Display
  displayOrder Int      @default(0)
  isActive    Boolean  @default(true)
  isFeatured  Boolean  @default(false)
  
  // SEO
  metaTitle       String?
  metaDescription String?
  
  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Indexes:**
- `slug` (unique)
- `parentId`
- `isActive, isFeatured`

---

### 5. Product Table

Core product information.

```prisma
model Product {
  id              String   @id @default(cuid())
  name            String
  slug            String   @unique
  description     String   @db.Text
  shortDescription String? @db.Text
  
  // Pricing
  price           Decimal  @db.Decimal(10, 2)
  compareAtPrice  Decimal? @db.Decimal(10, 2) // original price for discount display
  costPrice       Decimal? @db.Decimal(10, 2) // for profit calculations
  
  // Inventory
  sku             String?  @unique
  barcode         String?  @unique
  trackInventory  Boolean  @default(true)
  quantity        Int      @default(0)
  lowStockThreshold Int    @default(5)
  
  // Product Details
  brand           String?
  weight          Decimal? @db.Decimal(10, 2) // in kg
  dimensions      String?  // e.g., "10x20x5 cm"
  ageGroup        AgeGroup?
  
  // Flags
  isActive        Boolean  @default(true)
  isFeatured      Boolean  @default(false)
  isNewArrival    Boolean  @default(false)
  isTrending      Boolean  @default(false)
  isOnSale        Boolean  @default(false)
  
  // Stats
  viewCount       Int      @default(0)
  salesCount      Int      @default(0)
  averageRating   Decimal? @db.Decimal(3, 2)
  reviewCount     Int      @default(0)
  
  // SEO
  metaTitle       String?
  metaDescription String?
  metaKeywords    String?
  
  // Relations
  categories      ProductCategory[]
  images          ProductImage[]
  variants        ProductVariant[]
  reviews         Review[]
  orderItems      OrderItem[]
  cartItems       CartItem[]
  wishlistItems   WishlistItem[]
  comparisons     Comparison[]
  
  // Timestamps
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  publishedAt     DateTime?
}

enum AgeGroup {
  ZERO_TO_ONE      // 0-1 years
  ONE_TO_TWO       // 1-2 years
  TWO_TO_FOUR      // 2-4 years
  FOUR_TO_SIX      // 4-6 years
  SIX_TO_EIGHT     // 6-8 years
  EIGHT_PLUS       // 8+ years
}
```

**Indexes:**
- `slug` (unique)
- `sku` (unique)
- `isActive, isFeatured, isNewArrival, isTrending`
- `price`
- `ageGroup`
- `createdAt` (for new arrivals)
- `salesCount` (for trending)

---

### 6. ProductCategory Table (Junction)

Many-to-many relationship between products and categories.

```prisma
model ProductCategory {
  id         String   @id @default(cuid())
  productId  String
  categoryId String
  
  product    Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  category   Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  
  createdAt  DateTime @default(now())
  
  @@unique([productId, categoryId])
}
```

---

### 7. ProductImage Table

Product images with ordering.

```prisma
model ProductImage {
  id        String   @id @default(cuid())
  productId String
  url       String
  altText   String?
  isPrimary Boolean  @default(false)
  order     Int      @default(0)
  
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
}
```

**Indexes:**
- `productId`
- `isPrimary`

---

### 8. ProductVariant Table

Product variants (size, color, etc.).

```prisma
model ProductVariant {
  id        String   @id @default(cuid())
  productId String
  name      String   // e.g., "Small", "Blue", "Set of 2"
  value     String
  price     Decimal? @db.Decimal(10, 2) // price adjustment
  sku       String?  @unique
  quantity  Int      @default(0)
  isActive  Boolean  @default(true)
  
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

### 9. Cart Table

Shopping cart (one per user).

```prisma
model Cart {
  id        String     @id @default(cuid())
  userId    String     @unique
  
  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  items     CartItem[]
  
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}
```

---

### 10. CartItem Table

Items in shopping cart.

```prisma
model CartItem {
  id        String   @id @default(cuid())
  cartId    String
  productId String
  quantity  Int      @default(1)
  variantId String?  // if product has variants
  
  cart      Cart     @relation(fields: [cartId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@unique([cartId, productId, variantId])
}
```

---

### 11. Order Table

Customer orders.

```prisma
model Order {
  id              String      @id @default(cuid())
  orderNumber     String      @unique // e.g., "PK20251128001"
  userId          String
  
  // Order Details
  status          OrderStatus @default(PENDING)
  paymentStatus   PaymentStatus @default(PENDING)
  paymentMethod   PaymentMethod
  
  // Amounts
  subtotal        Decimal     @db.Decimal(10, 2)
  discount        Decimal     @default(0) @db.Decimal(10, 2)
  shippingCost    Decimal     @default(0) @db.Decimal(10, 2)
  codCharge       Decimal     @default(0) @db.Decimal(10, 2)
  tax             Decimal     @default(0) @db.Decimal(10, 2)
  total           Decimal     @db.Decimal(10, 2)
  
  // Coupon
  couponId        String?
  couponCode      String?
  couponDiscount  Decimal     @default(0) @db.Decimal(10, 2)
  
  // Shipping Address
  shippingName    String
  shippingEmail   String
  shippingPhone   String
  shippingAddress String
  shippingCity    String
  shippingState   String
  shippingPincode String
  shippingCountry String      @default("India")
  
  // Billing Address (can be same as shipping)
  billingName     String?
  billingAddress  String?
  billingCity     String?
  billingState    String?
  billingPincode  String?
  billingCountry  String?     @default("India")
  
  // Tracking
  trackingNumber  String?
  carrier         String?
  
  // Notes
  customerNote    String?     @db.Text
  adminNote       String?     @db.Text
  
  // Relations
  user            User        @relation(fields: [userId], references: [id])
  items           OrderItem[]
  payment         Payment?
  coupon          Coupon?     @relation(fields: [couponId], references: [id])
  
  // Timestamps
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  shippedAt       DateTime?
  deliveredAt     DateTime?
  cancelledAt     DateTime?
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}

enum PaymentMethod {
  COD
  PREPAID
  CUSTOM_GATEWAY
}
```

**Indexes:**
- `orderNumber` (unique)
- `userId`
- `status`
- `paymentStatus`
- `createdAt`

---

### 12. OrderItem Table

Items in an order.

```prisma
model OrderItem {
  id          String   @id @default(cuid())
  orderId     String
  productId   String
  
  // Snapshot data (in case product changes later)
  productName String
  productSlug String
  productImage String?
  variantName String?
  variantValue String?
  
  quantity    Int
  price       Decimal  @db.Decimal(10, 2) // price at time of purchase
  subtotal    Decimal  @db.Decimal(10, 2)
  
  order       Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product     Product  @relation(fields: [productId], references: [id])
  
  createdAt   DateTime @default(now())
}
```

---

### 13. Payment Table

Payment transaction records.

```prisma
model Payment {
  id              String        @id @default(cuid())
  orderId         String        @unique
  
  amount          Decimal       @db.Decimal(10, 2)
  currency        String        @default("INR")
  status          PaymentStatus
  method          PaymentMethod
  
  // Gateway specific
  gatewayOrderId  String?       // from payment gateway
  gatewayPaymentId String?
  gatewaySignature String?
  
  // Transaction details
  transactionId   String?
  transactionDate DateTime?
  
  // Metadata
  metadata        Json?         // store additional gateway data
  
  order           Order         @relation(fields: [orderId], references: [id])
  
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}
```

---

### 14. Address Table

Saved user addresses.

```prisma
model Address {
  id        String   @id @default(cuid())
  userId    String
  
  name      String
  phone     String
  address   String
  city      String
  state     String
  pincode   String
  country   String   @default("India")
  
  isDefault Boolean  @default(false)
  type      AddressType @default(HOME)
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum AddressType {
  HOME
  WORK
  OTHER
}
```

**Indexes:**
- `userId`
- `isDefault`

---

### 15. Review Table

Product reviews and ratings.

```prisma
model Review {
  id          String   @id @default(cuid())
  userId      String
  productId   String
  
  rating      Int      // 1-5
  title       String?
  comment     String   @db.Text
  images      String[] // array of image URLs
  
  isVerifiedPurchase Boolean @default(false)
  isApproved  Boolean  @default(false) // admin moderation
  
  // Helpful votes
  helpfulCount Int     @default(0)
  
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@unique([userId, productId]) // one review per user per product
}
```

**Indexes:**
- `productId`
- `rating`
- `isApproved`
- `createdAt`

---

### 16. WishlistItem Table

User wishlist.

```prisma
model WishlistItem {
  id        String   @id @default(cuid())
  userId    String
  productId String
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  
  @@unique([userId, productId])
}
```

---

### 17. Comparison Table

Product comparison feature.

```prisma
model Comparison {
  id        String   @id @default(cuid())
  userId    String
  productId String
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  
  @@unique([userId, productId])
}
```

---

### 18. Coupon Table

Discount coupons.

```prisma
model Coupon {
  id              String       @id @default(cuid())
  code            String       @unique
  description     String?
  
  // Discount
  discountType    DiscountType
  discountValue   Decimal      @db.Decimal(10, 2)
  maxDiscount     Decimal?     @db.Decimal(10, 2) // for percentage discounts
  
  // Conditions
  minOrderValue   Decimal?     @db.Decimal(10, 2)
  maxUses         Int?         // total uses allowed
  usesPerUser     Int?         @default(1)
  currentUses     Int          @default(0)
  
  // Validity
  startDate       DateTime
  endDate         DateTime
  isActive        Boolean      @default(true)
  
  // Applicable to
  applicableCategories String[] // category IDs
  applicableProducts   String[] // product IDs
  
  orders          Order[]
  
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
}

enum DiscountType {
  PERCENTAGE
  FIXED_AMOUNT
  FREE_SHIPPING
}
```

**Indexes:**
- `code` (unique)
- `isActive`
- `startDate, endDate`

---

### 19. Newsletter Table

Newsletter subscriptions.

```prisma
model Newsletter {
  id          String   @id @default(cuid())
  email       String   @unique
  isSubscribed Boolean @default(true)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

### 20. Banner Table

Homepage promotional banners.

```prisma
model Banner {
  id          String   @id @default(cuid())
  title       String
  description String?
  image       String
  mobileImage String?  // separate image for mobile
  
  link        String?  // CTA link
  linkText    String?  // CTA button text
  
  displayOrder Int     @default(0)
  isActive    Boolean  @default(true)
  
  startDate   DateTime?
  endDate     DateTime?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

### 21. SiteSettings Table

Global site configuration.

```prisma
model SiteSettings {
  id    String @id @default(cuid())
  key   String @unique
  value String @db.Text
  type  String @default("string") // string, number, boolean, json
  
  updatedAt DateTime @updatedAt
}
```

**Example settings:**
- `siteName`
- `siteDescription`
- `contactEmail`
- `contactPhone`
- `shippingCost`
- `codCharge`
- `freeShippingThreshold`
- `prepaidDiscount`
- `socialLinks` (JSON)

---

## Indexes Summary

**Performance-critical indexes:**
1. All foreign keys (automatic in Prisma)
2. Unique constraints on slug fields
3. Composite indexes for filtering (category + price + ageGroup)
4. Order status and date indexes for admin queries
5. Product active status and featured flags

---

## Sample Queries

### Get products with filters

```prisma
// Products in category, filtered by price and age
const products = await prisma.product.findMany({
  where: {
    categories: {
      some: {
        categoryId: categoryId
      }
    },
    price: {
      gte: minPrice,
      lte: maxPrice
    },
    ageGroup: selectedAgeGroup,
    isActive: true
  },
  include: {
    images: {
      where: { isPrimary: true }
    },
    categories: {
      include: {
        category: true
      }
    }
  },
  orderBy: {
    createdAt: 'desc'
  }
});
```

### Get order with all details

```prisma
const order = await prisma.order.findUnique({
  where: { id: orderId },
  include: {
    items: {
      include: {
        product: {
          include: {
            images: {
              where: { isPrimary: true }
            }
          }
        }
      }
    },
    payment: true,
    user: {
      select: {
        name: true,
        email: true,
        phone: true
      }
    }
  }
});
```

---

## Migration Strategy

1. **Initial Setup**: Create all tables with basic structure
2. **Seed Data**: Populate categories, sample products, test users
3. **Indexing**: Add performance indexes after initial data load
4. **Testing**: Run query performance tests
5. **Optimization**: Add additional indexes based on query patterns

---

## Backup & Maintenance

- **Daily backups** of production database
- **Weekly full backups** stored off-site
- **Transaction logs** for point-in-time recovery
- **Monthly vacuum** and analyze operations
- **Quarterly** index maintenance

---

**End of Database Schema Documentation**
