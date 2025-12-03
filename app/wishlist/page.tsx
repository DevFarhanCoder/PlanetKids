'use client';

import { useState } from 'react';
import ProductCard from '@/components/products/ProductCard';
import { Heart } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const [wishlistItems] = useState([
    {
      id: '2',
      name: 'Colorful Building Blocks Set',
      slug: 'building-blocks-set',
      price: 799,
      originalPrice: 1299,
      image: '🧱',
      rating: 4,
      reviewCount: 18,
      discount: 38,
      inStock: true,
    },
    {
      id: '5',
      name: 'Musical Toy Piano',
      slug: 'musical-toy-piano',
      price: 1899,
      originalPrice: 2999,
      image: '🎹',
      rating: 5,
      reviewCount: 28,
      discount: 37,
      inStock: true,
    },
    {
      id: '6',
      name: 'Puzzle Game Set',
      slug: 'puzzle-game-set',
      price: 599,
      originalPrice: 999,
      image: '🧩',
      rating: 4,
      reviewCount: 21,
      discount: 40,
      inStock: false,
    },
  ]);

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-24 h-24 mx-auto text-gray-300 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Wishlist is Empty</h1>
          <p className="text-gray-600 mb-6">Save items you love for later!</p>
          <Link href="/products" className="btn-primary inline-block">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-8 h-8 text-red-500 fill-red-500" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">My Wishlist</h1>
        </div>

        <p className="text-gray-600 mb-8">{wishlistItems.length} items saved</p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </div>
  );
}
