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
  const buttonRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      <div className="bg-gradient-to-r from-primary-500 via-orange-500 to-pink-500 py-2">
        <div className="container-custom">
          <div className="flex items-center justify-between text-xs font-semibold text-white">
            <span className="flex items-center gap-2">
              <span className="hidden sm:inline">✨ COD Available at ₹60</span>
              <span className="hidden md:inline">
                | Extra Discounts on Prepaid Orders
              </span>
              <span>| Free Shipping Above ₹999</span>
            </span>
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
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <Image
                src="/myplanetkidslogo.png"
                alt="MyPlanetKids"
                width={48}
                height={48}
                className="object-contain group-hover:scale-105 transition-transform"
              />
            </div>
            <div>
              <h1
                className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600"
                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
              >
                MyPlanetKids
              </h1>
              <p className="text-xs font-semibold text-gray-500">
                Where Joy Meets Learning
              </p>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search toys, learning kits, school essentials..."
                className="w-full px-5 py-3 pr-12 border-2 border-primary-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-500 transition-all bg-orange-50 placeholder:text-gray-500"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white p-2 rounded-xl hover:shadow-soft transition-all">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative text-gray-600 hover:text-pink-500 transition-colors group"
            >
              <div className="p-2 rounded-xl hover:bg-pink-50 transition-all">
                <Heart className="w-6 h-6" />
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
              <div className="p-2 rounded-xl hover:bg-primary-50 transition-all">
                <ShoppingCart className="w-6 h-6" />
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
