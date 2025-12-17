'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { User, Package, Heart, MapPin, LogOut, Trash2 } from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: {
    product: {
      name: string;
      images: { url: string }[];
    };
    quantity: number;
    price: number;
  }[];
}

interface WishlistItem {
  id: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice: number | null;
    images: { url: string }[];
    isActive: boolean;
  };
}

interface Address {
  id: string;
  type: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    // Check for tab parameter in URL
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/account');
    } else if (status === 'authenticated') {
      fetchUserData();
      fetchOrders();
      fetchWishlist();
      fetchAddresses();
    }
  }, [status, router]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await fetch('/api/wishlist');
      if (response.ok) {
        const data = await response.json();
        setWishlistItems(data);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await fetch('/api/user/addresses');
      if (response.ok) {
        const data = await response.json();
        setAddresses(data);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setUserData(updatedData);
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      const response = await fetch(`/api/wishlist?productId=${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setWishlistItems(wishlistItems.filter(item => item.product.id !== productId));
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const getStatusColor = (status: string) => {
    const statusMap: { [key: string]: string } = {
      PENDING: 'text-yellow-600 bg-yellow-100',
      CONFIRMED: 'text-blue-600 bg-blue-100',
      PROCESSING: 'text-purple-600 bg-purple-100',
      SHIPPED: 'text-indigo-600 bg-indigo-100',
      DELIVERED: 'text-green-600 bg-green-100',
      CANCELLED: 'text-red-600 bg-red-100',
      REFUNDED: 'text-gray-600 bg-gray-100',
    };
    return statusMap[status] || 'text-gray-600 bg-gray-100';
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">My Account</h1>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">{userData?.name || 'User'}</h2>
                  <p className="text-sm text-gray-600">{userData?.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-8">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <button 
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-600 mb-4">No orders yet</p>
                      <Link href="/products" className="text-primary hover:underline font-semibold">
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-bold text-gray-900">Order #{order.orderNumber}</h3>
                              <p className="text-sm text-gray-600">
                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-gray-700">
                                {order.items.length} item{order.items.length > 1 ? 's' : ''}
                              </p>
                              <p className="text-xl font-bold text-primary">
                                ₹{Number(order.total).toLocaleString('en-IN')}
                              </p>
                            </div>
                            <button 
                              onClick={() => alert(`Order details page will be created soon for order #${order.orderNumber}`)}
                              className="px-4 py-2 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
                    {wishlistItems.length > 0 && (
                      <p className="text-gray-600">{wishlistItems.length} items</p>
                    )}
                  </div>
                  {wishlistItems.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-600 mb-4">Your wishlist is empty</p>
                      <Link href="/products" className="text-primary hover:underline font-semibold">
                        Browse Products
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {wishlistItems.map((item) => (
                        <div key={item.id} className="border border-gray-200 rounded-lg p-4 flex gap-4">
                          <Link href={`/products/${item.product.slug}`} className="w-24 h-24 flex-shrink-0">
                            {item.product.images[0] ? (
                              <img
                                src={item.product.images[0].url}
                                alt={item.product.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                                <span className="text-gray-400">No Image</span>
                              </div>
                            )}
                          </Link>
                          <div className="flex-1">
                            <Link 
                              href={`/products/${item.product.slug}`}
                              className="font-semibold text-gray-900 hover:text-primary line-clamp-2"
                            >
                              {item.product.name}
                            </Link>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-lg font-bold text-primary">
                                ₹{Number(item.product.price).toLocaleString('en-IN')}
                              </span>
                              {item.product.compareAtPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                  ₹{Number(item.product.compareAtPrice).toLocaleString('en-IN')}
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => handleRemoveFromWishlist(item.product.id)}
                              className="mt-2 text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                            >
                              <Trash2 className="w-4 h-4" />
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Saved Addresses</h2>
                    <button 
                      onClick={() => alert('Add address functionality will be implemented in the next update')}
                      className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                    >
                      Add New Address
                    </button>
                  </div>
                  {addresses.length === 0 ? (
                    <div className="text-center py-12">
                      <MapPin className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-600 mb-4">No saved addresses</p>
                      <button 
                        onClick={() => alert('Add address functionality will be implemented in the next update')}
                        className="text-primary hover:underline font-semibold"
                      >
                        Add Your First Address
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          className="border border-gray-200 rounded-lg p-6"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-gray-900">{address.type}</h3>
                              {address.isDefault && (
                                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-semibold">
                                  Default
                                </span>
                              )}
                            </div>
                            <button 
                              onClick={() => alert('Edit address functionality will be implemented in the next update')}
                              className="text-primary hover:text-primary-600"
                            >
                              Edit
                            </button>
                          </div>
                          <p className="font-semibold text-gray-900">{address.name}</p>
                          <p className="text-gray-600">{address.addressLine1}</p>
                          {address.addressLine2 && (
                            <p className="text-gray-600">{address.addressLine2}</p>
                          )}
                          <p className="text-gray-600">
                            {address.city}, {address.state} - {address.pincode}
                          </p>
                          <p className="text-gray-600">Phone: {address.phone}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
