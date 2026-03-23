"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  SlidersHorizontal,
  X,
  Star,
  ChevronDown,
  ChevronUp,
  Home,
} from "lucide-react";

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

const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-low" },
  { label: "Price: High to Low", value: "price-high" },
  { label: "Name: A to Z", value: "name" },
  { label: "Newest First", value: "newest" },
];

const PRICE_RANGES = [
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 – ₹999", min: 500, max: 999 },
  { label: "₹1,000 – ₹1,999", min: 1000, max: 1999 },
  { label: "₹2,000 – ₹4,999", min: 2000, max: 4999 },
  { label: "₹5,000 & above", min: 5000, max: Infinity },
];

export default function CategoryClient({ category }: CategoryClientProps) {
  const router = useRouter();
  const initialProducts = category.products;
  const subcategories = category.children;

  const [sortBy, setSortBy] = useState("featured");
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(
    null,
  );
  const [showSort, setShowSort] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [priceExpanded, setPriceExpanded] = useState(true);
  const [subcatExpanded, setSubcatExpanded] = useState(true);

  const sortProducts = (
    productsToSort: Product[],
    sortType: string,
  ): Product[] => {
    const sorted = [...productsToSort];
    switch (sortType) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      case "name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sorted;
    }
  };

  let filtered = sortProducts(initialProducts, sortBy);
  if (selectedPriceRange !== null) {
    const range = PRICE_RANGES[selectedPriceRange];
    filtered = filtered.filter(
      (p) => p.price >= range.min && p.price <= range.max,
    );
  }
  const displayedCount = filtered.length;

  const activeFilterCount = selectedPriceRange !== null ? 1 : 0;

  const clearAllFilters = () => {
    setSelectedPriceRange(null);
  };

  /* ── Shared sidebar content ─────────────────────────────────────── */
  const SidebarContent = () => (
    <div className="space-y-0">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <span className="text-sm font-black text-gray-700 uppercase tracking-widest">
          Filter By
        </span>
      </div>

      {/* Subcategories */}
      {subcategories.length > 0 && (
        <div className="border-b border-gray-200">
          <button
            onClick={() => setSubcatExpanded(!subcatExpanded)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-bold text-gray-800 uppercase tracking-wide">
              {category.name}
            </span>
            {subcatExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          {subcatExpanded && (
            <div className="px-4 pb-3 space-y-2">
              {subcategories.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/categories/${sub.slug}`}
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-orange-600 transition-colors group"
                >
                  <div className="w-4 h-4 border border-gray-400 rounded-sm flex items-center justify-center flex-shrink-0 group-hover:border-orange-500" />
                  <span className="truncate">{sub.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Price Filter */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => setPriceExpanded(!priceExpanded)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
        >
          <span className="text-sm font-bold text-gray-800 uppercase tracking-wide">
            Price
          </span>
          {priceExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {priceExpanded && (
          <div className="px-4 pb-3 space-y-2">
            {PRICE_RANGES.map((range, idx) => (
              <label
                key={idx}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <div
                  onClick={() =>
                    setSelectedPriceRange(
                      selectedPriceRange === idx ? null : idx,
                    )
                  }
                  className={`w-4 h-4 border rounded-sm flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer ${
                    selectedPriceRange === idx
                      ? "bg-orange-500 border-orange-500"
                      : "border-gray-400 group-hover:border-orange-400"
                  }`}
                >
                  {selectedPriceRange === idx && (
                    <svg
                      className="w-2.5 h-2.5 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3}
                      viewBox="0 0 12 12"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2 6l3 3 5-5"
                      />
                    </svg>
                  )}
                </div>
                <span
                  onClick={() =>
                    setSelectedPriceRange(
                      selectedPriceRange === idx ? null : idx,
                    )
                  }
                  className={`text-sm transition-colors cursor-pointer ${
                    selectedPriceRange === idx
                      ? "text-orange-600 font-semibold"
                      : "text-gray-700 group-hover:text-gray-900"
                  }`}
                >
                  {range.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {activeFilterCount > 0 && (
        <div className="px-4 py-3">
          <button
            onClick={clearAllFilters}
            className="w-full py-2 text-sm font-semibold text-orange-600 border border-orange-400 rounded-lg hover:bg-orange-50 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );

  /* ── Product card ───────────────────────────────────────────────── */
  const ProductCard = ({ product }: { product: Product }) => {
    const discount =
      product.compareAtPrice && product.compareAtPrice > product.price
        ? Math.round(
            ((product.compareAtPrice - product.price) /
              product.compareAtPrice) *
              100,
          )
        : null;
    return (
      <Link
        href={`/products/${product.slug}`}
        className="bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow group border border-gray-200"
      >
        <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
          {discount && discount > 0 && (
            <div className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] md:text-xs px-1.5 py-0.5 rounded font-bold z-10">
              {discount}% OFF
            </div>
          )}
          {product.isNewArrival && (
            <div className="absolute top-2 right-2 bg-blue-500 text-white text-[10px] md:text-xs px-1.5 py-0.5 rounded font-bold z-10">
              NEW
            </div>
          )}
          {product.isFeatured && !product.isNewArrival && (
            <div className="absolute top-2 right-2 bg-purple-500 text-white text-[10px] md:text-xs px-1.5 py-0.5 rounded font-bold z-10">
              FEATURED
            </div>
          )}
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-5xl">
              📦
            </div>
          )}
        </div>
        <div className="p-2.5 md:p-3">
          <h3 className="text-xs md:text-sm text-gray-800 line-clamp-2 mb-1.5 leading-snug">
            {product.name}
          </h3>
          {product.reviewCount > 0 && (
            <div className="flex items-center gap-0.5 mb-1.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-2.5 h-2.5 md:w-3 md:h-3 ${
                    i < Math.round(product.averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              ))}
              <span className="text-[10px] text-gray-400 ml-0.5">
                ({product.reviewCount})
              </span>
            </div>
          )}
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-sm md:text-base font-bold text-gray-900">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.compareAtPrice &&
              product.compareAtPrice > product.price && (
                <>
                  <span className="text-xs text-gray-400 line-through">
                    ₹{product.compareAtPrice.toLocaleString("en-IN")}
                  </span>
                  {discount && discount > 0 && (
                    <span className="text-xs text-green-600 font-semibold">
                      (upto {discount}% Off)
                    </span>
                  )}
                </>
              )}
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── MOBILE: Compact Sticky Header ────────────────────────── */}
      <div className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => router.back()}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-gray-900 truncate">
              {category.name}
            </h1>
            <p className="text-xs text-gray-500">{displayedCount} Items</p>
          </div>
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex-shrink-0"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filter
            {activeFilterCount > 0 && (
              <span className="bg-orange-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setShowSort(!showSort)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex-shrink-0"
          >
            Sort
            <ChevronDown
              className={`w-3 h-3 transition-transform ${showSort ? "rotate-180" : ""}`}
            />
          </button>
        </div>
        {showSort && (
          <div className="border-t border-gray-100 px-4 py-2 bg-white">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setSortBy(opt.value);
                    setShowSort(false);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex-shrink-0 ${
                    sortBy === opt.value
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
        {/* Age chips row */}
        <div className="border-t border-gray-100 px-4 py-2 bg-white">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {AGE_FILTERS.map((age) => (
              <button
                key={age.value}
                onClick={() => setSelectedAge(age.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex-shrink-0 ${
                  selectedAge === age.value
                    ? "bg-orange-500 text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {age.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: subcategory pills */}
      {subcategories.length > 0 && (
        <div className="md:hidden bg-white border-b border-gray-100">
          <div className="flex gap-2 px-4 py-2.5 overflow-x-auto scrollbar-hide">
            {subcategories.map((sub) => (
              <Link
                key={sub.id}
                href={`/categories/${sub.slug}`}
                className="px-4 py-1.5 bg-orange-50 border border-orange-200 text-orange-700 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 hover:bg-orange-100 transition-colors"
              >
                {sub.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── DESKTOP: Breadcrumb ───────────────────────────────────── */}
      <div className="hidden md:block bg-white border-b border-gray-200">
        <div className="container-custom py-2.5">
          <nav className="flex items-center gap-1.5 text-xs text-gray-500">
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-orange-600 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              Home
            </Link>
            {category.parent && (
              <>
                <span className="text-gray-300">&gt;</span>
                <Link
                  href={`/categories/${category.parent.slug}`}
                  className="hover:text-orange-600 transition-colors truncate max-w-[140px]"
                >
                  {category.parent.name}
                </Link>
              </>
            )}
            <span className="text-gray-300">&gt;</span>
            <span className="text-gray-800 font-semibold truncate max-w-[180px]">
              {category.name}
            </span>
          </nav>
        </div>
      </div>

      {/* ── DESKTOP: Full Layout ──────────────────────────────────── */}
      <div className="hidden md:block bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-start py-4 gap-6">
          {/* ── Left Sidebar ── */}
          <aside className="w-60 flex-shrink-0 bg-white border border-gray-200 rounded-lg shadow-sm self-stretch">
            <div className="sticky top-[70px]">
              {/* Delivery Check */}
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                  🚚 Check Delivery Details
                </p>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Enter Pincode"
                    maxLength={6}
                    className="flex-1 px-2.5 py-1.5 border border-gray-300 border-r-0 rounded-l text-xs focus:outline-none focus:border-orange-400 bg-gray-50 min-w-0"
                  />
                  <button className="px-3 py-1.5 border border-orange-500 bg-white text-orange-500 text-[11px] font-bold rounded-r hover:bg-orange-50 transition-colors whitespace-nowrap">
                    CHECK
                  </button>
                </div>
              </div>

              {/* FILTER BY header */}
              <div className="px-4 py-2 bg-gray-100 border-b border-gray-200">
                <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">
                  Filter By
                </span>
              </div>

              {/* Subcategories */}
              {subcategories.length > 0 && (
                <div className="border-b border-gray-200">
                  <button
                    onClick={() => setSubcatExpanded(!subcatExpanded)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-xs font-black text-gray-700 uppercase tracking-wide">
                      ✓ {category.name}
                    </span>
                    {subcatExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                    )}
                  </button>
                  {subcatExpanded && (
                    <div className="px-4 pb-3 space-y-2.5">
                      {subcategories.map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/categories/${sub.slug}`}
                          className="flex items-start gap-2 group"
                        >
                          <div className="w-3.5 h-3.5 border border-gray-400 rounded-sm flex-shrink-0 mt-0.5 group-hover:border-orange-500 transition-colors" />
                          <span className="text-sm text-gray-600 group-hover:text-orange-600 leading-tight transition-colors">
                            {sub.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Age Filter */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => setAgeExpanded(!ageExpanded)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-xs font-black text-gray-700 uppercase tracking-wide">
                    Age
                  </span>
                  {ageExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  )}
                </button>
                {ageExpanded && (
                  <div className="px-4 pb-3 space-y-2.5">
                    {AGE_FILTERS.filter((a) => a.value !== "all").map((age) => (
                      <label
                        key={age.value}
                        onClick={() =>
                          setSelectedAge(
                            selectedAge === age.value ? "all" : age.value,
                          )
                        }
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <div
                          className={`w-3.5 h-3.5 border rounded-sm flex items-center justify-center flex-shrink-0 transition-colors ${selectedAge === age.value ? "bg-orange-500 border-orange-500" : "border-gray-400 group-hover:border-orange-400"}`}
                        >
                          {selectedAge === age.value && (
                            <svg
                              className="w-2 h-2 text-white"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={3}
                              viewBox="0 0 12 12"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2 6l3 3 5-5"
                              />
                            </svg>
                          )}
                        </div>
                        <span
                          className={`text-sm transition-colors ${selectedAge === age.value ? "text-orange-600 font-semibold" : "text-gray-600 group-hover:text-gray-900"}`}
                        >
                          {age.label}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Filter */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => setPriceExpanded(!priceExpanded)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-xs font-black text-gray-700 uppercase tracking-wide">
                    Price
                  </span>
                  {priceExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  )}
                </button>
                {priceExpanded && (
                  <div className="px-4 pb-3 space-y-2.5">
                    {PRICE_RANGES.map((range, idx) => (
                      <label
                        key={idx}
                        onClick={() =>
                          setSelectedPriceRange(
                            selectedPriceRange === idx ? null : idx,
                          )
                        }
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <div
                          className={`w-3.5 h-3.5 border rounded-sm flex items-center justify-center flex-shrink-0 transition-colors ${selectedPriceRange === idx ? "bg-orange-500 border-orange-500" : "border-gray-400 group-hover:border-orange-400"}`}
                        >
                          {selectedPriceRange === idx && (
                            <svg
                              className="w-2 h-2 text-white"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={3}
                              viewBox="0 0 12 12"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2 6l3 3 5-5"
                              />
                            </svg>
                          )}
                        </div>
                        <span
                          className={`text-sm transition-colors ${selectedPriceRange === idx ? "text-orange-600 font-semibold" : "text-gray-600 group-hover:text-gray-900"}`}
                        >
                          {range.label}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {activeFilterCount > 0 && (
                <div className="px-4 py-3">
                  <button
                    onClick={clearAllFilters}
                    className="w-full py-2 text-xs font-bold text-orange-600 border border-orange-400 rounded hover:bg-orange-50 transition-colors uppercase tracking-wide"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </aside>

          {/* ── Main Content ── */}
          <main className="flex-1 min-w-0 py-5">
            {/* Header row */}
            <div className="flex items-start justify-between mb-2 gap-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {category.name}{" "}
                  <span className="text-gray-400 font-normal text-base">
                    ({displayedCount} Items)
                  </span>
                </h1>
                {category.description && (
                  <p className="text-sm text-gray-500 mt-0.5">
                    {category.description}
                  </p>
                )}
              </div>
              {/* Sort By */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-sm text-gray-500 whitespace-nowrap">
                  Sort by:
                </span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded text-sm text-gray-700 bg-white focus:outline-none focus:border-orange-400 cursor-pointer"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Active filter pills */}
            {activeFilterCount > 0 && (
              <div className="flex items-center gap-2 flex-wrap mb-3">
                {selectedAge !== "all" && (
                  <div className="flex items-center gap-1.5 bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                    {AGE_FILTERS.find((a) => a.value === selectedAge)?.label}
                    <button
                      onClick={() => setSelectedAge("all")}
                      aria-label="Remove age filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {selectedPriceRange !== null && (
                  <div className="flex items-center gap-1.5 bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                    {PRICE_RANGES[selectedPriceRange].label}
                    <button
                      onClick={() => setSelectedPriceRange(null)}
                      aria-label="Remove price filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-gray-400 hover:text-gray-700 underline"
                >
                  Clear All
                </button>
              </div>
            )}

            <div className="border-b border-gray-200 mb-5" />

            {/* Products grid */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-16 text-center border border-gray-200">
                <div className="text-5xl mb-4">📦</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  Try adjusting filters or check back later
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-orange-500 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-orange-600 transition-colors text-sm"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ── MOBILE: Products Grid ─────────────────────────────────── */}
      <div className="md:hidden p-3">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center mt-4">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Check back later for new products
            </p>
            <Link
              href="/"
              className="inline-block bg-orange-500 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-orange-600 transition-colors text-sm"
            >
              Back to Home
            </Link>
          </div>
        )}
      </div>

      {/* ── MOBILE: Filter Drawer ─────────────────────────────────── */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[300] flex md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="relative ml-auto w-72 max-w-[85vw] h-full bg-white flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-200 bg-gray-50">
              <span className="font-bold text-gray-900">Filters</span>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <SidebarContent />
            </div>
            <div className="px-4 py-3 border-t border-gray-200 bg-white">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors text-sm"
              >
                Apply Filters{" "}
                {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
