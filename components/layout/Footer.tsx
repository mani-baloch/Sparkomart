"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SparkMartLogo } from "@/components/icons/SparkMartLogo";
import { MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  const [footerEmail, setFooterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleFooterSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (footerEmail.trim()) {
      setSubscribed(true);
      setFooterEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer id="footer" className="w-full bg-[#0B0B0B] text-white pt-16 pb-8 border-t border-neutral-800">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-neutral-800/80">
          {/* Column 1: Brand Info & Socials */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block mb-4">
              <SparkMartLogo variant="light" layout="horizontal" />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-6">
              Discover premium fashion pieces designed to elevate your style.
              Quality, comfort, and style in every piece.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-gray-400 hover:text-[#F2B52B] hover:border-[#F2B52B]/40 transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.797 1.056-2.797 2.68v1.291h3.993l-.63 3.667h-3.363v7.98c5.845-.98 10.282-6.04 10.282-12.135C24.5 5.234 19.266 0 12.802 0S1.104 5.234 1.104 11.556c0 6.095 4.437 11.155 10.282 12.135z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-gray-400 hover:text-[#F2B52B] hover:border-[#F2B52B]/40 transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-[2]" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* Twitter / X */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-gray-400 hover:text-[#F2B52B] hover:border-[#F2B52B]/40 transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-gray-400 hover:text-[#F2B52B] hover:border-[#F2B52B]/40 transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold text-base mb-4 tracking-tight">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link href="#top-rated" className="hover:text-white transition-colors">
                  Shop All
                </Link>
              </li>
              <li>
                <Link href="#categories" className="hover:text-white transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link href="#categories" className="hover:text-white transition-colors">
                  Clothing &amp; Fashion
                </Link>
              </li>
              <li>
                <Link href="#categories" className="hover:text-white transition-colors">
                  Home &amp; Kitchen
                </Link>
              </li>
              <li>
                <Link href="#categories" className="hover:text-white transition-colors">
                  Sports &amp; Outdoors
                </Link>
              </li>
              <li>
                <Link href="#benefits" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#footer" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div className="lg:col-span-3">
            <h3 className="text-white font-bold text-base mb-4 tracking-tight">
              Customer Service
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Forgot Password
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Get in Touch */}
          <div className="lg:col-span-3">
            <h3 className="text-white font-bold text-base mb-4 tracking-tight">
              Get in Touch
            </h3>

            <div className="space-y-3 text-sm text-gray-400 mb-6">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#F2B52B] shrink-0 mt-0.5" />
                <span>5800 BALCONES DR 2986, AUSTIN TX</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#F2B52B] shrink-0" />
                <a href="tel:+15123565110" className="hover:text-white transition-colors">
                  +1 512-356-5110
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#F2B52B] shrink-0" />
                <a href="mailto:info@sparklovert.com" className="hover:text-white transition-colors">
                  info@sparklovert.com
                </a>
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div>
              <h4 className="text-xs uppercase font-semibold text-gray-400 tracking-wider mb-2">
                Newsletter
              </h4>
              {subscribed ? (
                <p className="text-xs text-[#F2B52B]">Subscribed successfully!</p>
              ) : (
                <form onSubmit={handleFooterSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={footerEmail}
                    onChange={(e) => setFooterEmail(e.target.value)}
                    placeholder="Enter email"
                    className="flex-1 bg-neutral-900 border border-neutral-800 text-white placeholder:text-gray-500 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#F2B52B]"
                  />
                  <button
                    type="submit"
                    className="bg-white hover:bg-gray-100 text-black font-bold text-xs px-3.5 py-2.5 rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 SparkoMart. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-gray-300 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
