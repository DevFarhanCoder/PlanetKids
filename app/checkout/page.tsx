"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Truck,
  CreditCard,
  Wallet,
  Home,
  Briefcase,
} from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    images: { url: string }[];
  };
}

interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  type: "HOME" | "WORK" | "OTHER";
  isDefault: boolean;
}

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [cart, setCart] = useState<{ items: CartItem[] } | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"PREPAID" | "COD">(
    "PREPAID",
  );
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  // New Address Form
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    type: "HOME" as "HOME" | "WORK" | "OTHER",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/checkout");
    } else if (status === "authenticated") {
      fetchData();
    }
  }, [status, router]);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const fetchData = async () => {
    try {
      const [cartRes, addressRes] = await Promise.all([
        fetch("/api/cart"),
        fetch("/api/user/addresses"),
      ]);

      if (cartRes.ok) {
        const cartData = await cartRes.json();
        setCart(cartData);

        if (!cartData.items || cartData.items.length === 0) {
          router.push("/cart");
        }
      }

      if (addressRes.ok) {
        const addressData = await addressRes.json();
        setAddresses(addressData);
        const defaultAddr = addressData.find((a: Address) => a.isDefault);
        if (defaultAddr) setSelectedAddress(defaultAddr.id);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    if (!cart?.items)
      return { subtotal: 0, shipping: 0, codCharge: 0, tax: 0, total: 0 };

    const subtotal = cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0,
    );

    const shipping = 0; // Fixed at ₹0
    const codCharge = paymentMethod === "COD" ? 50 : 0;
    const tax = 0; // Fixed at ₹0
    const total = subtotal + shipping + codCharge + tax;

    return { subtotal, shipping, codCharge, tax, total };
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/user/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAddress),
      });

      if (response.ok) {
        const savedAddress = await response.json();
        setAddresses([...addresses, savedAddress]);
        setSelectedAddress(savedAddress.id);
        setShowNewAddressForm(false);
        setNewAddress({
          name: "",
          phone: "",
          address: "",
          city: "",
          state: "",
          pincode: "",
          type: "HOME",
        });
      }
    } catch (error) {
      console.error("Error adding address:", error);
      alert("Failed to add address");
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address");
      return;
    }

    setProcessing(true);

    try {
      const address = addresses.find((a) => a.id === selectedAddress);
      if (!address) return;

      const { subtotal, shipping, codCharge, tax, total } = calculateTotals();

      if (paymentMethod === "COD") {
        // Create COD order directly
        const orderResponse = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentMethod: "COD",
            address,
            subtotal,
            shippingCost: shipping,
            codCharge,
            tax,
            total,
          }),
        });

        if (orderResponse.ok) {
          const order = await orderResponse.json();
          router.push(`/order-confirmation?orderId=${order.id}`);
        } else {
          alert("Failed to create order");
        }
      } else {
        // Razorpay payment flow
        const orderResponse = await fetch("/api/payments/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: total,
            address,
            subtotal,
            shippingCost: shipping,
            tax,
          }),
        });

        if (!orderResponse.ok) {
          alert("Failed to initialize payment");
          return;
        }

        const { orderId, amount, currency } = await orderResponse.json();

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: amount,
          currency: currency,
          name: "PlanetKids",
          description: "Order Payment",
          order_id: orderId,
          handler: async function (response: any) {
            try {
              const verifyResponse = await fetch("/api/payments/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  address,
                  subtotal,
                  shippingCost: shipping,
                  tax,
                  total,
                }),
              });

              if (verifyResponse.ok) {
                const order = await verifyResponse.json();
                router.push(`/order-confirmation?orderId=${order.id}`);
              } else {
                alert("Payment verification failed");
              }
            } catch (error) {
              console.error("Error verifying payment:", error);
              alert("Payment verification failed");
            }
          },
          prefill: {
            name: address.name,
            contact: address.phone,
            email: (session?.user as any)?.email || "",
          },
          theme: {
            color: "#0ea5e9",
          },
          modal: {
            ondismiss: function () {
              setProcessing(false);
            },
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order");
    } finally {
      if (paymentMethod === "COD") {
        setProcessing(false);
      }
    }
  };

  const totals = calculateTotals();

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Truck className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Delivery Address
                </h2>
              </div>

              {addresses.length === 0 && !showNewAddressForm && (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No saved addresses</p>
                  <button
                    onClick={() => setShowNewAddressForm(true)}
                    className="btn-primary"
                  >
                    Add New Address
                  </button>
                </div>
              )}

              {addresses.length > 0 && !showNewAddressForm && (
                <>
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <label
                        key={address.id}
                        className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          selectedAddress === address.id
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="address"
                            value={address.id}
                            checked={selectedAddress === address.id}
                            onChange={(e) => setSelectedAddress(e.target.value)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-gray-900">
                                {address.name}
                              </span>
                              <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                                {address.type}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {address.phone}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {address.address}, {address.city}, {address.state}{" "}
                              - {address.pincode}
                            </p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowNewAddressForm(true)}
                    className="mt-4 btn-outline w-full"
                  >
                    + Add New Address
                  </button>
                </>
              )}

              {showNewAddressForm && (
                <form onSubmit={handleAddAddress} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={newAddress.name}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, name: e.target.value })
                      }
                      className="input"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={newAddress.phone}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, phone: e.target.value })
                      }
                      className="input"
                      required
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Address (House No, Building, Street)"
                    value={newAddress.address}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, address: e.target.value })
                    }
                    className="input"
                    required
                  />

                  <div className="grid md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="City"
                      value={newAddress.city}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, city: e.target.value })
                      }
                      className="input"
                      required
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={newAddress.state}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, state: e.target.value })
                      }
                      className="input"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Pincode"
                      value={newAddress.pincode}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          pincode: e.target.value,
                        })
                      }
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Type
                    </label>
                    <div className="flex gap-4">
                      {(["HOME", "WORK", "OTHER"] as const).map((type) => (
                        <label key={type} className="flex items-center gap-2">
                          <input
                            type="radio"
                            value={type}
                            checked={newAddress.type === type}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                type: e.target.value as any,
                              })
                            }
                          />
                          <span className="text-sm">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button type="submit" className="btn-primary flex-1">
                      Save Address
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewAddressForm(false)}
                      className="btn-outline flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Payment Method
                </h2>
              </div>

              <div className="space-y-3">
                <label
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === "PREPAID"
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="PREPAID"
                      checked={paymentMethod === "PREPAID"}
                      onChange={() => setPaymentMethod("PREPAID")}
                    />
                    <Wallet className="w-6 h-6 text-primary" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">
                        Pay Online
                      </div>
                      <div className="text-sm text-gray-600">
                        Credit/Debit Card, UPI, NetBanking
                      </div>
                    </div>
                    <div className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                      Recommended
                    </div>
                  </div>
                </label>

                <label
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === "COD"
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                    />
                    <ShoppingBag className="w-6 h-6 text-gray-600" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">
                        Cash on Delivery
                      </div>
                      <div className="text-sm text-gray-600">
                        Pay when you receive (₹50 extra charge)
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="space-y-3 mb-4 pb-4 border-b max-h-64 overflow-y-auto">
                {cart?.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.product.images[0]?.url || "/placeholder.png"}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold text-primary">
                        ₹
                        {(
                          Number(item.product.price) * item.quantity
                        ).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 mb-4 pb-4 border-b">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{totals.subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>₹0</span>
                </div>
                {paymentMethod === "COD" && (
                  <div className="flex justify-between text-gray-600">
                    <span>COD Charges</span>
                    <span>₹{totals.codCharge}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>GST</span>
                  <span>₹0</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
                <span>Total</span>
                <span className="text-primary">
                  ₹{totals.total.toLocaleString("en-IN")}
                </span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={processing || !selectedAddress}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing
                  ? "Processing..."
                  : `Place Order (₹${totals.total.toLocaleString("en-IN")})`}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By placing your order, you agree to our Terms & Conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
