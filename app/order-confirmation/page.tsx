"use client";

import { useEffect, useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, Truck, Home, ArrowRight } from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  total: number;
  createdAt: string;
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
  items: {
    id: string;
    productName: string;
    productImage: string;
    quantity: number;
    price: number;
    subtotal: number;
  }[];
}

function OrderConfirmationContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && orderId) {
      fetchOrder();
    }
  }, [status, orderId, router]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders?id=${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 mb-4">
            Thank you for your order. We'll send you a confirmation email
            shortly.
          </p>
          <div className="inline-block bg-primary/10 px-6 py-3 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Order Number</p>
            <p className="text-2xl font-bold text-primary">
              {order.orderNumber}
            </p>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Order Details
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Delivery Address
              </h3>
              <div className="text-gray-600 text-sm">
                <p className="font-medium">{order.shippingName}</p>
                <p>{order.shippingAddress}</p>
                <p>
                  {order.shippingCity}, {order.shippingState} -{" "}
                  {order.shippingPincode}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Payment Information
              </h3>
              <div className="text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium">
                    {order.paymentMethod === "COD"
                      ? "Cash on Delivery"
                      : "Online Payment"}
                  </span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Payment Status:</span>
                  <span
                    className={`font-medium ${
                      order.paymentStatus === "PAID"
                        ? "text-green-600"
                        : "text-orange-600"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-bold text-primary">
                    ₹{Number(order.total).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-gray-50 rounded-lg"
                >
                  <img
                    src={item.productImage || "/placeholder.png"}
                    alt={item.productName}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {item.productName}
                    </p>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-sm font-semibold text-primary mt-1">
                      ₹{Number(item.subtotal).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Status Timeline */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Status</h2>
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-xs font-medium text-gray-900">Order Placed</p>
              <p className="text-xs text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex-1 h-1 bg-gray-200 mx-2"></div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                <Package className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-xs font-medium text-gray-500">Processing</p>
            </div>

            <div className="flex-1 h-1 bg-gray-200 mx-2"></div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                <Truck className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-xs font-medium text-gray-500">Shipped</p>
            </div>

            <div className="flex-1 h-1 bg-gray-200 mx-2"></div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                <Home className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-xs font-medium text-gray-500">Delivered</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/account" className="btn-primary flex-1 text-center">
            View All Orders
          </Link>
          <Link href="/" className="btn-outline flex-1 text-center">
            Continue Shopping <ArrowRight className="w-5 h-5 ml-2 inline" />
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help with your order?{" "}
            <Link href="/contact" className="text-primary hover:underline">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
