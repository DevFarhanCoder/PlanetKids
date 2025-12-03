'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  price: number;
  compareAtPrice: number | null;
  sku: string | null;
  barcode: string | null;
  quantity: number;
  brand: string | null;
  weight: number | null;
  dimensions: string | null;
  ageGroup: string | null;
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

export default function ProductDetailClient({ product, relatedProducts }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'shipping'>('description');

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const mainCategory = product.categories[0]?.category.parent?.name || product.categories[0]?.category.name || 'Products';

  return (
    <div className="min-h-screen bg-gray-50">
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
            <span className="text-gray-900 font-medium line-clamp-1">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Back Button */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden border border-gray-200">
              {product.images.length > 0 ? (
                <Image
                  src={product.images[selectedImage]?.url || product.images[0].url}
                  alt={product.images[selectedImage]?.altText || product.name}
                  fill
                  className="object-contain p-8"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full text-8xl">📦</div>
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

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-primary shadow-lg'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.altText || `${product.name} - Image ${index + 1}`}
                      fill
                      className="object-contain p-2"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(product.averageRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-gray-200 text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.averageRating.toFixed(1)} ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Category Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {product.categories.map((pc) => (
                  <Link
                    key={pc.category.id}
                    href={`/categories/${pc.category.slug}`}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-primary hover:text-white transition-colors"
                  >
                    {pc.category.parent ? `${pc.category.parent.name} → ` : ''}
                    {pc.category.name}
                  </Link>
                ))}
              </div>

              {/* Short Description */}
              {product.shortDescription && (
                <p className="text-gray-600 leading-relaxed">{product.shortDescription}</p>
              )}
            </div>

            {/* Price */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold text-primary">₹{product.price.toLocaleString()}</span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ₹{product.compareAtPrice.toLocaleString()}
                    </span>
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                      Save ₹{(product.compareAtPrice - product.price).toLocaleString()}
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-500">Inclusive of all taxes</p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.quantity > 0 ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium">In Stock ({product.quantity} available)</span>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity:</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-gray-50 transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-6 font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                      className="p-3 hover:bg-gray-50 transition-colors"
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
                disabled={product.quantity === 0}
                className="flex-1 bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-600 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`px-4 py-4 rounded-lg border-2 transition-all ${
                  isWishlisted
                    ? 'border-red-500 bg-red-50 text-red-500'
                    : 'border-gray-300 hover:border-red-500 hover:bg-red-50 hover:text-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
              <button className="px-4 py-4 rounded-lg border-2 border-gray-300 hover:border-primary hover:bg-primary hover:text-white transition-all">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Buy Now Button */}
            {product.quantity > 0 && (
              <button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition-all">
                Buy Now
              </button>
            )}

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Truck className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-gray-500">On orders above ₹999</p>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">100% Authentic</p>
                <p className="text-xs text-gray-500">Quality guaranteed</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Easy Returns</p>
                <p className="text-xs text-gray-500">7-day return policy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Tab Headers */}
            <div className="border-b flex">
              <button
                onClick={() => setActiveTab('description')}
                className={`px-8 py-4 font-semibold transition-colors ${
                  activeTab === 'description'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('details')}
                className={`px-8 py-4 font-semibold transition-colors ${
                  activeTab === 'details'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                Product Details
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`px-8 py-4 font-semibold transition-colors ${
                  activeTab === 'shipping'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                Shipping & Returns
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {product.description || 'No description available.'}
                  </p>
                </div>
              )}

              {activeTab === 'details' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.sku && (
                    <div className="flex py-3 border-b">
                      <span className="font-semibold text-gray-700 w-40">SKU:</span>
                      <span className="text-gray-600">{product.sku}</span>
                    </div>
                  )}
                  {product.brand && (
                    <div className="flex py-3 border-b">
                      <span className="font-semibold text-gray-700 w-40">Brand:</span>
                      <span className="text-gray-600">{product.brand}</span>
                    </div>
                  )}
                  {product.ageGroup && (
                    <div className="flex py-3 border-b">
                      <span className="font-semibold text-gray-700 w-40">Age Group:</span>
                      <span className="text-gray-600">{product.ageGroup}</span>
                    </div>
                  )}
                  {product.weight && (
                    <div className="flex py-3 border-b">
                      <span className="font-semibold text-gray-700 w-40">Weight:</span>
                      <span className="text-gray-600">{product.weight} kg</span>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="flex py-3 border-b">
                      <span className="font-semibold text-gray-700 w-40">Dimensions:</span>
                      <span className="text-gray-600">{product.dimensions}</span>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Shipping Information</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Free shipping on orders above ₹999</li>
                      <li>• Standard delivery: 5-7 business days</li>
                      <li>• Express delivery: 2-3 business days (additional charges apply)</li>
                      <li>• Cash on Delivery available</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Return Policy</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• 7-day easy returns</li>
                      <li>• Product must be unused and in original packaging</li>
                      <li>• Refund will be processed within 5-7 business days</li>
                      <li>• Return shipping charges may apply</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => {
                const relatedDiscount = relatedProduct.compareAtPrice
                  ? Math.round(
                      ((relatedProduct.compareAtPrice - relatedProduct.price) /
                        relatedProduct.compareAtPrice) *
                        100
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
                        <div className="flex items-center justify-center h-full text-6xl">📦</div>
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
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-gray-200 text-gray-200'
                            }`}
                          />
                        ))}
                        <span className="text-xs text-gray-500">({relatedProduct.reviewCount})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-primary">
                          ₹{relatedProduct.price.toLocaleString()}
                        </span>
                        {relatedProduct.compareAtPrice && relatedDiscount > 0 && (
                          <>
                            <span className="text-sm text-gray-500 line-through">
                              ₹{relatedProduct.compareAtPrice.toLocaleString()}
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
