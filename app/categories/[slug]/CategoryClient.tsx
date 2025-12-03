'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Filter, SlidersHorizontal, X, Star } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  image: string | null;
  averageRating: number;
  reviewCount: number;
  isFeatured: boolean;
  isNewArrival: boolean;
}

interface CategoryClientProps {
  category: {
    name: string;
    description: string | null;
    slug: string;
    products: Product[];
    children: any[];
    parent: any;
  };
}

export default function CategoryClient({ category }: CategoryClientProps) {
  const initialProducts = category.products;
  const subcategories = category.children;
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
  const [sortBy, setSortBy] = useState('featured');
  const [products, setProducts] = useState(initialProducts);

  const sortProducts = (productsToSort: Product[], sortType: string) => {
    const sorted = [...productsToSort];
    switch (sortType) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sorted;
    }
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setProducts(sortProducts(products, newSort));
  };

  const filteredProducts = products.filter(
    p => p.price >= priceRange.min && p.price <= priceRange.max
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-12">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{category.name}</h1>
          <p className="text-lg opacity-90">{category.description}</p>
          <div className="mt-4 text-sm opacity-75">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} available
          </div>
        </div>
      </div>

      {/* Subcategories */}
      {subcategories.length > 0 && (
        <div className="bg-white border-b">
          <div className="container-custom py-4">
            <div className="flex gap-2 overflow-x-auto">
              {subcategories.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/categories/${sub.slug}`}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg whitespace-nowrap transition-colors"
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="container-custom py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Price Range</h3>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span>₹{priceRange.min}</span>
                    <span>₹{priceRange.max}</span>
                  </div>
                </div>
              </div>

              {/* Sort By */}
              <div>
                <h3 className="font-semibold mb-3">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm"
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters & Sort
              </button>
            </div>

            {/* Products */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <div className="relative aspect-square bg-gray-100 rounded-t-xl overflow-hidden">
                      {product.isFeatured && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold z-10">
                          FEATURED
                        </div>
                      )}
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-6xl">
                          📦
                        </div>
                      )}
                      {product.isNewArrival && (
                        <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-semibold z-10">
                          NEW
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[3rem]">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.round(product.averageRating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-gray-200 text-gray-200'
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-500">({product.reviewCount})</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xl font-bold text-primary">
                          ₹{product.price.toLocaleString()}
                        </span>
                        {product.compareAtPrice && product.compareAtPrice > product.price && (
                          <>
                            <span className="text-sm text-gray-500 line-through">
                              ₹{product.compareAtPrice.toLocaleString()}
                            </span>
                            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded font-semibold">
                              {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 text-center">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or check back later for new products
                </p>
                <Link
                  href="/"
                  className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
