import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-primary to-secondary py-12">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-white text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">Join Our Community of 100K+ Parents!</h3>
              <p className="text-white/90">Get exclusive deals, new arrivals, and parenting tips delivered to your inbox.</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-80 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="btn-secondary whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🌍</span>
              <span className="text-2xl font-bold text-white">PlanetKids</span>
            </div>
            <p className="text-sm mb-4">
              Your trusted destination for quality kids products. From toys to learning kits, we have everything to nurture your child's growth and happiness.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary rounded-full flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary rounded-full flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary rounded-full flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary rounded-full flex items-center justify-center transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/track-order" className="hover:text-white transition-colors">Track Order</Link></li>
              <li><Link href="/bulk-order" className="hover:text-white transition-colors">Bulk Orders</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><Link href="/shipping-policy" className="hover:text-white transition-colors">Shipping Policy</Link></li>
              <li><Link href="/return-policy" className="hover:text-white transition-colors">Return & Refund Policy</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
              <li><Link href="/size-guide" className="hover:text-white transition-colors">Size Guide</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <span className="text-sm">123 Kids Street, Toy Town, Mumbai - 400001, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a href="tel:+911234567890" className="text-sm hover:text-white transition-colors">+91 123 456 7890</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a href="mailto:support@planetkids.com" className="text-sm hover:text-white transition-colors">support@planetkids.com</a>
              </li>
            </ul>
            <div className="mt-6">
              <p className="text-sm font-semibold text-white mb-2">Customer Support Hours:</p>
              <p className="text-sm">Mon - Sat: 9:00 AM - 8:00 PM</p>
              <p className="text-sm">Sunday: 10:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl mb-2">🚚</div>
              <p className="text-sm font-semibold text-white">Free Shipping</p>
              <p className="text-xs">On Prepaid Orders</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🔒</div>
              <p className="text-sm font-semibold text-white">Secure Payments</p>
              <p className="text-xs">100% Safe Transactions</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🔄</div>
              <p className="text-sm font-semibold text-white">Easy Returns</p>
              <p className="text-xs">7-Day Return Policy</p>
            </div>
            <div>
              <div className="text-3xl mb-2">⭐</div>
              <p className="text-sm font-semibold text-white">Quality Assured</p>
              <p className="text-xs">Verified Products</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p>&copy; 2025 PlanetKids. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span className="text-xs">We Accept:</span>
              <div className="flex gap-2">
                <div className="bg-white px-3 py-1 rounded text-xs font-semibold text-gray-900">VISA</div>
                <div className="bg-white px-3 py-1 rounded text-xs font-semibold text-gray-900">MC</div>
                <div className="bg-white px-3 py-1 rounded text-xs font-semibold text-gray-900">UPI</div>
                <div className="bg-white px-3 py-1 rounded text-xs font-semibold text-gray-900">COD</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
