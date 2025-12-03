'use client';

import Link from 'next/link';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  discount?: number;
  inStock?: boolean;
}

export default function ProductCard({
  id,
  name,
  slug,
  price,
  originalPrice,
  image,
  rating = 0,
  reviewCount = 0,
  isNew = false,
  discount,
  inStock = true,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddingToCart(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsAddingToCart(false);
      // Show toast notification here
    }, 500);
  };

  return (
    <Link href={`/products/${slug}`} className="product-card group">
      <div className="relative aspect-square bg-gray-100 rounded-t-xl overflow-hidden">
        {/* Image Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
          <span className="text-6xl">{image}</span>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew && <div className="badge-new">NEW</div>}
          {discount && discount > 0 && (
            <div className="badge-sale">{discount}% OFF</div>
          )}
          {!inStock && (
            <div className="bg-gray-900 text-white px-2 py-1 rounded text-xs font-bold">
              OUT OF STOCK
            </div>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            isWishlisted
              ? 'bg-red-500 text-white'
              : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
          }`}
          aria-label="Add to wishlist"
        >
          <Heart
            className="w-5 h-5"
            fill={isWishlisted ? 'currentColor' : 'none'}
          />
        </button>

        {/* Quick Add to Cart (visible on hover) */}
        {inStock && (
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="absolute bottom-3 left-3 right-3 btn-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            {isAddingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {name}
        </h3>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-gray-200 text-gray-200'
                }`}
              />
            ))}
            {reviewCount > 0 && (
              <span className="text-sm text-gray-500">({reviewCount})</span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xl font-bold text-primary">
            ₹{price.toLocaleString('en-IN')}
          </span>
          {originalPrice && originalPrice > price && (
            <>
              <span className="text-sm text-gray-500 line-through">
                ₹{originalPrice.toLocaleString('en-IN')}
              </span>
              {discount && (
                <span className="text-xs font-semibold text-green-600">
                  Save {discount}%
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
