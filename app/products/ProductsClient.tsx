"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronDown, Filter, X } from "lucide-react";

interface ProductImage {
  url: string;
}

interface ProductCategory {
  category: {
    name: string;
    slug: string;
  };
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  images: ProductImage[];
  categories: ProductCategory[];
  brand: string | null;
  ageGroup: string | null;
  quantity: number;
  isActive: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const ageGroups = [
  "All Ages",
  "0-2 years",
  "2-5 years",
  "3-5 years",
  "5+ years",
  "6+ years",
  "8+ years",
];

export default function ProductsClient({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedAge, setSelectedAge] = useState("All Ages");
  const [selectedBrand, setSelectedBrand] = useState("All Brands");
  const [showFilters, setShowFilters] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(products);

  // Extract unique brands from products
  const brands = [
    "All Brands",
    ...Array.from(
      new Set(products.map((p) => p.brand).filter((b) => b !== null)),
    ),
  ];

  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter((p) =>
        p.categories.some((c) => c.category.name === selectedCategory),
      );
    }

    if (selectedAge !== "All Ages") {
      filtered = filtered.filter((p) => p.ageGroup === selectedAge);
    }

    if (selectedBrand !== "All Brands") {
      filtered = filtered.filter((p) => p.brand === selectedBrand);
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, selectedAge, selectedBrand, products]);

  const calculateDiscount = (price: number, comparePrice: number | null) => {
    if (!comparePrice || comparePrice <= price) return null;
    return Math.round(((comparePrice - price) / comparePrice) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary-500 via-primary-600 to-orange-500 text-white py-12 md:py-16">
        <div className="container-custom">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-black mb-3">
              PREMIUM <span className="text-gray-900">BOUTIQUES</span>
            </h1>
            <p className="text-lg md:text-xl font-semibold opacity-90">
              Discover Amazing Toys for Every Age
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-gray-800 text-white sticky top-[72px] z-40 shadow-lg">
        <div className="container-custom">
          <div className="flex items-center justify-between py-3 md:py-4">
            <div className="flex items-center gap-2 md:gap-4 flex-wrap">
              <h2 className="font-bold text-sm md:text-base hidden sm:block">
                Filter Boutiques By:
              </h2>

              {/* Category Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-3 md:px-4 py-2 rounded-lg transition-colors text-sm md:text-base font-medium"
                >
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">Category</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              <select
                value={selectedAge}
                onChange={(e) => setSelectedAge(e.target.value)}
                className="bg-gray-700 hover:bg-gray-600 px-3 md:px-4 py-2 rounded-lg transition-colors text-sm md:text-base font-medium cursor-pointer border-none outline-none"
              >
                {ageGroups.map((age) => (
                  <option key={age} value={age}>
                    {age}
                  </option>
                ))}
              </select>

              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="bg-gray-700 hover:bg-gray-600 px-3 md:px-4 py-2 rounded-lg transition-colors text-sm md:text-base font-medium cursor-pointer border-none outline-none"
              >
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            <p className="text-gray-300 text-sm md:text-base font-medium">
              (Showing {filteredProducts.length} Boutique
              {filteredProducts.length !== 1 ? "s" : ""})
            </p>
          </div>

          {/* Category Filter Panel */}
          {showFilters && (
            <div className="border-t border-gray-700 py-4 animate-slide-down">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setSelectedCategory("All Categories");
                    setShowFilters(false);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === "All Categories"
                      ? "bg-primary-500 text-white"
                      : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                  }`}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.name);
                      setShowFilters(false);
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category.name
                        ? "bg-primary-500 text-white"
                        : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {(selectedCategory !== "All Categories" ||
        selectedAge !== "All Ages" ||
        selectedBrand !== "All Brands") && (
        <div className="bg-white border-b border-gray-200 py-3">
          <div className="container-custom">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-semibold text-gray-700">
                Active Filters:
              </span>
              {selectedCategory !== "All Categories" && (
                <button
                  onClick={() => setSelectedCategory("All Categories")}
                  className="flex items-center gap-2 bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-primary-200 transition-colors"
                >
                  {selectedCategory}
                  <X className="w-3 h-3" />
                </button>
              )}
              {selectedAge !== "All Ages" && (
                <button
                  onClick={() => setSelectedAge("All Ages")}
                  className="flex items-center gap-2 bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-primary-200 transition-colors"
                >
                  {selectedAge}
                  <X className="w-3 h-3" />
                </button>
              )}
              {selectedBrand !== "All Brands" && (
                <button
                  onClick={() => setSelectedBrand("All Brands")}
                  className="flex items-center gap-2 bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-primary-200 transition-colors"
                >
                  {selectedBrand}
                  <X className="w-3 h-3" />
                </button>
              )}
              <button
                onClick={() => {
                  setSelectedCategory("All Categories");
                  setSelectedAge("All Ages");
                  setSelectedBrand("All Brands");
                }}
                className="text-sm text-gray-600 hover:text-gray-900 font-medium underline"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="container-custom py-8 md:py-12">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600 font-semibold">
              No products found matching your filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All Categories");
                setSelectedAge("All Ages");
                setSelectedBrand("All Brands");
              }}
              className="mt-4 bg-primary-500 text-white px-6 py-3 rounded-full font-bold hover:bg-primary-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {filteredProducts.map((product) => {
              const discount = calculateDiscount(
                product.price,
                product.compareAtPrice,
              );
              const imageUrl =
                product.images[0]?.url || "/placeholder-product.jpg";

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-soft-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      fill
                      className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                    {discount && discount > 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs md:text-sm font-bold shadow-lg">
                        {discount}% OFF
                      </div>
                    )}
                  </div>
                  <div className="p-3 md:p-4">
                    <h3 className="font-bold text-sm md:text-base text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg md:text-xl font-black text-gray-900">
                        ₹{product.price}
                      </span>
                      {product.compareAtPrice &&
                        product.compareAtPrice > product.price && (
                          <span className="text-xs md:text-sm text-gray-400 line-through">
                            ₹{product.compareAtPrice}
                          </span>
                        )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 font-medium">
                        {product.categories[0]?.category.name ||
                          "Uncategorized"}
                      </span>
                      {product.quantity > 0 && (
                        <span className="text-xs text-green-600 font-semibold">
                          In Stock
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
