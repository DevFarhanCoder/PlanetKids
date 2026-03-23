"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  ShoppingCart,
  Star,
  Minus,
  Plus,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  price: number;
  compareAtPrice: number | null;
  shippingCharge: number;
  isBranded: boolean;
  sku: string | null;
  barcode: string | null;
  quantity: number;
  brand: string | null;
  weight: number | null;
  dimensions: string | null;
  ageGroup: string | null;
  isReturnable: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  averageRating: number;
  reviewCount: number;
  images: Array<{ id: string; url: string; altText: string | null }>;
  categories: Array<{
    category: {
      id: string;
      name: string;
      slug: string;
      parent: { name: string } | null;
    };
  }>;
  variants: any[];
  productLinks: Array<{
    linkedProductId: string;
    label: string | null;
    linkedProduct: {
      id: string;
      name: string;
      slug: string;
      images: Array<{ url: string }>;
    };
  }>;
}

interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  averageRating: number;
  reviewCount: number;
  isFeatured: boolean;
  images: Array<{ url: string }>;
}

interface Props {
  product: Product;
  relatedProducts: RelatedProduct[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "description" | "details" | "shipping"
  >("description");
  const [addingToCart, setAddingToCart] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Load wishlist status on mount
  useEffect(() => {
    if (!session) return;
    fetch("/api/wishlist")
      .then((r) => r.json())
      .then((items: any[]) => {
        if (Array.isArray(items)) {
          setIsWishlisted(items.some((i) => i.productId === product.id));
        }
      })
      .catch(() => {});
  }, [session, product.id]);

  const handleWishlist = async () => {
    if (!session) {
      router.push(
        "/login?callbackUrl=" + encodeURIComponent(window.location.pathname),
      );
      return;
    }
    setWishlistLoading(true);
    try {
      if (isWishlisted) {
        await fetch(`/api/wishlist?productId=${product.id}`, {
          method: "DELETE",
        });
        setIsWishlisted(false);
      } else {
        await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id }),
        });
        setIsWishlisted(true);
      }
    } catch {
      // silent fail
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const W = container.clientWidth;
    const itemW = W * 0.85 + 8;
    const idx = Math.round(container.scrollLeft / itemW);
    setSelectedImage(Math.max(0, Math.min(idx, product.images.length - 1)));
  };

  const scrollToImage = (i: number) => {
    const container = carouselRef.current;
    if (!container) return;
    const W = container.clientWidth;
    const itemW = W * 0.85 + 8;
    container.scrollTo({ left: i * itemW, behavior: "smooth" });
    setSelectedImage(i);
  };

  const discount = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) *
          100,
      )
    : 0;

  const mainCategory =
    product.categories[0]?.category.parent?.name ||
    product.categories[0]?.category.name ||
    "Products";

  const handleAddToCart = async () => {
    if (!session) {
      router.push(
        "/login?callbackUrl=" + encodeURIComponent(window.location.pathname),
      );
      return;
    }

    setAddingToCart(true);
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          quantity: quantity,
        }),
      });

      if (response.ok) {
        // Dispatch cart updated event
        window.dispatchEvent(new Event("cartUpdated"));

        // Show success message
        alert("✅ Product added to cart successfully!");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add product to cart. Please try again.");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!session) {
      router.push(
        "/login?callbackUrl=" + encodeURIComponent(window.location.pathname),
      );
      return;
    }

    // Add to cart first
    await handleAddToCart();

    // Redirect to cart page
    router.push("/cart");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-primary">
              Products
            </Link>
            <span>/</span>
            <span className="hover:text-primary">{mainCategory}</span>
            <span>/</span>
            <span className="text-gray-900 font-medium line-clamp-1">
              {product.name}
            </span>
          </div>
        </div>
      </div>

      <div className="container-custom pt-2 pb-8">
        {/* Back Button */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-2 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-12">
          {/* Product Images */}
          <div>
            {/* ── MOBILE: peek swipe carousel (CSS scroll-snap) ── */}
            <div className="lg:hidden -mx-4 sm:-mx-6">
              {/* Badges row above carousel */}
              <div className="flex items-center gap-2 px-4 sm:px-6 mb-2 h-6">
                {product.isNewArrival && (
                  <span className="bg-blue-500 text-white px-2.5 py-0.5 rounded-full text-xs font-semibold">
                    NEW
                  </span>
                )}
                {discount > 0 && (
                  <span className="bg-red-500 text-white px-2.5 py-0.5 rounded-full text-xs font-semibold">
                    {discount}% OFF
                  </span>
                )}
              </div>

              {/* Scroll container — peek 7.5% on each side */}
              <div
                ref={carouselRef}
                className="flex overflow-x-auto scrollbar-hide"
                style={
                  {
                    scrollSnapType: "x mandatory",
                    WebkitOverflowScrolling: "touch",
                  } as React.CSSProperties
                }
                onScroll={handleScroll}
              >
                {product.images.length > 0 ? (
                  product.images.map((image, index) => (
                    <div
                      key={image.id}
                      className="flex-shrink-0"
                      style={{
                        width: "85%",
                        scrollSnapAlign: "center",
                        marginLeft: index === 0 ? "7.5%" : "4px",
                        marginRight:
                          index === product.images.length - 1 ? "7.5%" : "4px",
                      }}
                    >
                      <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-gray-100">
                        <Image
                          src={image.url}
                          alt={image.altText || product.name}
                          fill
                          className="object-contain p-4"
                          priority={index === 0}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="w-full aspect-square flex items-center justify-center text-8xl bg-white rounded-2xl mx-[7.5%]">
                    📦
                  </div>
                )}
              </div>

              {/* Dot indicators */}
              {product.images.length > 1 && (
                <div className="flex justify-center gap-1.5 mt-3">
                  {product.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => scrollToImage(i)}
                      className={`rounded-full transition-all ${
                        i === selectedImage
                          ? "w-5 h-2 bg-primary"
                          : "w-2 h-2 bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* ── DESKTOP: vertical thumbnail strip + main image ── */}
            <div className="hidden lg:flex gap-3">
              {/* Vertical thumbnails */}
              {product.images.length > 1 && (
                <div className="flex flex-col gap-2 overflow-y-auto max-h-[500px] w-20 flex-shrink-0 scrollbar-thin scrollbar-thumb-gray-300">
                  {product.images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square w-full rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                        selectedImage === index
                          ? "border-primary shadow-md"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <Image
                        src={image.url}
                        alt={image.altText || `${product.name} ${index + 1}`}
                        fill
                        className="object-contain p-1"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main image */}
              <div className="relative aspect-square flex-1 bg-white rounded-2xl overflow-hidden border border-gray-200">
                {product.images.length > 0 ? (
                  <Image
                    src={
                      product.images[selectedImage]?.url ||
                      product.images[0].url
                    }
                    alt={product.images[selectedImage]?.altText || product.name}
                    fill
                    className="object-contain p-8"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-8xl">
                    📦
                  </div>
                )}
                {product.isNewArrival && (
                  <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    NEW
                  </div>
                )}
                {discount > 0 && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {discount}% OFF
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <div>
              {/* Brand */}
              {product.brand && (
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                  by {product.brand}
                </p>
              )}
              <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(product.averageRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.averageRating.toFixed(1)} ({product.reviewCount}{" "}
                  reviews)
                </span>
              </div>

              {/* Category Badges */}
              <div className="flex flex-wrap gap-2 mb-2">
                {product.categories.map((pc) => (
                  <Link
                    key={pc.category.id}
                    href={`/categories/${pc.category.slug}`}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-primary hover:text-white transition-colors"
                  >
                    {pc.category.parent ? `${pc.category.parent.name} → ` : ""}
                    {pc.category.name}
                  </Link>
                ))}
              </div>

              {/* Short Description */}
              {product.shortDescription && (
                <p className="text-gray-600 leading-relaxed">
                  {product.shortDescription}
                </p>
              )}

              {/* Linked Product Variants (same item, different colour/style) */}
              {product.productLinks && product.productLinks.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Also available in:
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    {/* Current product card */}
                    <div className="flex flex-col items-center gap-1 w-16">
                      <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-primary shadow-sm">
                        {product.images[0] ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl bg-primary/5">
                            📦
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-primary truncate w-full text-center">
                        This
                      </span>
                    </div>

                    {product.productLinks.map((pl) => (
                      <Link
                        key={pl.linkedProductId}
                        href={`/products/${pl.linkedProduct.slug}`}
                        className="flex flex-col items-center gap-1 w-16 group"
                      >
                        <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-gray-200 hover:border-primary transition-colors">
                          {pl.linkedProduct.images[0] ? (
                            <Image
                              src={pl.linkedProduct.images[0].url}
                              alt={pl.label || pl.linkedProduct.name}
                              width={64}
                              height={64}
                              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl bg-gray-50">
                              📦
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-500 group-hover:text-primary truncate w-full text-center transition-colors">
                          {pl.label || pl.linkedProduct.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Variants: attribute options (Color, Size, etc.) on this product */}
              {product.variants && product.variants.length > 0 && (
                <div className="mt-4 space-y-3">
                  {Object.entries(
                    (product.variants as any[]).reduce(
                      (groups: Record<string, any[]>, v) => {
                        const key = v.name || "Option";
                        if (!groups[key]) groups[key] = [];
                        groups[key].push(v);
                        return groups;
                      },
                      {},
                    ),
                  ).map(([groupName, groupVariants]) => (
                    <div key={groupName}>
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        {groupName}:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(groupVariants as any[]).map((v) => (
                          <span
                            key={v.id}
                            className="px-3 py-1.5 rounded-full border-2 border-gray-200 text-sm text-gray-700"
                          >
                            {v.value}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Price */}
            <div>
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-3xl font-bold text-primary">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.compareAtPrice &&
                  product.compareAtPrice > product.price && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        ₹{product.compareAtPrice.toLocaleString()}
                      </span>
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                        Save ₹
                        {(
                          product.compareAtPrice - product.price
                        ).toLocaleString()}
                      </span>
                    </>
                  )}
              </div>
              <p className="text-xs text-gray-400 mb-1">
                Inclusive of all taxes
              </p>
              <p className="text-sm font-medium">
                {product.shippingCharge > 0 ? (
                  <span className="text-orange-600">
                    🚚 Shipping: ₹{product.shippingCharge.toLocaleString()}
                  </span>
                ) : (
                  <span className="text-green-600">🚚 Free Shipping</span>
                )}
              </p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.quantity > 0 ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium">
                    In Stock ({product.quantity} available)
                  </span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-600 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Quantity Selector */}
            {product.quantity > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity:
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-50 transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-5 font-semibold">{quantity}</span>
                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.quantity, quantity + 1))
                      }
                      className="p-2 hover:bg-gray-50 transition-colors"
                      disabled={quantity >= product.quantity}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    {product.quantity < 10 && `Only ${product.quantity} left!`}
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.quantity === 0 || addingToCart}
                className="flex-1 bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-600 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                {addingToCart ? "Adding..." : "Add to Cart"}
              </button>
              <button
                onClick={handleWishlist}
                disabled={wishlistLoading}
                className={`px-4 py-4 rounded-lg border-2 transition-all disabled:opacity-60 ${
                  isWishlisted
                    ? "border-red-500 bg-red-50 text-red-500"
                    : "border-gray-300 hover:border-red-500 hover:bg-red-50 hover:text-red-500"
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`}
                />
              </button>
              <button className="px-4 py-4 rounded-lg border-2 border-gray-300 hover:border-primary hover:bg-primary hover:text-white transition-all">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Buy Now Button */}
            {product.quantity > 0 && (
              <button
                onClick={handleBuyNow}
                disabled={addingToCart}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            )}

            {/* Returnable Badge */}
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg w-fit text-sm font-semibold ${
                product.isReturnable !== false
                  ? "bg-green-50 border border-green-300 text-green-700"
                  : "bg-red-50 border border-red-300 text-red-700"
              }`}
            >
              {product.isReturnable !== false ? (
                <>
                  <RotateCcw className="w-4 h-4" /> 7-Day Easy Returns
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" /> Non-Returnable Item
                </>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t">
              <div className="text-center">
                <Truck className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">
                  {product.shippingCharge > 0 ? "Shipping" : "Free Shipping"}
                </p>
                <p className="text-xs text-gray-500">
                  {product.shippingCharge > 0
                    ? `₹${product.shippingCharge} per order`
                    : "On all orders"}
                </p>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">100% Authentic</p>
                <p className="text-xs text-gray-500">Quality guaranteed</p>
              </div>
              <div className="text-center">
                <RotateCcw
                  className={`w-8 h-8 mx-auto mb-2 ${product.isReturnable !== false ? "text-primary" : "text-red-400"}`}
                />
                <p className="text-sm font-medium">
                  {product.isReturnable !== false
                    ? "Easy Returns"
                    : "No Returns"}
                </p>
                <p className="text-xs text-gray-500">
                  {product.isReturnable !== false
                    ? "7-day return policy"
                    : "Final sale item"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-6">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Tab Headers */}
            <div className="border-b flex">
              <button
                onClick={() => setActiveTab("description")}
                className={`px-8 py-4 font-semibold transition-colors ${
                  activeTab === "description"
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-600 hover:text-primary"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("details")}
                className={`px-8 py-4 font-semibold transition-colors ${
                  activeTab === "details"
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-600 hover:text-primary"
                }`}
              >
                Product Details
              </button>
              <button
                onClick={() => setActiveTab("shipping")}
                className={`px-8 py-4 font-semibold transition-colors ${
                  activeTab === "shipping"
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-600 hover:text-primary"
                }`}
              >
                Shipping & Returns
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === "description" && (
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {product.description || "No description available."}
                  </p>
                </div>
              )}

              {activeTab === "details" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.sku && (
                    <div className="flex py-3 border-b">
                      <span className="font-semibold text-gray-700 w-40">
                        SKU:
                      </span>
                      <span className="text-gray-600">{product.sku}</span>
                    </div>
                  )}
                  {product.brand && (
                    <div className="flex py-3 border-b">
                      <span className="font-semibold text-gray-700 w-40">
                        Brand:
                      </span>
                      <span className="text-gray-600">{product.brand}</span>
                    </div>
                  )}
                  {product.ageGroup && (
                    <div className="flex py-3 border-b">
                      <span className="font-semibold text-gray-700 w-40">
                        Age Group:
                      </span>
                      <span className="text-gray-600">{product.ageGroup}</span>
                    </div>
                  )}
                  {product.weight && (
                    <div className="flex py-3 border-b">
                      <span className="font-semibold text-gray-700 w-40">
                        Weight:
                      </span>
                      <span className="text-gray-600">{product.weight} kg</span>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="flex py-3 border-b">
                      <span className="font-semibold text-gray-700 w-40">
                        Dimensions:
                      </span>
                      <span className="text-gray-600">
                        {product.dimensions}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "shipping" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">
                      Shipping Information
                    </h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Standard delivery: 5-7 business days</li>
                      <li>
                        • Express delivery: 2-3 business days (additional
                        charges apply)
                      </li>
                      <li>• Cash on Delivery available</li>
                      {product.shippingCharge > 0 ? (
                        <li className="text-orange-600 font-medium">
                          • Shipping charge: ₹
                          {product.shippingCharge.toLocaleString()} (branded
                          product, sold at MRP)
                        </li>
                      ) : (
                        <li className="text-green-600 font-medium">
                          • Free shipping on this product
                        </li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      Return Policy
                      {product.isReturnable !== false ? (
                        <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          Returnable
                        </span>
                      ) : (
                        <span className="text-xs font-semibold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                          Non-Returnable
                        </span>
                      )}
                    </h3>
                    {product.isReturnable !== false ? (
                      <ul className="space-y-2 text-gray-600">
                        <li>• 7-day easy returns from the date of delivery</li>
                        <li>
                          • Product must be unused and in original packaging
                        </li>
                        <li>
                          • Refund will be processed within 5-7 business days
                        </li>
                        <li>• Return shipping charges may apply</li>
                      </ul>
                    ) : (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-700 font-medium mb-1">
                          ⚠️ This product is not eligible for returns.
                        </p>
                        <p className="text-red-600 text-sm">
                          Please review your order carefully before purchasing.
                          For queries, contact our support team.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-2">Similar Products</h2>
            <p className="text-sm text-gray-500 mb-6">
              You may also like these
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => {
                const relatedDiscount = relatedProduct.compareAtPrice
                  ? Math.round(
                      ((relatedProduct.compareAtPrice - relatedProduct.price) /
                        relatedProduct.compareAtPrice) *
                        100,
                    )
                  : 0;

                return (
                  <Link
                    key={relatedProduct.id}
                    href={`/products/${relatedProduct.slug}`}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <div className="relative aspect-square bg-gray-100 rounded-t-xl overflow-hidden">
                      {relatedProduct.images[0] ? (
                        <Image
                          src={relatedProduct.images[0].url}
                          alt={relatedProduct.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-6xl">
                          📦
                        </div>
                      )}
                      {relatedProduct.isFeatured && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                          FEATURED
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.round(relatedProduct.averageRating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-200 text-gray-200"
                            }`}
                          />
                        ))}
                        <span className="text-xs text-gray-500">
                          ({relatedProduct.reviewCount})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-primary">
                          ₹{relatedProduct.price.toLocaleString()}
                        </span>
                        {relatedProduct.compareAtPrice &&
                          relatedDiscount > 0 && (
                            <>
                              <span className="text-sm text-gray-500 line-through">
                                ₹
                                {relatedProduct.compareAtPrice.toLocaleString()}
                              </span>
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded font-semibold">
                                {relatedDiscount}% OFF
                              </span>
                            </>
                          )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
