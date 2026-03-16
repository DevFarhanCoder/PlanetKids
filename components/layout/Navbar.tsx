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
  ChevronRight,
  LogOut,
  ArrowLeft,
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
  const mobileSearchContainerRef = useRef<HTMLDivElement | null>(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

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
      }, 200);
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
      const target = event.target as Node;
      const outsideDesktop =
        searchContainerRef.current &&
        !searchContainerRef.current.contains(target);
      const outsideMobile =
        mobileSearchContainerRef.current &&
        !mobileSearchContainerRef.current.contains(target);
      if (outsideDesktop && outsideMobile) {
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
      // Don't check immediately — categories haven't loaded yet; let the categories effect handle initial state
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Check arrows when categories load — wait for DOM to fully render the buttons
  useEffect(() => {
    if (categories.length > 0) {
      // rAF ensures we're past the current paint, then a small delay ensures layout is settled
      requestAnimationFrame(() => {
        setTimeout(() => {
          const container = document.getElementById("nav-scroll");
          if (container) {
            const { scrollWidth, clientWidth } = container;
            setShowRightArrow(scrollWidth > clientWidth);
          }
        }, 200);
      });
    }
  }, [categories]);

  // Categories are now loaded dynamically from the database via useEffect

  // Announcement carousel
  const announcements = [
    "✨ COD Available at ₹60",
    "🎁 Extra Discounts on Prepaid Orders",
    "🚚 Free Shipping Above ₹999",
    "🔄 7-Day Easy Returns",
    "💳 EMI Available on Orders Above ₹999",
  ];
  const [announcementIndex, setAnnouncementIndex] = React.useState(0);
  const [announcementFade, setAnnouncementFade] = React.useState(true);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setAnnouncementFade(false);
      setTimeout(() => {
        setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
        setAnnouncementFade(true);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="bg-white shadow-soft sticky top-0 z-50">
      {/* Top Bar with Gradient - Announcement Carousel */}
      <div className="bg-black py-2">
        <div className="container-custom">
          <div className="flex items-center justify-center">
            <div
              className="transition-opacity duration-300 text-center text-[11px] md:text-sm font-bold text-white tracking-wide"
              style={{ opacity: announcementFade ? 1 : 0 }}
            >
              {announcements[announcementIndex]}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container-custom">
        <div className="flex items-center justify-between py-2 md:py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center">
              <Image
                src="/myplanetkidslogo.png"
                alt="MyPlanetKids"
                width={112}
                height={112}
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
                onFocus={() => setShowSuggestions(true)}
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
              {showSuggestions && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowSuggestions(false)}
                  />
                  <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[500px] overflow-y-auto">
                    {!searchQuery ? (
                      /* Show categories when no query */
                      <div className="p-3">
                        <div className="px-2 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                          Browse Categories
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          {categories.slice(0, 10).map((cat) => (
                            <Link
                              key={cat.slug}
                              href={`/categories/${cat.slug}`}
                              onClick={() => {
                                setShowSuggestions(false);
                                setSearchQuery("");
                              }}
                              className="flex items-center justify-between px-3 py-2 border border-gray-100 rounded-lg text-xs font-medium text-gray-700 hover:border-orange-300 hover:bg-orange-50 transition-colors"
                            >
                              <span className="truncate pr-1">{cat.name}</span>
                              <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                            </Link>
                          ))}
                        </div>
                        <div className="mt-3 pt-2 border-t border-gray-100">
                          <p className="px-2 pb-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                            Shop by Age
                          </p>
                          <div className="flex flex-wrap gap-1.5 px-1">
                            {[
                              { label: "0-2 Yrs", href: "/age/0-2" },
                              { label: "3-5 Yrs", href: "/age/3-5" },
                              { label: "6-8 Yrs", href: "/age/6-8" },
                              { label: "9-12 Yrs", href: "/age/9-12" },
                              { label: "12+ Yrs", href: "/age/12plus" },
                            ].map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => {
                                  setShowSuggestions(false);
                                  setSearchQuery("");
                                }}
                                className="px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-full text-xs font-semibold text-orange-700 hover:bg-orange-100 transition-colors"
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : loadingSuggestions ? (
                      <div className="p-4 text-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                      </div>
                    ) : searchSuggestions ? (
                      <div className="p-2">
                        {/* Products */}
                        {searchSuggestions.products &&
                          searchSuggestions.products.length > 0 && (
                            <div className="mb-2">
                              <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                Products
                              </div>
                              {searchSuggestions.products.map(
                                (product: any) => (
                                  <Link
                                    key={product.id}
                                    href={`/products/${product.slug}`}
                                    onClick={() => {
                                      setShowSuggestions(false);
                                      setSearchQuery("");
                                    }}
                                    className="flex items-center gap-3 px-3 py-2 hover:bg-orange-50 rounded-lg transition-colors"
                                  >
                                    {product.image ? (
                                      <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                                      />
                                    ) : (
                                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                                        🧸
                                      </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <div className="text-sm font-semibold text-gray-900 truncate">
                                        {product.name}
                                      </div>
                                      <div className="text-xs text-orange-600 font-bold">
                                        ₹{product.price.toLocaleString("en-IN")}
                                      </div>
                                    </div>
                                    <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                  </Link>
                                ),
                              )}
                            </div>
                          )}

                        {/* Categories */}
                        {searchSuggestions.categories &&
                          searchSuggestions.categories.length > 0 && (
                            <div className="mb-2">
                              <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
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
                                    className="flex items-center gap-3 px-3 py-2 hover:bg-orange-50 rounded-lg transition-colors"
                                  >
                                    <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                                      {category.icon || "📦"}
                                    </div>
                                    <div className="flex-1 text-sm font-semibold text-gray-900">
                                      {category.name}
                                    </div>
                                    <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                  </Link>
                                ),
                              )}
                            </div>
                          )}

                        {/* Brands */}
                        {searchSuggestions.brands &&
                          searchSuggestions.brands.length > 0 && (
                            <div className="mb-2">
                              <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
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
                                    className="flex items-center gap-3 px-3 py-2 hover:bg-orange-50 rounded-lg transition-colors"
                                  >
                                    <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                      <span className="text-xs font-bold text-gray-600">
                                        B
                                      </span>
                                    </div>
                                    <div className="flex-1 text-sm font-semibold text-gray-900">
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
                              <div className="text-3xl mb-2">🔍</div>
                              <p className="text-sm font-medium">
                                No results found for &quot;{searchQuery}&quot;
                              </p>
                            </div>
                          )}

                        {/* View All Results */}
                        {(searchSuggestions.products?.length > 0 ||
                          searchSuggestions.categories?.length > 0) && (
                          <div className="border-t border-gray-100 mt-2 pt-2">
                            <Link
                              href={`/products?search=${encodeURIComponent(searchQuery)}`}
                              onClick={() => setShowSuggestions(false)}
                              className="block px-3 py-2 text-center text-sm font-bold text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            >
                              View All Results for &quot;{searchQuery}&quot; →
                            </Link>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                </>
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

      {/* Mobile Search Bar - Tap to Open Full Screen Overlay */}
      <div className="lg:hidden bg-white border-t border-orange-100 px-4 py-2.5">
        <button
          onClick={() => setMobileSearchOpen(true)}
          className="w-full flex items-center gap-2 pl-4 pr-4 py-2.5 border-2 border-orange-200 rounded-full bg-orange-50 text-sm text-gray-400 text-left"
        >
          <Search className="w-4 h-4 text-orange-400 flex-shrink-0" />
          <span>Search toys, games, learning kits...</span>
        </button>
      </div>

      {/* Category Navigation (Desktop) */}
      <div className="hidden lg:block bg-gradient-to-r from-primary-50 via-orange-50 to-pink-50 border-t border-gray-100">
        <div className="container-custom">
          <div className="relative flex items-center">
            {/* Left Arrow */}
            {showLeftArrow && (
              <button
                onClick={() => {
                  const container = document.getElementById("nav-scroll");
                  if (container) container.scrollLeft -= 300;
                }}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center mr-1 text-white bg-orange-500 hover:bg-orange-600 transition-colors shadow-soft rounded-full z-10"
                aria-label="Scroll left"
              >
                <ChevronDown className="w-4 h-4 rotate-90" />
              </button>
            )}

            {/* Scrollable Navigation */}
            <div
              id="nav-scroll"
              className="flex items-center gap-1 overflow-x-auto scrollbar-hide flex-1 py-2.5"
              style={{ scrollBehavior: "smooth" }}
            >
              {categories.length === 0 ? (
                <div className="text-sm text-gray-500 font-semibold px-2">
                  Loading categories...
                </div>
              ) : (
                categories.map((category) => (
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
                      <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" />
                    </button>
                  </div>
                ))
              )}

              {/* Shop By Age */}
              <div
                ref={(el) => {
                  buttonRefs.current["shop-by"] = el;
                }}
                className="flex-shrink-0"
              >
                <button
                  onMouseEnter={() => handleMouseEnter("shop-by")}
                  onMouseLeave={handleMouseLeave}
                  className="flex items-center gap-1 text-sm font-bold text-primary-700 hover:text-primary-800 transition-colors whitespace-nowrap cursor-default px-3 py-1.5 rounded-xl hover:bg-white/60 ml-1"
                >
                  🎂 Shop By Age
                  <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" />
                </button>
              </div>

              {/* New Arrivals */}
              <Link
                href="/new-arrivals"
                className="flex-shrink-0 flex items-center gap-1 text-sm font-bold bg-gradient-to-r from-primary-500 to-orange-500 text-white px-4 py-1.5 rounded-2xl hover:shadow-soft transition-all transform hover:-translate-y-0.5 whitespace-nowrap ml-2"
              >
                ✨ New Arrivals
              </Link>
            </div>

            {/* Right Arrow */}
            {showRightArrow && (
              <button
                onClick={() => {
                  const container = document.getElementById("nav-scroll");
                  if (container) container.scrollLeft += 300;
                }}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center ml-1 text-white bg-orange-500 hover:bg-orange-600 transition-colors shadow-soft rounded-full z-10"
                aria-label="Scroll right"
              >
                <ChevronDown className="w-4 h-4 -rotate-90" />
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

      {/* Mobile Full-Screen Search Overlay */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 z-[300] bg-white flex flex-col lg:hidden">
          {/* Search Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white shadow-sm">
            <button
              onClick={() => {
                setMobileSearchOpen(false);
                setSearchQuery("");
                setShowSuggestions(false);
              }}
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div className="flex-1 relative">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    setMobileSearchOpen(false);
                    window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
                  }
                }}
                placeholder="Search for products, brands and more"
                className="w-full pl-3 pr-8 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-400 bg-gray-50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  aria-label="Clear"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto bg-white">
            {!searchQuery ? (
              /* Category chips when no search */
              <div className="p-4">
                <p className="text-xs text-gray-400 font-semibold mb-3 uppercase tracking-wider">
                  Browse Categories
                </p>
                {categories.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/categories/${cat.slug}`}
                        onClick={() => {
                          setMobileSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="flex items-center justify-between px-3 py-2.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:border-orange-300 hover:bg-orange-50 transition-colors"
                      >
                        <span className="truncate pr-1 leading-tight">
                          {cat.name}
                        </span>
                        <ChevronRight className="w-3 h-3 flex-shrink-0 text-gray-400 ml-0.5" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-20">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-400" />
                  </div>
                )}

                {/* Quick Age Links */}
                <p className="text-xs text-gray-400 font-semibold mt-5 mb-3 uppercase tracking-wider">
                  Shop by Age
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "👶 0-2 Years", href: "/age/0-2" },
                    { label: "🧒 3-5 Years", href: "/age/3-5" },
                    { label: "👧 6-8 Years", href: "/age/6-8" },
                    { label: "👦 9-12 Years", href: "/age/9-12" },
                    { label: "🧑 12+ Years", href: "/age/12plus" },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => {
                        setMobileSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className="px-4 py-2 bg-orange-50 border border-orange-200 rounded-full text-xs font-semibold text-orange-700 hover:bg-orange-100 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : loadingSuggestions ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-400" />
              </div>
            ) : searchSuggestions ? (
              <div className="p-3">
                {/* Products */}
                {searchSuggestions.products &&
                  searchSuggestions.products.length > 0 && (
                    <div className="mb-4">
                      <div className="px-2 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Products
                      </div>
                      {searchSuggestions.products.map((product: any) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.slug}`}
                          onClick={() => {
                            setMobileSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="flex items-center gap-3 px-2 py-2.5 hover:bg-orange-50 rounded-xl transition-colors"
                        >
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                              🧸
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-gray-900 truncate">
                              {product.name}
                            </div>
                            <div className="text-xs text-orange-600 font-bold">
                              ₹{product.price.toLocaleString("en-IN")}
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        </Link>
                      ))}
                    </div>
                  )}

                {/* Categories */}
                {searchSuggestions.categories &&
                  searchSuggestions.categories.length > 0 && (
                    <div className="mb-4">
                      <div className="px-2 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Categories
                      </div>
                      {searchSuggestions.categories.map((cat: any) => (
                        <Link
                          key={cat.id}
                          href={`/categories/${cat.slug}`}
                          onClick={() => {
                            setMobileSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="flex items-center gap-3 px-2 py-2.5 hover:bg-orange-50 rounded-xl transition-colors"
                        >
                          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                            {cat.icon || "📦"}
                          </div>
                          <div className="flex-1 text-sm font-semibold text-gray-900">
                            {cat.name}
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        </Link>
                      ))}
                    </div>
                  )}

                {/* No results */}
                {searchSuggestions.products?.length === 0 &&
                  searchSuggestions.categories?.length === 0 && (
                    <div className="px-2 py-8 text-center text-gray-500">
                      <div className="text-4xl mb-3">🔍</div>
                      <p className="text-sm font-medium">
                        No results for &quot;{searchQuery}&quot;
                      </p>
                    </div>
                  )}

                {/* View All Results */}
                {(searchSuggestions.products?.length > 0 ||
                  searchSuggestions.categories?.length > 0) && (
                  <Link
                    href={`/products?search=${encodeURIComponent(searchQuery)}`}
                    onClick={() => setMobileSearchOpen(false)}
                    className="block w-full py-3.5 text-center text-sm font-bold text-white bg-gradient-to-r from-orange-400 to-pink-500 rounded-xl shadow-md mt-2"
                  >
                    View All Results for &quot;{searchQuery}&quot; →
                  </Link>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </nav>
  );
}
