import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-50 via-orange-50 to-pink-50 text-gray-700">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-primary-500 via-orange-500 to-pink-500 py-16">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white text-center md:text-left">
              <h3 className="text-3xl font-black mb-3">
                Join Our Happy Parents Club! 🎉
              </h3>
              <p className="text-white/95 text-lg font-semibold">
                Get exclusive deals, new arrivals, and parenting tips delivered
                to your inbox.
              </p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-80 px-6 py-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-white/50 shadow-soft-lg font-semibold placeholder:text-gray-500"
              />
              <button className="btn-secondary whitespace-nowrap shadow-soft-lg">
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <Image
                  src="/myplanetkidslogo.png"
                  alt="MyPlanetKids"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                MyPlanetKids
              </span>
            </div>
            <p className="text-sm mb-5 leading-relaxed font-medium">
              Your trusted destination for quality kids products. From toys to
              learning kits, we have everything to nurture your child's growth
              and happiness.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/myplanetkids"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white hover:bg-gradient-to-r hover:from-pink-400 hover:to-pink-500 rounded-2xl flex items-center justify-center transition-all shadow-soft hover:shadow-soft-lg transform hover:-translate-y-1 group"
              >
                <Instagram className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" />
              </a>
              <a
                href="https://wa.me/919326287112"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white hover:bg-gradient-to-r hover:from-green-400 hover:to-green-500 rounded-2xl flex items-center justify-center transition-all shadow-soft hover:shadow-soft-lg transform hover:-translate-y-1 group"
              >
                <svg
                  className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/myplanetkids"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white hover:bg-gradient-to-r hover:from-primary-400 hover:to-primary-500 rounded-2xl flex items-center justify-center transition-all shadow-soft hover:shadow-soft-lg transform hover:-translate-y-1 group"
              >
                <Facebook className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gray-900 font-black text-xl mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="hover:text-primary-600 transition-colors font-semibold hover:pl-2 inline-block transform transition-all"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary-600 transition-colors font-semibold hover:pl-2 inline-block transform transition-all"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/track-order"
                  className="hover:text-primary-600 transition-colors font-semibold hover:pl-2 inline-block transform transition-all"
                >
                  Track Order
                </Link>
              </li>
              <li>
                <Link
                  href="/bulk-order"
                  className="hover:text-primary-600 transition-colors font-semibold hover:pl-2 inline-block transform transition-all"
                >
                  Bulk Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-gray-900 font-black text-xl mb-5">
              Customer Service
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/shipping-policy"
                  className="hover:text-primary-600 transition-colors font-semibold hover:pl-2 inline-block transform transition-all"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/return-policy"
                  className="hover:text-primary-600 transition-colors font-semibold hover:pl-2 inline-block transform transition-all"
                >
                  Return & Refund
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-primary-600 transition-colors font-semibold hover:pl-2 inline-block transform transition-all"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-primary-600 transition-colors font-semibold hover:pl-2 inline-block transform transition-all"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-primary-600 transition-colors font-semibold hover:pl-2 inline-block transform transition-all"
                >
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-gray-900 font-black text-xl mb-5">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-soft">
                  <MapPin className="w-5 h-5 text-primary-600" />
                </div>
                <span className="text-sm font-medium">
                  Shop no 8/9, Sector 11, Shanti Nagar, Mira Road East, Mira
                  Bhayandar, Maharashtra 401107
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-soft">
                  <Phone className="w-5 h-5 text-secondary-500" />
                </div>
                <a
                  href="tel:+919326287112"
                  className="text-sm hover:text-primary-600 transition-colors font-semibold"
                >
                  9326287112
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-soft">
                  <Mail className="w-5 h-5 text-accent-500" />
                </div>
                <a
                  href="mailto:Planetkids1133@gmail.com"
                  className="text-sm hover:text-primary-600 transition-colors font-semibold"
                >
                  Planetkids1133@gmail.com
                </a>
              </li>
            </ul>
            <div className="mt-6 bg-white rounded-2xl p-4 shadow-soft">
              <p className="text-sm font-black text-gray-900 mb-2">
                Customer Support Hours:
              </p>
              <p className="text-sm font-semibold">
                Mon - Sat: 9:00 AM - 8:00 PM
              </p>
              <p className="text-sm font-semibold">
                Sunday: 10:00 AM - 6:00 PM
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 bg-white/50">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p className="font-semibold text-gray-700">
              &copy; 2025 MyPlanetKids. All rights reserved. Made with ❤️ for
              kids.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-gray-700">
                We Accept:
              </span>
              <div className="flex gap-3 items-center">
                <Image
                  src="/payment-icons/visa.svg"
                  alt="Visa"
                  width={50}
                  height={32}
                  className="h-8 w-auto object-contain"
                />
                <Image
                  src="/payment-icons/mastercard.svg"
                  alt="Mastercard"
                  width={50}
                  height={32}
                  className="h-8 w-auto object-contain"
                />
                <Image
                  src="/payment-icons/rupay.svg"
                  alt="RuPay"
                  width={50}
                  height={32}
                  className="h-8 w-auto object-contain"
                />
                <Image
                  src="/payment-icons/upi.svg"
                  alt="UPI"
                  width={50}
                  height={32}
                  className="h-8 w-auto object-contain"
                />
                <div className="bg-gradient-to-r from-success-500 to-success-600 px-3 py-2 rounded-lg text-xs font-black text-white">
                  COD
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
