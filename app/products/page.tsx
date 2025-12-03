'use client';

import { useState } from 'react';
import ProductCard from '@/components/products/ProductCard';
import { ChevronDown, Filter, SlidersHorizontal, X } from 'lucide-react';

export default function ProductsPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('featured');

  const categories = [
    'School Essentials',
    'Toys and Games',
    'Art & Craft',
    'Hamper for Kids',
    'Baby Essentials',
    'Learning Kits',
    'Bags & Backpacks',
    'Stationery',
  ];

  const ageGroups = [
    '0-1 Years',
    '1-2 Years',
    '2-4 Years',
    '4-6 Years',
    '6-8 Years',
    '8+ Years',
  ];

  // Sample products
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
      id: '2',
      name: 'Colorful Building Blocks Set - 100 Pieces',
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
      id: '3',
      name: 'Kids School Backpack - Ergonomic Design',
      slug: 'kids-school-backpack',
      price: 1599,
      originalPrice: 2499,
      image: '🎒',
      rating: 5,
      reviewCount: 32,
      discount: 36,
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
      id: '5',
      name: 'Musical Toy Piano - Electronic Keyboard',
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
      name: 'Puzzle Game Set - Brain Development',
      slug: 'puzzle-game-set',
      price: 599,
      originalPrice: 999,
      image: '🧩',
      rating: 4,
      reviewCount: 21,
      discount: 40,
      inStock: false,
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
      id: '8',
      name: 'Toy Car Collection - Die-Cast Metal',
      slug: 'toy-car-collection',
      price: 999,
      originalPrice: 1599,
      image: '🚗',
      rating: 4,
      reviewCount: 19,
      discount: 38,
      inStock: true,
    },
  ];

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleAgeGroup = (age: string) => {
    setSelectedAgeGroups((prev) =>
      prev.includes(age) ? prev.filter((a) => a !== age) : [...prev, age]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedAgeGroups([]);
    setPriceRange({ min: 0, max: 5000 });
    setSelectedRating(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              All Products
            </h1>
            <p className="text-gray-600">
              Showing {products.length} products
            </p>
          </div>

          {/* Sort & Filter Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden btn-outline flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field pr-10 appearance-none cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`${
              showFilters ? 'block' : 'hidden'
            } md:block w-full md:w-64 flex-shrink-0 space-y-6`}
          >
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5" />
                  Filters
                </h2>
                {(selectedCategories.length > 0 ||
                  selectedAgeGroups.length > 0 ||
                  selectedRating !== null) && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-primary hover:text-primary-600"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label
                      key={category}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="w-4 h-4 text-primary rounded focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-primary">
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6 pb-6 border-b">
                <h3 className="font-semibold mb-3">Price Range</h3>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange({ ...priceRange, max: parseInt(e.target.value) })
                    }
                    className="w-full"
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">₹{priceRange.min}</span>
                    <span className="font-semibold text-primary">
                      ₹{priceRange.max}
                    </span>
                  </div>
                </div>
              </div>

              {/* Age Group */}
              <div className="mb-6 pb-6 border-b">
                <h3 className="font-semibold mb-3">Age Group</h3>
                <div className="space-y-2">
                  {ageGroups.map((age) => (
                    <label
                      key={age}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAgeGroups.includes(age)}
                        onChange={() => toggleAgeGroup(age)}
                        className="w-4 h-4 text-primary rounded focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-primary">
                        {age}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <h3 className="font-semibold mb-3">Minimum Rating</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <label
                      key={rating}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="rating"
                        checked={selectedRating === rating}
                        onChange={() => setSelectedRating(rating)}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-primary">
                        {rating}+ Stars
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {/* Active Filters */}
            {(selectedCategories.length > 0 || selectedAgeGroups.length > 0) && (
              <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-gray-700">
                    Active Filters:
                  </span>
                  {selectedCategories.map((cat) => (
                    <span
                      key={cat}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {cat}
                      <button
                        onClick={() => toggleCategory(cat)}
                        className="hover:bg-primary/20 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {selectedAgeGroups.map((age) => (
                    <span
                      key={age}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm"
                    >
                      {age}
                      <button
                        onClick={() => toggleAgeGroup(age)}
                        className="hover:bg-secondary/20 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex items-center justify-center gap-2">
              <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50">
                Previous
              </button>
              <button className="px-4 py-2 rounded-lg bg-primary text-white">
                1
              </button>
              <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                2
              </button>
              <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                3
              </button>
              <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                Next
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
