"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
} from "lucide-react";

export default function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 text-gray-700">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 py-5 md:py-14">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-8">
            <div className="text-white text-center md:text-left">
              <h3 className="text-base md:text-3xl font-black mb-1 md:mb-3">
                Join Our Happy Parents Club! 🎉
              </h3>
              <p className="text-white/90 text-xs md:text-lg font-medium hidden md:block">
                Get exclusive deals, new arrivals, and parenting tips delivered
                to your inbox.
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-80 px-3 md:px-6 py-2 md:py-4 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/50 font-medium placeholder:text-gray-400 text-sm md:text-base"
              />
              <button className="btn-secondary whitespace-nowrap text-xs md:text-base px-3 md:px-6 py-2 md:py-4 rounded-xl">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container-custom py-3 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 md:gap-10">
          {/* About Section - Desktop only */}
          <div className="hidden md:block">
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
                href="https://www.instagram.com/my_planet_kids?utm_source=qr&igsh=MWFhcW5wOXV2eXBmZQ=="
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
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links - Collapsible on Mobile */}
          <div className="border-b border-pink-200 md:border-0">
            <button
              onClick={() => toggleSection("quick")}
              className="flex md:hidden items-center justify-between w-full text-gray-800 font-bold text-sm py-3"
            >
              Quick Links
              <ChevronDown
                className={`w-4 h-4 transition-transform ${openSection === "quick" ? "rotate-180" : ""}`}
              />
            </button>
            <h4 className="hidden md:block text-gray-900 font-black text-xl mb-5">
              Quick Links
            </h4>
            <ul
              className={`pb-3 md:pb-0 space-y-2 md:space-y-3 ${openSection === "quick" ? "block" : "hidden md:block"}`}
            >
              {[
                ["About Us", "/about"],
                ["Contact Us", "/contact"],
                ["Track Order", "/track-order"],
                ["Bulk Orders", "/bulk-order"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="hover:text-primary-600 font-medium text-xs md:text-base hover:pl-1 inline-block transition-all"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service - Collapsible on Mobile */}
          <div className="border-b border-pink-200 md:border-0">
            <button
              onClick={() => toggleSection("service")}
              className="flex md:hidden items-center justify-between w-full text-gray-800 font-bold text-sm py-3"
            >
              Customer Service
              <ChevronDown
                className={`w-4 h-4 transition-transform ${openSection === "service" ? "rotate-180" : ""}`}
              />
            </button>
            <h4 className="hidden md:block text-gray-900 font-black text-xl mb-5">
              Customer Service
            </h4>
            <ul
              className={`pb-3 md:pb-0 space-y-2 md:space-y-3 ${openSection === "service" ? "block" : "hidden md:block"}`}
            >
              {[
                ["Shipping Policy", "/shipping-policy"],
                ["Return & Refund", "/return-policy"],
                ["Privacy Policy", "/privacy-policy"],
                ["Terms & Conditions", "/terms"],
                ["FAQs", "/faq"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="hover:text-primary-600 font-medium text-xs md:text-base hover:pl-1 inline-block transition-all"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info - Collapsible on Mobile */}
          <div className="border-b border-pink-200 md:border-0">
            <button
              onClick={() => toggleSection("contact")}
              className="flex md:hidden items-center justify-between w-full text-gray-800 font-bold text-sm py-3"
            >
              Contact Us
              <ChevronDown
                className={`w-4 h-4 transition-transform ${openSection === "contact" ? "rotate-180" : ""}`}
              />
            </button>
            <h4 className="hidden md:block text-gray-900 font-black text-xl mb-5">
              Contact Us
            </h4>
            <ul
              className={`pb-3 md:pb-0 space-y-2 md:space-y-4 ${openSection === "contact" ? "block" : "hidden md:block"}`}
            >
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
                <span className="text-xs md:text-sm font-medium">
                  Shop no 8/9, Sector 11, Shanti Nagar, Mira Road East,
                  Maharashtra 401107
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <a
                  href="tel:+919326287112"
                  className="text-xs md:text-sm hover:text-primary-600 font-semibold"
                >
                  9326287112
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <a
                  href="mailto:Planetkids1133@gmail.com"
                  className="text-xs md:text-sm hover:text-primary-600 font-semibold break-all"
                >
                  Planetkids1133@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile Social Links */}
        <div className="md:hidden mt-4 flex justify-center gap-3">
          <a
            href="https://www.instagram.com/my_planet_kids?utm_source=qr&igsh=MWFhcW5wOXV2eXBmZQ=="
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm"
          >
            <Instagram className="w-4 h-4 text-gray-600" />
          </a>
          <a
            href="https://wa.me/919326287112"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm"
          >
            <svg
              className="w-4 h-4 text-gray-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-pink-200 bg-gradient-to-r from-orange-50 to-pink-50">
        <div className="container-custom py-3 md:py-5">
          <div className="flex flex-col items-center gap-2 md:flex-row md:justify-between md:gap-4">
            <p className="font-medium text-gray-500 text-[10px] md:text-sm text-center">
              &copy; 2025 MyPlanetKids. All rights reserved. Made with ❤️ for
              kids.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-500">
                We Accept:
              </span>
              <div className="flex gap-1.5 md:gap-3 items-center">
                <Image
                  src="/payment-icons/visa.svg"
                  alt="Visa"
                  width={32}
                  height={20}
                  className="h-4 md:h-7 w-auto object-contain"
                />
                <Image
                  src="/payment-icons/mastercard.svg"
                  alt="Mastercard"
                  width={32}
                  height={20}
                  className="h-4 md:h-7 w-auto object-contain"
                />
                <Image
                  src="/payment-icons/rupay.svg"
                  alt="RuPay"
                  width={32}
                  height={20}
                  className="h-4 md:h-7 w-auto object-contain"
                />
                <Image
                  src="/payment-icons/upi.svg"
                  alt="UPI"
                  width={32}
                  height={20}
                  className="h-4 md:h-7 w-auto object-contain"
                />
                <div className="bg-gradient-to-r from-success-500 to-success-600 px-1.5 md:px-3 py-0.5 md:py-2 rounded text-[10px] md:text-xs font-black text-white">
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
