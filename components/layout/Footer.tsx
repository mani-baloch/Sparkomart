"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { subscribeToNewsletter } from "@/lib/services/newsletter";

export function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState<"idle" | "loading" | "success" | "already">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = newsletterEmail.trim();

    if (!cleanEmail || !cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      setSubscribeStatus("idle");
      setStatusMessage("Please enter a valid email address.");
      return;
    }

    setSubscribeStatus("loading");

    const res = await subscribeToNewsletter(cleanEmail);

    if (res.alreadySubscribed) {
      setSubscribeStatus("already");
      setStatusMessage("You are already subscribed with this email!");
    } else if (res.success) {
      setSubscribeStatus("success");
      setStatusMessage("Thank you for subscribing! Check your inbox soon.");
      setNewsletterEmail("");
    } else {
      setSubscribeStatus("idle");
      setStatusMessage(res.error || "Failed to subscribe. Please try again.");
    }

    setTimeout(() => {
      setSubscribeStatus("idle");
      setStatusMessage("");
    }, 5000);
  };

  return (
    <footer id="footer" className="w-full bg-black text-white pt-16 pb-12 border-t border-neutral-900">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-neutral-900">
          {/* Column 1: Brand & Socials (3 cols) */}
          <div className="lg:col-span-3 flex flex-col justify-between">
            <div>
              {/* Logo: White Badge + SparkoMart Text */}
              <Link href="/" className="inline-flex items-center gap-2.5 mb-5 select-none group">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-xl p-0.5 shadow-xs border border-gray-100 flex items-center justify-center shrink-0">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-7 h-7 sm:w-8 sm:h-8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Dark Navy Blue Curved Handle */}
                    <path
                      d="M43 23 V14.5 C43 10 46 6.5 50 6.5 C54 6.5 57 10 57 14.5 V23"
                      stroke="#16375B"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Orange Shopping Bag with Notch */}
                    <path
                      d="
                        M 35 23
                        H 65
                        C 69 23, 72 26, 72 30
                        V 58
                        C 72 62, 69 65, 65 65
                        H 55
                        C 51 65, 49 62, 49 58
                        V 47
                        C 49 41, 44 38, 38 41
                        C 32 44, 28 41, 28 36
                        V 30
                        C 28 26, 31 23, 35 23
                        Z
                      "
                      fill="#F26E22"
                    />
                    {/* Dark Navy Blue Cursor Arrow pointing UP-RIGHT (↗) */}
                    <path
                      d="
                        M 44.5 45.2
                        C 45.8 46.5, 45.8 48, 44.5 49.2
                        L 39.2 64.2
                        C 38.4 66, 36.6 66.2, 35.4 64.8
                        L 34.2 57.5
                        L 26.8 56.5
                        C 25.2 56.2, 24.6 54.2, 25.8 53
                        L 41.2 44.2
                        C 42.4 43.4, 43.4 44, 44.5 45.2
                        Z
                      "
                      fill="#16375B"
                    />
                  </svg>
                </div>
                <span className="text-xl font-bold text-white tracking-tight">
                  SparkoMart
                </span>
              </Link>

              <p className="text-gray-400 text-sm leading-relaxed max-w-[280px] mb-8">
                Discover premium fashion pieces designed to elevate your style. Quality, comfort, and style in every piece.
              </p>
            </div>

            {/* Social Icons (Plain stroke/fill without circular border, matching reference image) */}
            <div className="flex items-center gap-6 text-gray-400">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
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
                className="hover:text-white transition-colors"
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
                className="hover:text-white transition-colors"
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
                className="hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold text-base mb-4 tracking-tight">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  Shop All
                </Link>
              </li>
              <li>
                <Link href="/category/electronics" className="hover:text-white transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link href="/category/clothing-fashion" className="hover:text-white transition-colors">
                  Clothing &amp; Fashion
                </Link>
              </li>
              <li>
                <Link href="/category/home-kitchen" className="hover:text-white transition-colors">
                  Home &amp; Kitchen
                </Link>
              </li>
              <li>
                <Link href="/category/sports-outdoors" className="hover:text-white transition-colors">
                  Sports &amp; Outdoors
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Service (3 cols) */}
          <div className="lg:col-span-3">
            <h3 className="text-white font-bold text-base mb-4 tracking-tight">
              Customer Service
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link href="/profile" className="hover:text-white transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-white transition-colors">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-white transition-colors font-medium">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-white transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/forgot-password" className="hover:text-white transition-colors">
                  Forgot Password
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Get in Touch & Newsletter (4 cols) */}
          <div className="lg:col-span-4">
            <h3 className="text-white font-bold text-base mb-4 tracking-tight">
              Get in Touch
            </h3>

            {/* Address, Phone, Email with Gold Icons */}
            <div className="space-y-3 text-sm text-gray-400 mb-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#F2B52B] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm leading-relaxed">
                  5900 BALCONES DR 23935, AUSTIN TX 78731
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#F2B52B] shrink-0" />
                <a href="tel:+15123555110" className="text-xs sm:text-sm hover:text-white transition-colors">
                  +1 512-355-5110
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#F2B52B] shrink-0" />
                <a href="mailto:info@SparkoMart.com" className="text-xs sm:text-sm hover:text-white transition-colors">
                  info@SparkoMart.com
                </a>
              </div>
            </div>

            {/* Newsletter Section */}
            <div>
              <h4 className="text-white font-bold text-base mb-3 tracking-tight">
                Newsletter
              </h4>

              <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Your email"
                  className="w-full bg-[#1C1C1C] border border-neutral-800 text-white placeholder:text-gray-500 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-neutral-600 transition-colors"
                />
                <button
                  type="submit"
                  disabled={subscribeStatus === "loading"}
                  className="bg-white hover:bg-neutral-200 active:scale-98 text-black font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all cursor-pointer shrink-0 disabled:opacity-60"
                >
                  {subscribeStatus === "loading" ? "..." : "Subscribe"}
                </button>
              </form>

              {/* Status Feedback Message */}
              {statusMessage && (
                <div
                  className={`mt-2.5 p-2 rounded-lg text-xs flex items-center gap-1.5 animate-in fade-in duration-200 ${
                    subscribeStatus === "success"
                      ? "bg-emerald-950/80 border border-emerald-800 text-emerald-400"
                      : subscribeStatus === "already"
                      ? "bg-amber-950/80 border border-amber-800 text-amber-300"
                      : "bg-red-950/80 border border-red-800 text-red-300"
                  }`}
                >
                  {subscribeStatus === "success" ? (
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  )}
                  <span>{statusMessage}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 SparkoMart. All rights reserved.</p>
          <div className="flex items-center gap-6 text-gray-400">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
