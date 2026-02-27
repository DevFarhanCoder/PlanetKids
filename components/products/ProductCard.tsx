"use client";

import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  discount?: number;
  inStock?: boolean;
}

export default function ProductCard({
  id,
  name,
  slug,
  price,
  originalPrice,
  image,
  rating = 0,
  reviewCount = 0,
  isNew = false,
  discount,
  inStock = true,
}: ProductCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

  // Check if product is in wishlist
  useEffect(() => {
    if (session?.user) {
      checkWishlistStatus();
    }
  }, [session, id]);

  const checkWishlistStatus = async () => {
    try {
      const response = await fetch("/api/wishlist");
      if (response.ok) {
        const wishlist = await response.json();
        const isInWishlist = wishlist.some(
          (item: any) => item.productId === id,
        );
        setIsWishlisted(isInWishlist);
      }
    } catch (error) {
      console.error("Error checking wishlist:", error);
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user) {
      router.push(
        "/login?callbackUrl=" + encodeURIComponent(window.location.pathname),
      );
      return;
    }

    setIsTogglingWishlist(true);

    try {
      if (isWishlisted) {
        // Remove from wishlist
        const response = await fetch(`/api/wishlist?productId=${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setIsWishlisted(false);
        }
      } else {
        // Add to wishlist
        const response = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: id }),
        });

        if (response.ok) {
          setIsWishlisted(true);
        }
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user) {
      router.push(
        "/login?callbackUrl=" + encodeURIComponent(window.location.pathname),
      );
      return;
    }

    setIsAddingToCart(true);

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id, quantity: 1 }),
      });

      if (response.ok) {
        // Trigger cart update event
        window.dispatchEvent(new Event("cartUpdated"));
        alert("Added to cart successfully!");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <Link href={`/products/${slug}`} className="product-card group">
      <div className="relative aspect-square bg-gradient-to-br from-primary-100 to-orange-100 rounded-t-3xl overflow-hidden">
        {/* Image Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-7xl transform group-hover:scale-110 transition-transform duration-500">
            {image}
          </span>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew && <div className="badge-new">✨ NEW</div>}
          {discount && discount > 0 && (
            <div className="badge-sale">🔥 {discount}% OFF</div>
          )}
          {!inStock && (
            <div className="bg-gray-900 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-md">
              OUT OF STOCK
            </div>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          disabled={isTogglingWishlist}
          className={`absolute top-3 right-3 w-11 h-11 rounded-2xl flex items-center justify-center transition-all shadow-soft ${
            isWishlisted
              ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white scale-110"
              : "bg-white text-gray-600 hover:bg-pink-50 hover:text-pink-500 hover:scale-110"
          }`}
          aria-label="Add to wishlist"
        >
          <Heart
            className="w-5 h-5"
            fill={isWishlisted ? "currentColor" : "none"}
          />
        </button>

        {/* Quick Add to Cart (visible on hover) */}
        {inStock && (
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="absolute bottom-3 left-3 right-3 btn-secondary py-3 text-sm opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2 shadow-soft-lg"
          >
            <ShoppingCart className="w-4 h-4" />
            {isAddingToCart ? "Adding..." : "Add to Cart"}
          </button>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        <h3 className="font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-primary-700 transition-colors leading-snug text-base">
          {name}
        </h3>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < rating
                    ? "fill-accent-400 text-accent-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
            {reviewCount > 0 && (
              <span className="text-sm text-gray-500 font-semibold ml-1">
                ({reviewCount})
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-orange-600">
            ₹{price.toLocaleString("en-IN")}
          </span>
          {originalPrice && originalPrice > price && (
            <>
              <span className="text-sm text-gray-400 line-through font-semibold">
                ₹{originalPrice.toLocaleString("en-IN")}
              </span>
              {discount && (
                <span className="text-xs font-black text-success-700 bg-success-100 px-2 py-1 rounded-full">
                  Save {discount}%
                </span>
              )}
            </>
          )}
        </div>

        {/* Return Policy Badge */}
        <div className="flex items-center gap-1.5 text-xs text-green-600 font-semibold">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          7-Day Return Policy
        </div>
      </div>
    </Link>
  );
}
