'use client';

import ProductCard from '@/components/products/ProductCard';
import { Sparkles } from 'lucide-react';

export default function NewArrivalsPage() {
  const products = [
    {
      id: '1',
      name: 'Educational Learning Kit - STEM Science Experiment Set',
      slug: 'educational-learning-kit',
      price: 1299,
      originalPrice: 1999,
      image: '🔬',
      rating: 5,
      reviewCount: 24,
      isNew: true,
      discount: 35,
      inStock: true,
    },
    {
      id: '4',
      name: 'Art & Craft Supplies Kit - Premium Quality',
      slug: 'art-craft-kit',
      price: 899,
      originalPrice: 1499,
      image: '🎨',
      rating: 4,
      reviewCount: 15,
      isNew: true,
      discount: 40,
      inStock: true,
    },
    {
      id: '7',
      name: 'Story Books Collection - Set of 10',
      slug: 'story-books-collection',
      price: 1299,
      originalPrice: 1999,
      image: '📚',
      rating: 5,
      reviewCount: 45,
      isNew: true,
      discount: 35,
      inStock: true,
    },
    {
      id: '10',
      name: 'Smart Watch for Kids - GPS Tracking',
      slug: 'smart-watch-kids',
      price: 2499,
      originalPrice: 3999,
      image: '⌚',
      rating: 5,
      reviewCount: 12,
      isNew: true,
      discount: 38,
      inStock: true,
    },
    {
      id: '11',
      name: 'Wooden Educational Puzzle Set',
      slug: 'wooden-puzzle-set',
      price: 699,
      originalPrice: 1199,
      image: '🧩',
      rating: 4,
      reviewCount: 8,
      isNew: true,
      discount: 42,
      inStock: true,
    },
    {
      id: '12',
      name: 'Kids Digital Camera - HD Quality',
      slug: 'kids-digital-camera',
      price: 1899,
      originalPrice: 2999,
      image: '📷',
      rating: 5,
      reviewCount: 18,
      isNew: true,
      discount: 37,
      inStock: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent/20 via-primary/20 to-secondary/20 py-16">
        <div className="container-custom text-center">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md mb-4">
            <Sparkles className="w-5 h-5 text-accent" />
            <span className="font-semibold text-gray-900">Just Arrived</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            New Arrivals
          </h1>
          <p className="text-xl text-gray-600">
            Discover our latest collection of exciting products for kids
          </p>
        </div>
      </div>

      {/* Products Section */}
      <div className="container-custom py-12">
        <div className="mb-8">
          <p className="text-gray-600">Showing {products.length} new products</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </div>
  );
}
