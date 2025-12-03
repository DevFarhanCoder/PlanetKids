# Component Development Guide

## 🎨 Component Structure Template

Use this template when creating new components for consistency.

---

## Basic Component Template

```typescript
// components/[category]/ComponentName.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface ComponentNameProps {
  className?: string;
  // Add other props
}

export function ComponentName({ className, ...props }: ComponentNameProps) {
  return (
    <div className={cn('base-classes', className)}>
      {/* Component content */}
    </div>
  );
}
```

---

## Component Categories

### Layout Components (components/layout/)
- `Navbar.tsx` - Main navigation
- `Footer.tsx` - Site footer
- `Sidebar.tsx` - Sidebar navigation
- `Container.tsx` - Content container

### Product Components (components/products/)
- `ProductCard.tsx` - Product display card
- `ProductGrid.tsx` - Product grid layout
- `ProductCarousel.tsx` - Product carousel
- `ProductFilter.tsx` - Filtering interface
- `ProductSort.tsx` - Sorting dropdown

### UI Components (components/ui/)
- `Button.tsx` - Button component
- `Input.tsx` - Input field
- `Modal.tsx` - Modal dialog
- `Toast.tsx` - Notification
- `Badge.tsx` - Badge component
- `Card.tsx` - Card container

### Cart Components (components/cart/)
- `CartItem.tsx` - Cart item display
- `CartDrawer.tsx` - Slide-out cart
- `CartSummary.tsx` - Order summary

---

## Example: Button Component

```typescript
// components/ui/Button.tsx
import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary hover:bg-primary-600 text-white shadow-md hover:shadow-lg',
    secondary: 'bg-secondary hover:bg-secondary-600 text-white shadow-md hover:shadow-lg',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    ghost: 'hover:bg-gray-100 text-gray-700',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  
  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : children}
    </button>
  );
}
```

---

## Example: Product Card Component

```typescript
// components/products/ProductCard.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { cn, formatPrice, calculateDiscount } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  isOnSale?: boolean;
  className?: string;
}

export function ProductCard({
  id,
  name,
  slug,
  price,
  compareAtPrice,
  image,
  rating,
  reviewCount,
  isNew,
  isOnSale,
  className,
}: ProductCardProps) {
  const discount = compareAtPrice ? calculateDiscount(price, compareAtPrice) : 0;
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    // Add to cart logic
    console.log('Add to cart:', id);
  };
  
  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    // Add to wishlist logic
    console.log('Add to wishlist:', id);
  };
  
  return (
    <Link href={`/products/${slug}`} className={cn('product-card group', className)}>
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {isNew && <span className="badge-new">NEW</span>}
          {isOnSale && discount > 0 && (
            <span className="badge-sale">{discount}% OFF</span>
          )}
        </div>
        
        {/* Wishlist Button */}
        <button
          onClick={handleAddToWishlist}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
          aria-label="Add to wishlist"
        >
          <Heart className="w-5 h-5 text-red-500" />
        </button>
        
        {/* Quick Add to Cart */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            onClick={handleAddToCart}
            variant="primary"
            size="sm"
            className="w-full"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {name}
        </h3>
        
        {/* Rating */}
        {rating && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
                  ★
                </span>
              ))}
            </div>
            {reviewCount && (
              <span className="text-sm text-gray-500">({reviewCount})</span>
            )}
          </div>
        )}
        
        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">
            {formatPrice(price)}
          </span>
          {compareAtPrice && compareAtPrice > price && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
```

---

## Example: Navbar Component

```typescript
// components/layout/Navbar.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, Heart, User, Menu, X } from 'lucide-react';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const categories = [
    { name: 'Toys & Games', href: '/categories/toys-games' },
    { name: 'Learning Kits', href: '/categories/learning-kits' },
    { name: 'School Essentials', href: '/categories/school-essentials' },
    { name: 'Bags', href: '/categories/bags' },
    { name: 'Stationery', href: '/categories/stationery' },
    { name: 'Baby Essentials', href: '/categories/baby-essentials' },
    { name: 'Art & Craft', href: '/categories/art-craft' },
    { name: 'Hampers', href: '/categories/hampers' },
  ];
  
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white text-center py-2 text-sm">
        🎉 Extra 10% OFF on Prepaid Orders | Free Shipping on Orders Above ₹999
      </div>
      
      {/* Main Navbar */}
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl">🌍</span>
            <span className="text-2xl font-bold text-primary">PlanetKids</span>
          </Link>
          
          {/* Search Bar (Desktop) */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          
          {/* Icons */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Heart className="w-6 h-6 text-gray-700" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>
            
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                2
              </span>
            </button>
            
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <User className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Category Navigation (Desktop) */}
      <div className="hidden lg:block bg-gray-50 border-t">
        <div className="container-custom">
          <div className="flex items-center gap-6 py-3 overflow-x-auto no-scrollbar">
            {categories.map((category) => (
              <Link
                key={category.href}
                href={category.href}
                className="text-sm font-medium text-gray-700 hover:text-primary transition-colors whitespace-nowrap"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t">
          <div className="container-custom py-4 space-y-4">
            {/* Mobile Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            
            {/* Mobile Categories */}
            <div className="space-y-2">
              {categories.map((category) => (
                <Link
                  key={category.href}
                  href={category.href}
                  className="block py-2 text-gray-700 hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
```

---

## Component Best Practices

### 1. Use TypeScript Interfaces
```typescript
interface Props {
  required: string;
  optional?: number;
  children?: React.ReactNode;
}
```

### 2. Use cn() for className Merging
```typescript
import { cn } from '@/lib/utils';

<div className={cn('base-class', conditionalClass && 'conditional', className)} />
```

### 3. Export Named Components
```typescript
export function ComponentName() { }
// Not: export default ComponentName
```

### 4. Use Server vs Client Components
```typescript
// Server Component (default)
export function ServerComponent() { }

// Client Component
'use client';
export function ClientComponent() { }
```

### 5. Co-locate Styles
```typescript
const styles = {
  container: 'flex items-center gap-4',
  button: 'btn-primary',
};
```

---

## File Organization

```
components/
├── layout/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Sidebar.tsx
│   └── Container.tsx
├── products/
│   ├── ProductCard.tsx
│   ├── ProductGrid.tsx
│   ├── ProductFilter.tsx
│   └── ProductSort.tsx
├── ui/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── Toast.tsx
│   └── Badge.tsx
├── cart/
│   ├── CartItem.tsx
│   ├── CartDrawer.tsx
│   └── CartSummary.tsx
└── admin/
    ├── AdminSidebar.tsx
    ├── DataTable.tsx
    └── StatsCard.tsx
```

---

## Next Steps

1. Create `components/layout/Navbar.tsx`
2. Create `components/layout/Footer.tsx`
3. Create `components/ui/Button.tsx`
4. Create `components/products/ProductCard.tsx`
5. Update `app/layout.tsx` to use Navbar and Footer

Then you can start building pages using these components!
