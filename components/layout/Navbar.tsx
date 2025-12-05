'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Search, ShoppingCart, Heart, User, Menu, X, ChevronDown } from 'lucide-react';

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
  const [categories, setCategories] = useState<Category[]>([]);
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
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
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
                  slug: sub.slug
                }))
            }));
          setCategories(formattedCategories);
        }
      })
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  useEffect(() => {
    if (activeDropdown && buttonRefs.current[activeDropdown]) {
      const button = buttonRefs.current[activeDropdown];
      const rect = button.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setDropdownPosition({
        top: rect.bottom + scrollTop + 4,
        left: rect.left
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
      const container = document.getElementById('nav-scroll');
      if (container) {
        const { scrollLeft, scrollWidth, clientWidth } = container;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
      }
    };

    const container = document.getElementById('nav-scroll');
    if (container) {
      container.addEventListener('scroll', handleScroll);
      // Initial check
      handleScroll();
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Check arrows when categories load
  useEffect(() => {
    if (categories.length > 0) {
      setTimeout(() => {
        const container = document.getElementById('nav-scroll');
        if (container) {
          const { scrollWidth, clientWidth } = container;
          setShowRightArrow(scrollWidth > clientWidth);
        }
      }, 100);
    }
  }, [categories]);

  // Categories are now loaded dynamically from the database via useEffect

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-primary text-white py-1.5">
        <div className="container-custom">
          <div className="flex items-center justify-center text-xs">
            <span>✨ COD Available at ₹60 | Extra Discounts on Prepaid Orders | Free Shipping on Orders Above ₹999</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container-custom">
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
              🌍
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">PlanetKids</h1>
              <p className="text-xs text-gray-500">Explore, Learn & Play</p>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for toys, learning kits, school essentials..."
                className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            {/* Wishlist */}
            <Link href="/wishlist" className="relative text-gray-600 hover:text-primary transition-colors">
              <Heart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative text-gray-600 hover:text-primary transition-colors">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>

            {/* Account */}
            <Link href="/account" className="hidden lg:flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
              <User className="w-5 h-5" />
              <span className="text-sm">Account</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-gray-600 hover:text-primary transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Category Navigation (Desktop) */}
      <div className="hidden lg:block bg-gray-50 border-t overflow-visible">
        <div className="container-custom overflow-visible">
          <div className="relative flex items-center py-3 overflow-visible">
            {/* Left Arrow */}
            {showLeftArrow && (
              <button 
                onClick={() => {
                  const container = document.getElementById('nav-scroll');
                  if (container) container.scrollLeft -= 200;
                }}
                className="flex-shrink-0 p-2 mr-2 text-white bg-primary hover:bg-primary/80 transition-colors shadow-md rounded-full z-10"
                aria-label="Scroll left"
              >
                <ChevronDown className="w-5 h-5 rotate-90" />
              </button>
            )}

            {/* Scrollable Navigation */}
            <div 
              id="nav-scroll"
              className="flex items-center gap-6 overflow-x-auto scrollbar-hide flex-1"
              style={{ scrollBehavior: 'smooth', overflowY: 'visible' }}
            >
              {categories.length === 0 ? (
                <div className="text-sm text-gray-500">Loading categories...</div>
              ) : (
                categories.map((category, index) => (
                  <div
                    key={category.slug}
                    ref={(el) => { buttonRefs.current[category.slug] = el; }}
                    className="flex-shrink-0"
                  >
                    <button
                      onMouseEnter={() => handleMouseEnter(category.slug)}
                      onMouseLeave={handleMouseLeave}
                      className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-primary transition-colors whitespace-nowrap cursor-default"
                    >
                      {category.name}
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}

              {/* Shop By Age, Price */}
              <div
                ref={(el) => { buttonRefs.current['shop-by'] = el; }}
                className="flex-shrink-0"
              >
                <button 
                  onMouseEnter={() => handleMouseEnter('shop-by')}
                  onMouseLeave={handleMouseLeave}
                  className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-primary transition-colors whitespace-nowrap cursor-default"
                >
                  Shop By Age, Price
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>

              {/* New Arrivals */}
              <Link
                href="/new-arrivals"
                className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors flex-shrink-0 whitespace-nowrap"
              >
                ✨ New Arrivals
              </Link>
            </div>

            {/* Right Arrow */}
            {showRightArrow && (
              <button 
                onClick={() => {
                  const container = document.getElementById('nav-scroll');
                  if (container) container.scrollLeft += 200;
                }}
                className="flex-shrink-0 p-2 ml-2 text-white bg-primary hover:bg-primary/80 transition-colors shadow-md rounded-full z-10"
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
                  className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Mobile Categories */}
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.slug}>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="block py-2 text-gray-700 hover:text-primary transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                </div>
              ))}
              <Link
                href="/new-arrivals"
                className="block py-2 text-primary font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ✨ New Arrivals
              </Link>
            </div>

            {/* Mobile Account */}
            <div className="pt-4 border-t mt-4">
              <Link
                href="/account"
                className="flex items-center gap-3 py-2 text-gray-700 hover:text-primary transition-colors font-medium"
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
      {mounted && activeDropdown && createPortal(
        <div 
          ref={dropdownRef}
          className="fixed bg-white shadow-lg border border-gray-200 rounded-md z-[9999] min-w-[280px] transition-all duration-200"
          style={{ top: `${dropdownPosition.top}px`, left: `${dropdownPosition.left}px` }}
          onMouseEnter={handleDropdownEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="py-3">
            {activeDropdown === 'shop-by' ? (
              <>
                <div className="px-6 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Age</div>
                <Link href="/age/0-2" className="block px-6 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                  0-2 Years
                </Link>
                <Link href="/age/3-5" className="block px-6 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                  3-5 Years
                </Link>
                <Link href="/age/6-8" className="block px-6 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                  6-8 Years
                </Link>
                <Link href="/age/9-12" className="block px-6 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                  9-12 Years
                </Link>
                <div className="border-t my-2"></div>
                <div className="px-6 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Price</div>
                <Link href="/price/under-500" className="block px-6 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                  Under ₹500
                </Link>
                <Link href="/price/500-1000" className="block px-6 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                  ₹500 - ₹1000
                </Link>
                <Link href="/price/1000-2000" className="block px-6 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                  ₹1000 - ₹2000
                </Link>
                <Link href="/price/above-2000" className="block px-6 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                  Above ₹2000
                </Link>
              </>
            ) : (
              categories.find(cat => cat.slug === activeDropdown)?.subcategories.map((sub) => (
                <Link
                  key={sub.slug}
                  href={`/categories/${sub.slug}`}
                  className="block px-6 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                >
                  {sub.name}
                </Link>
              ))
            )}
          </div>
        </div>,
        document.body
      )}
    </nav>
  );
}
