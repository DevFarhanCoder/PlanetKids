"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  Truck,
  ClipboardList,
} from "lucide-react";

interface OrderItem {
  id: string;
  productName: string;
  productSlug: string;
  productImage: string | null;
  variantName: string | null;
  variantValue: string | null;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  subtotal: number;
  discount: number;
  shippingCost: number;
  codCharge: number;
  tax: number;
  total: number;
  couponCode: string | null;
  couponDiscount: number;
  shippingName: string;
  shippingEmail: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
  shippingCountry: string;
  trackingNumber: string | null;
  carrier: string | null;
  customerNote: string | null;
  adminNote: string | null;
  createdAt: string;
  shippedAt: string | null;
  deliveredAt: string | null;
  user: {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
  } | null;
  items: OrderItem[];
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-indigo-100 text-indigo-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  REFUNDED: "bg-gray-100 text-gray-700",
};

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PAID: "bg-green-100 text-green-700",
  FAILED: "bg-red-100 text-red-700",
  REFUNDED: "bg-gray-100 text-gray-700",
};

export default function AdminOrderDetail() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("");
  const [adminNote, setAdminNote] = useState("");

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders?id=${orderId}`);
      if (!res.ok) {
        router.push("/admin/orders");
        return;
      }
      const data = await res.json();
      setOrder(data);
      setStatus(data.status);
      setTrackingNumber(data.trackingNumber || "");
      setCarrier(data.carrier || "");
      setAdminNote(data.adminNote || "");
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          status,
          trackingNumber: trackingNumber || null,
          carrier: carrier || null,
          adminNote: adminNote || null,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrder(updated);
        alert("Order updated successfully");
      } else {
        alert("Failed to update order");
      }
    } catch {
      alert("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Order not found.</p>
        <Link
          href="/admin/orders"
          className="text-blue-600 hover:underline mt-2 inline-block"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Order #{order.orderNumber}
            </h1>
            <p className="text-sm text-gray-500">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-700"}`}
          >
            {order.status}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${PAYMENT_STATUS_COLORS[order.paymentStatus] || "bg-gray-100 text-gray-700"}`}
          >
            {order.paymentStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
              <Package className="w-5 h-5 text-gray-500" />
              <h2 className="font-semibold text-gray-900">
                Order Items ({order.items.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 px-6 py-4"
                >
                  {item.productImage ? (
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                      No img
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {item.productName}
                    </p>
                    {item.variantName && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.variantName}: {item.variantValue}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-0.5">
                      Qty: {item.quantity} × ₹
                      {Number(item.price).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      ₹{Number(item.subtotal).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {/* Price Summary */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>₹{Number(order.subtotal).toLocaleString()}</span>
              </div>
              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-₹{Number(order.discount).toLocaleString()}</span>
                </div>
              )}
              {order.couponCode && Number(order.couponDiscount) > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Coupon ({order.couponCode})</span>
                  <span>-₹{Number(order.couponDiscount).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span>
                  {Number(order.shippingCost) === 0
                    ? "FREE"
                    : `₹${Number(order.shippingCost).toLocaleString()}`}
                </span>
              </div>
              {Number(order.codCharge) > 0 && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>COD Charge</span>
                  <span>₹{Number(order.codCharge).toLocaleString()}</span>
                </div>
              )}
              {Number(order.tax) > 0 && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax</span>
                  <span>₹{Number(order.tax).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-200 pt-2 mt-2">
                <span>Total</span>
                <span>₹{Number(order.total).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
              <MapPin className="w-5 h-5 text-gray-500" />
              <h2 className="font-semibold text-gray-900">Shipping Address</h2>
            </div>
            <div className="px-6 py-4 text-sm text-gray-700 space-y-1">
              <p className="font-semibold text-gray-900">
                {order.shippingName}
              </p>
              <p>{order.shippingAddress}</p>
              <p>
                {order.shippingCity}, {order.shippingState} –{" "}
                {order.shippingPincode}
              </p>
              <p>{order.shippingCountry}</p>
              <p className="pt-1">
                <span className="text-gray-500">Phone: </span>
                {order.shippingPhone}
              </p>
              <p>
                <span className="text-gray-500">Email: </span>
                {order.shippingEmail}
              </p>
            </div>
          </div>

          {/* Customer Note */}
          {order.customerNote && (
            <div className="bg-yellow-50 rounded-xl border border-yellow-200 px-6 py-4">
              <p className="text-sm font-semibold text-yellow-800 mb-1">
                Customer Note
              </p>
              <p className="text-sm text-yellow-700">{order.customerNote}</p>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
              <User className="w-5 h-5 text-gray-500" />
              <h2 className="font-semibold text-gray-900">Customer</h2>
            </div>
            <div className="px-6 py-4 text-sm space-y-1">
              <p className="font-semibold text-gray-900">
                {order.user?.name || order.shippingName}
              </p>
              <p className="text-gray-600">
                {order.user?.email || order.shippingEmail}
              </p>
              {order.user?.phone && (
                <p className="text-gray-600">{order.user.phone}</p>
              )}
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
              <CreditCard className="w-5 h-5 text-gray-500" />
              <h2 className="font-semibold text-gray-900">Payment</h2>
            </div>
            <div className="px-6 py-4 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Method</span>
                <span className="font-medium text-gray-900">
                  {order.paymentMethod === "COD"
                    ? "Cash on Delivery"
                    : order.paymentMethod === "PREPAID"
                      ? "Online Payment"
                      : order.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold ${PAYMENT_STATUS_COLORS[order.paymentStatus] || ""}`}
                >
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Fulfillment / Update Panel */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
              <Truck className="w-5 h-5 text-gray-500" />
              <h2 className="font-semibold text-gray-900">Fulfillment</h2>
            </div>
            <div className="px-6 py-4 space-y-4">
              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Order Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="REFUNDED">Refunded</option>
                </select>
              </div>

              {/* Tracking */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Carrier
                </label>
                <input
                  type="text"
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  placeholder="e.g. Delhivery, BlueDart"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Tracking Number
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Admin Note */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Admin Note
                </label>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  rows={3}
                  placeholder="Internal notes..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-primary text-white py-2 px-4 rounded-lg font-semibold text-sm hover:bg-primary-600 transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          {/* Shipping timeline */}
          {(order.shippedAt || order.deliveredAt) && (
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
                <ClipboardList className="w-5 h-5 text-gray-500" />
                <h2 className="font-semibold text-gray-900">Timeline</h2>
              </div>
              <div className="px-6 py-4 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Ordered</span>
                  <span className="text-gray-700">
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </span>
                </div>
                {order.shippedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Shipped</span>
                    <span className="text-gray-700">
                      {new Date(order.shippedAt).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                )}
                {order.deliveredAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Delivered</span>
                    <span className="text-gray-700">
                      {new Date(order.deliveredAt).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
