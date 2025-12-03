'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: '1',
      name: 'Educational Learning Kit - STEM Science',
      slug: 'educational-learning-kit',
      price: 1299,
      originalPrice: 1999,
      image: '🔬',
      quantity: 2,
      inStock: true,
    },
    {
      id: '3',
      name: 'Kids School Backpack - Ergonomic Design',
      slug: 'kids-school-backpack',
      price: 1599,
      originalPrice: 2499,
      image: '🎒',
      quantity: 1,
      inStock: true,
    },
    {
      id: '4',
      name: 'Art & Craft Supplies Kit - Premium',
      slug: 'art-craft-kit',
      price: 899,
      originalPrice: 1499,
      image: '🎨',
      quantity: 1,
      inStock: true,
    },
  ]);

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const savings = cartItems.reduce(
    (sum, item) => sum + (item.originalPrice - item.price) * item.quantity,
    0
  );
  const shipping = subtotal >= 999 ? 0 : 60;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-6">Add some products to get started!</p>
          <Link href="/products" className="btn-primary inline-block">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <Link
                    href={`/products/${item.slug}`}
                    className="w-24 h-24 flex-shrink-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg flex items-center justify-center text-4xl"
                  >
                    {item.image}
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <Link
                          href={`/products/${item.slug}`}
                          className="font-semibold text-gray-900 hover:text-primary"
                        >
                          {item.name}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xl font-bold text-primary">
                            ₹{item.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            ₹{item.originalPrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                        {item.inStock ? (
                          <span className="text-sm text-green-600 font-medium">In Stock</span>
                        ) : (
                          <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                        )}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4 mt-4">
                      <span className="text-sm text-gray-600">Quantity:</span>
                      <div className="flex items-center border-2 border-gray-300 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                          className="p-2 hover:bg-gray-100 disabled:opacity-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-2 hover:bg-gray-100"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-sm text-gray-600">
                        Subtotal: ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4 pb-4 border-b">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>Savings</span>
                  <span>-₹{savings.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  {shipping === 0 ? (
                    <span className="text-green-600 font-semibold">FREE</span>
                  ) : (
                    <span>₹{shipping}</span>
                  )}
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
                <span>Total</span>
                <span className="text-primary">₹{total.toLocaleString('en-IN')}</span>
              </div>

              {subtotal < 999 && (
                <div className="bg-accent/10 text-accent p-3 rounded-lg text-sm mb-4">
                  Add ₹{(999 - subtotal).toLocaleString('en-IN')} more for FREE shipping!
                </div>
              )}

              <button className="btn-primary w-full mb-3">
                Proceed to Checkout <ArrowRight className="w-5 h-5 ml-2 inline" />
              </button>

              <Link href="/products" className="btn-outline w-full text-center block">
                Continue Shopping
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>🔒</span>
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>🔄</span>
                  <span>7-Day Easy Returns</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>✓</span>
                  <span>100% Authentic Products</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
