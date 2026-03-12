"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
} from "lucide-react";

interface Subcategory {
  name: string;
  slug: string;
}

interface Category {
  name: string;
  slug: string;
  subcategories: Subcategory[];
}

export default function Navbar() {
  const { data: session } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<any>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const buttonRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  useEffect(() => {
    setMounted(true);

    // Fetch categories from API
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) {
          // Transform database categories to component format
          const formattedCategories = data.categories
            .filter((cat: any) => !cat.parentId) // Only main categories
            .map((cat: any) => ({
              name: cat.name,
              slug: cat.slug,
              subcategories: data.categories
                .filter((sub: any) => sub.parentId === cat.id)
                .map((sub: any) => ({
                  name: sub.name,
                  slug: sub.slug,
                })),
            }));
          setCategories(formattedCategories);
        }
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // Fetch cart and wishlist counts
  useEffect(() => {
    if (session?.user) {
      fetchCounts();
    } else {
      setCartCount(0);
      setWishlistCount(0);
    }
  }, [session]);

  // Listen for cart updates
  useEffect(() => {
    const handleCartUpdate = () => {
      if (session?.user) {
        fetchCounts();
      }
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, [session]);

  // Fetch search suggestions
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      setLoadingSuggestions(true);

      // Debounce search
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const response = await fetch(
            `/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`,
          );
          if (response.ok) {
            const data = await response.json();
            setSearchSuggestions(data);
            setShowSuggestions(true);
          }
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        } finally {
          setLoadingSuggestions(false);
        }
      }, 300);
    } else {
      setShowSuggestions(false);
      setSearchSuggestions(null);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchCounts = async () => {
    try {
      // Fetch cart count
      const cartResponse = await fetch("/api/cart");
      if (cartResponse.ok) {
        const cartData = await cartResponse.json();
        setCartCount(cartData.items?.length || 0);
      }

      // Fetch wishlist count
      const wishlistResponse = await fetch("/api/wishlist");
      if (wishlistResponse.ok) {
        const wishlistData = await wishlistResponse.json();
        setWishlistCount(wishlistData.length || 0);
      }
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  useEffect(() => {
    if (activeDropdown && buttonRefs.current[activeDropdown]) {
      const button = buttonRefs.current[activeDropdown];
      const rect = button.getBoundingClientRect();
      // Don't add scrollTop since navbar is sticky - use viewport position directly
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
      });
    }
  }, [activeDropdown]);

  const handleMouseEnter = (slug: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveDropdown(slug);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 100);
  };

  const handleDropdownEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const container = document.getElementById("nav-scroll");
      if (container) {
        const { scrollLeft, scrollWidth, clientWidth } = container;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
      }
    };

    const container = document.getElementById("nav-scroll");
    if (container) {
      container.addEventListener("scroll", handleScroll);
      // Initial check
      handleScroll();
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Check arrows when categories load
  useEffect(() => {
    if (categories.length > 0) {
      setTimeout(() => {
        const container = document.getElementById("nav-scroll");
        if (container) {
          const { scrollWidth, clientWidth } = container;
          setShowRightArrow(scrollWidth > clientWidth);
        }
      }, 100);
    }
  }, [categories]);

  // Categories are now loaded dynamically from the database via useEffect

  return (
    <nav className="bg-white shadow-soft sticky top-0 z-50">
      {/* Top Bar with Gradient */}
      <div className="bg-gradient-to-r from-primary-500 via-orange-500 to-pink-500 py-1.5">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between text-[10px] md:text-xs font-semibold text-white gap-1 md:gap-0">
            <div className="flex flex-col md:flex-row items-center md:gap-2 text-center md:text-left">
              <span>✨ COD Available at ₹60</span>
              <span className="hidden md:inline">|</span>
              <span>Extra Discounts on Prepaid Orders</span>
              <span className="hidden md:inline">|</span>
              <span>Free Shipping Above ₹999</span>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/contact"
                className="text-xs font-bold text-white hover:text-yellow-200 transition-colors"
              >
                Contact Us
              </Link>
              <Link
                href="/about"
                className="text-xs font-bold text-white hover:text-yellow-200 transition-colors"
              >
                About Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container-custom">
        <div className="flex items-center justify-between py-2 md:py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center">
              <Image
                src="/myplanetkidslogo.png"
                alt="MyPlanetKids"
                width={80}
                height={80}
                className="object-contain group-hover:scale-105 transition-transform"
              />
            </div>
          </Link>

          {/* Search Bar */}
          <div
            className="hidden md:flex flex-1 max-w-lg mx-6"
            ref={searchContainerRef}
          >
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() =>
                  searchQuery.trim().length >= 2 && setShowSuggestions(true)
                }
                placeholder="Search toys, learning kits, school essentials..."
                className="w-full px-4 py-2 pr-10 border-2 border-primary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-500 transition-all bg-orange-50 placeholder:text-gray-500 text-sm"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white p-1.5 rounded-lg hover:shadow-soft transition-all"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Search Suggestions Dropdown */}
              {showSuggestions && searchSuggestions && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-2xl border-2 border-gray-100 z-50 max-h-[500px] overflow-y-auto">
                  {loadingSuggestions ? (
                    <div className="p-4 text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                    </div>
                  ) : (
                    <div className="p-2">
                      {/* Products */}
                      {searchSuggestions.products &&
                        searchSuggestions.products.length > 0 && (
                          <div className="mb-2">
                            <div className="px-3 py-2 text-xs font-bold text-gray-500 uppercase">
                              Products
                            </div>
                            {searchSuggestions.products.map((product: any) => (
                              <Link
                                key={product.id}
                                href={`/products/${product.slug}`}
                                onClick={() => {
                                  setShowSuggestions(false);
                                  setSearchQuery("");
                                }}
                                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                              >
                                {product.image ? (
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-10 h-10 object-cover rounded"
                                  />
                                ) : (
                                  <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-lg">
                                    🧸
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-gray-900 truncate">
                                    {product.name}
                                  </div>
                                  <div className="text-xs text-primary-600 font-semibold">
                                    ₹{product.price.toLocaleString("en-IN")}
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}

                      {/* Categories */}
                      {searchSuggestions.categories &&
                        searchSuggestions.categories.length > 0 && (
                          <div className="mb-2">
                            <div className="px-3 py-2 text-xs font-bold text-gray-500 uppercase">
                              Categories
                            </div>
                            {searchSuggestions.categories.map(
                              (category: any) => (
                                <Link
                                  key={category.id}
                                  href={`/categories/${category.slug}`}
                                  onClick={() => {
                                    setShowSuggestions(false);
                                    setSearchQuery("");
                                  }}
                                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-2xl">
                                    {category.icon || "📦"}
                                  </div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {category.name}
                                  </div>
                                </Link>
                              ),
                            )}
                          </div>
                        )}

                      {/* Brands */}
                      {searchSuggestions.brands &&
                        searchSuggestions.brands.length > 0 && (
                          <div className="mb-2">
                            <div className="px-3 py-2 text-xs font-bold text-gray-500 uppercase">
                              Brands
                            </div>
                            {searchSuggestions.brands.map(
                              (brand: any, index: number) => (
                                <Link
                                  key={index}
                                  href={`/products?search=${encodeURIComponent(brand.name)}`}
                                  onClick={() => {
                                    setShowSuggestions(false);
                                    setSearchQuery("");
                                  }}
                                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <span className="text-xs font-bold text-gray-600">
                                      B
                                    </span>
                                  </div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {brand.name}
                                  </div>
                                </Link>
                              ),
                            )}
                          </div>
                        )}

                      {/* No results */}
                      {searchSuggestions.products?.length === 0 &&
                        searchSuggestions.categories?.length === 0 &&
                        searchSuggestions.brands?.length === 0 && (
                          <div className="px-3 py-6 text-center text-gray-500">
                            <p className="text-sm">
                              No results found for "{searchQuery}"
                            </p>
                          </div>
                        )}

                      {/* View All Results */}
                      {(searchSuggestions.products?.length > 0 ||
                        searchSuggestions.categories?.length > 0) && (
                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <Link
                            href={`/products?search=${encodeURIComponent(searchQuery)}`}
                            onClick={() => {
                              setShowSuggestions(false);
                            }}
                            className="block px-3 py-2 text-center text-sm font-semibold text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          >
                            View All Results for "{searchQuery}"
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative text-gray-600 hover:text-pink-500 transition-colors group"
            >
              <div className="p-1.5 md:p-2 rounded-lg hover:bg-pink-50 transition-all">
                <Heart className="w-5 h-5 md:w-6 md:h-6" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                    {wishlistCount}
                  </span>
                )}
              </div>
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative text-gray-600 hover:text-primary-600 transition-colors group"
            >
              <div className="p-1.5 md:p-2 rounded-lg hover:bg-primary-50 transition-all">
                <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>

            {/* Account */}
            {session?.user ? (
              <div className="relative group">
                <button className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-lavender-50 transition-all text-gray-700">
                  <div className="w-8 h-8 bg-gradient-to-br from-lavender-300 to-pink-300 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-700" />
                  </div>
                  <span className="text-sm font-semibold">
                    {session.user.name || "Account"}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-soft-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 border border-gray-100">
                  <Link
                    href="/account"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 rounded-xl mx-2 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      My Account
                    </div>
                  </Link>
                  <Link
                    href="/account?tab=orders"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 rounded-xl mx-2 transition-all"
                  >
                    My Orders
                  </Link>
                  <Link
                    href="/wishlist"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 rounded-xl mx-2 transition-all"
                  >
                    Wishlist
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl mx-2 flex items-center gap-2 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden lg:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white rounded-2xl hover:shadow-soft-lg transition-all transform hover:-translate-y-0.5 font-bold text-sm"
              >
                <User className="w-5 h-5" />
                <span>Login / Signup</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-gray-600 hover:text-primary-600 transition-colors p-2 hover:bg-primary-50 rounded-xl"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Category Navigation (Desktop) */}
      <div className="hidden lg:block bg-gradient-to-r from-primary-50 via-orange-50 to-pink-50 border-t border-gray-100 overflow-visible">
        <div className="container-custom overflow-visible">
          <div className="relative flex items-center py-3 overflow-visible">
            {/* Left Arrow */}
            {showLeftArrow && (
              <button
                onClick={() => {
                  const container = document.getElementById("nav-scroll");
                  if (container) container.scrollLeft -= 200;
                }}
                className="flex-shrink-0 p-2 mr-2 text-white bg-gradient-to-r from-primary-400 to-primary-500 hover:from-primary-500 hover:to-primary-600 transition-all shadow-soft rounded-full z-10"
                aria-label="Scroll left"
              >
                <ChevronDown className="w-5 h-5 rotate-90" />
              </button>
            )}

            {/* Scrollable Navigation */}
            <div
              id="nav-scroll"
              className="flex items-center gap-6 overflow-x-auto scrollbar-hide flex-1"
              style={{ scrollBehavior: "smooth", overflowY: "visible" }}
            >
              {categories.length === 0 ? (
                <div className="text-sm text-gray-500 font-semibold">
                  Loading categories...
                </div>
              ) : (
                categories.map((category, index) => (
                  <div
                    key={category.slug}
                    ref={(el) => {
                      buttonRefs.current[category.slug] = el;
                    }}
                    className="flex-shrink-0"
                  >
                    <button
                      onMouseEnter={() => handleMouseEnter(category.slug)}
                      onMouseLeave={handleMouseLeave}
                      className="flex items-center gap-1 text-sm font-bold text-gray-700 hover:text-primary-700 transition-colors whitespace-nowrap cursor-default px-3 py-1.5 rounded-xl hover:bg-white/60"
                    >
                      {category.name}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}

              {/* Shop By Age, Price */}
              <div
                ref={(el) => {
                  buttonRefs.current["shop-by"] = el;
                }}
                className="flex-shrink-0"
              >
                <button
                  onMouseEnter={() => handleMouseEnter("shop-by")}
                  onMouseLeave={handleMouseLeave}
                  className="flex items-center gap-1 text-sm font-bold text-gray-700 hover:text-primary-700 transition-colors whitespace-nowrap cursor-default px-3 py-1.5 rounded-xl hover:bg-white/60"
                >
                  Shop By Age, Price
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* New Arrivals */}
              <Link
                href="/new-arrivals"
                className="flex items-center gap-1 text-sm font-bold bg-gradient-to-r from-primary-500 to-orange-500 text-white px-4 py-1.5 rounded-2xl hover:shadow-soft transition-all transform hover:-translate-y-0.5 flex-shrink-0 whitespace-nowrap"
              >
                ✨ New Arrivals
              </Link>
            </div>

            {/* Right Arrow */}
            {showRightArrow && (
              <button
                onClick={() => {
                  const container = document.getElementById("nav-scroll");
                  if (container) container.scrollLeft += 200;
                }}
                className="flex-shrink-0 p-2 ml-2 text-white bg-gradient-to-r from-primary-400 to-primary-500 hover:from-primary-500 hover:to-primary-600 transition-all shadow-soft rounded-full z-10"
                aria-label="Scroll right"
              >
                <ChevronDown className="w-5 h-5 -rotate-90" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t">
          <div className="container-custom py-4">
            {/* Mobile Search */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full px-5 py-3 pr-12 border-2 border-primary-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-300 bg-primary-50/30"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Mobile Categories */}
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.slug}>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="block py-3 px-4 text-gray-700 hover:text-primary-700 hover:bg-primary-50 rounded-xl transition-all font-semibold"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                </div>
              ))}
              <Link
                href="/new-arrivals"
                className="block py-3 px-4 bg-gradient-to-r from-accent-400 to-accent-500 text-gray-800 rounded-xl font-bold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ✨ New Arrivals
              </Link>
            </div>

            {/* Quick Links */}
            <div className="pt-4 border-t space-y-2">
              <Link
                href="/contact"
                className="block py-3 px-4 text-gray-700 hover:text-primary-700 hover:bg-primary-50 rounded-xl transition-all font-semibold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact Us
              </Link>
              <Link
                href="/about"
                className="block py-3 px-4 text-gray-700 hover:text-primary-700 hover:bg-primary-50 rounded-xl transition-all font-semibold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About Us
              </Link>
            </div>

            {/* Mobile Account */}
            <div className="pt-4 border-t mt-4">
              <Link
                href="/account"
                className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:text-primary-700 hover:bg-primary-50 rounded-xl transition-all font-semibold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="w-5 h-5" />
                My Account
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Dropdown Portal */}
      {mounted &&
        activeDropdown &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed bg-white shadow-2xl border border-gray-200 rounded-xl z-[100] min-w-[240px] max-w-[300px] transition-all duration-200 overflow-hidden"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
            }}
            onMouseEnter={handleDropdownEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="py-1 max-h-[70vh] overflow-y-auto">
              {activeDropdown === "shop-by" ? (
                <>
                  <div className="px-4 py-2 text-xs font-black text-gray-500 uppercase tracking-wider bg-gray-50">
                    Shop by Age
                  </div>
                  <Link
                    href="/age/0-2"
                    className="block px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                  >
                    0-2 Years
                  </Link>
                  <Link
                    href="/age/3-5"
                    className="block px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                  >
                    3-5 Years
                  </Link>
                  <Link
                    href="/age/6-8"
                    className="block px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                  >
                    6-8 Years
                  </Link>
                  <Link
                    href="/age/9-12"
                    className="block px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                  >
                    9-12 Years
                  </Link>
                  <div className="border-t border-gray-200 my-1"></div>
                  <div className="px-4 py-2 text-xs font-black text-gray-500 uppercase tracking-wider bg-gray-50">
                    Shop by Price
                  </div>
                  <Link
                    href="/price/under-500"
                    className="block px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-success-50 hover:text-success-700 transition-colors"
                  >
                    Under ₹500
                  </Link>
                  <Link
                    href="/price/500-1000"
                    className="block px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-success-50 hover:text-success-700 transition-colors"
                  >
                    ₹500 - ₹1000
                  </Link>
                  <Link
                    href="/price/1000-2000"
                    className="block px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-success-50 hover:text-success-700 transition-colors"
                  >
                    ₹1000 - ₹2000
                  </Link>
                  <Link
                    href="/price/above-2000"
                    className="block px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-success-50 hover:text-success-700 transition-colors"
                  >
                    Above ₹2000
                  </Link>
                </>
              ) : (
                categories
                  .find((cat) => cat.slug === activeDropdown)
                  ?.subcategories.map((sub) => (
                    <Link
                      key={sub.slug}
                      href={`/categories/${sub.slug}`}
                      className="block px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                    >
                      {sub.name}
                    </Link>
                  ))
              )}
            </div>
          </div>,
          document.body,
        )}
    </nav>
  );
}
