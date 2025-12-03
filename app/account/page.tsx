'use client';

import { useState } from 'react';
import { User, Package, Heart, MapPin, CreditCard, Bell, LogOut } from 'lucide-react';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('profile');

  const orders = [
    {
      id: 'PK202403001',
      date: 'March 15, 2024',
      status: 'Delivered',
      total: 3497,
      items: 3,
    },
    {
      id: 'PK202403002',
      date: 'March 10, 2024',
      status: 'In Transit',
      total: 1899,
      items: 1,
    },
    {
      id: 'PK202402028',
      date: 'February 28, 2024',
      status: 'Delivered',
      total: 2698,
      items: 2,
    },
  ];

  const addresses = [
    {
      id: 1,
      type: 'Home',
      name: 'Rizwan Ahmed',
      address: '123 Main Street, Apartment 4B',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      phone: '+91 98765 43210',
      isDefault: true,
    },
    {
      id: 2,
      type: 'Office',
      name: 'Rizwan Ahmed',
      address: '456 Business Park, Tower A',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      phone: '+91 98765 43210',
      isDefault: false,
    },
  ];

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'text-green-600 bg-green-100';
      case 'In Transit':
        return 'text-blue-600 bg-blue-100';
      case 'Processing':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

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
                  <h2 className="font-bold text-gray-900">Rizwan Ahmed</h2>
                  <p className="text-sm text-gray-600">rizwan@example.com</p>
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
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
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
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          defaultValue="Rizwan"
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          defaultValue="Ahmed"
                          className="input-field"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue="rizwan@example.com"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        defaultValue="+91 98765 43210"
                        className="input-field"
                      />
                    </div>
                    <button className="btn-primary">Save Changes</button>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-bold text-gray-900">Order #{order.id}</h3>
                            <p className="text-sm text-gray-600">{order.date}</p>
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
                              {order.items} item{order.items > 1 ? 's' : ''}
                            </p>
                            <p className="text-xl font-bold text-primary">
                              ₹{order.total.toLocaleString('en-IN')}
                            </p>
                          </div>
                          <button className="btn-outline">View Details</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">My Wishlist</h2>
                  <p className="text-gray-600">3 items saved in your wishlist</p>
                  <button className="btn-primary mt-4">View Wishlist</button>
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Saved Addresses</h2>
                    <button className="btn-primary">Add New Address</button>
                  </div>
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
                          <button className="text-primary hover:text-primary-600">
                            Edit
                          </button>
                        </div>
                        <p className="font-semibold text-gray-900">{address.name}</p>
                        <p className="text-gray-600">{address.address}</p>
                        <p className="text-gray-600">
                          {address.city}, {address.state} - {address.pincode}
                        </p>
                        <p className="text-gray-600">Phone: {address.phone}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
