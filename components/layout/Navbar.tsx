"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SparkMartLogo } from "@/components/icons/SparkMartLogo";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import {
  Search,
  Heart,
  User,
  ShoppingBag,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

export function Navbar() {
  const { totalItems, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`Searching for: "${searchQuery}" across all categories`);
    }
  };

  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200/60 transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between gap-4 md:gap-8">
        {/* Left: Brand Logo */}
        <Link href="/" className="flex-shrink-0">
          <SparkMartLogo layout="badge" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-gray-800">
          <Link
            href="/"
            className="text-gray-900 hover:text-[#F2B52B] transition-colors"
          >
            Home
          </Link>
          <Link
            href="#categories"
            className="text-gray-700 hover:text-[#F2B52B] transition-colors"
          >
            Shop
          </Link>

          {/* Categories Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsCategoryOpen(true)}
            onMouseLeave={() => setIsCategoryOpen(false)}
          >
            <button
              className="flex items-center gap-1 text-gray-700 hover:text-[#F2B52B] transition-colors py-2"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            >
              <span>Categories</span>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                  isCategoryOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isCategoryOpen && (
              <div className="absolute top-full left-0 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in-50 slide-in-from-top-2 duration-150">
                <Link
                  href="#categories"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-[#F2B52B] transition-colors"
                  onClick={() => setIsCategoryOpen(false)}
                >
                  Electronics
                </Link>
                <Link
                  href="#categories"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-[#F2B52B] transition-colors"
                  onClick={() => setIsCategoryOpen(false)}
                >
                  Clothing & Fashion
                </Link>
                <Link
                  href="#categories"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-[#F2B52B] transition-colors"
                  onClick={() => setIsCategoryOpen(false)}
                >
                  Home & Kitchen
                </Link>
                <Link
                  href="#categories"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-[#F2B52B] transition-colors"
                  onClick={() => setIsCategoryOpen(false)}
                >
                  Sports & Outdoors
                </Link>
              </div>
            )}
          </div>

          <Link
            href="#benefits"
            className="text-gray-700 hover:text-[#F2B52B] transition-colors"
          >
            About
          </Link>
          <Link
            href="#footer"
            className="text-gray-700 hover:text-[#F2B52B] transition-colors"
          >
            Contact
          </Link>
          <Link
            href="/admin"
            className="text-xs font-bold px-2.5 py-1 rounded-lg bg-orange-50 text-[#F26E22] hover:bg-orange-100 transition-colors"
          >
            Admin Panel
          </Link>
        </nav>

        {/* Center/Right: Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-md items-center relative"
        >
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across all categories..."
              className="w-full bg-[#F9FAFB] border border-gray-200 text-sm text-gray-900 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-[#F2B52B] focus:ring-1 focus:ring-[#F2B52B] transition-all placeholder:text-gray-400 placeholder:text-xs md:placeholder:text-sm"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </form>

        {/* Right: Action Icons */}
        <div className="flex items-center gap-4 sm:gap-6 text-gray-700">
          {/* Wishlist */}
          <button
            onClick={() => alert(`Wishlist has ${wishlistCount} item(s)`)}
            className="relative p-1.5 hover:text-[#F2B52B] transition-colors"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5 stroke-[1.8]" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F2B52B] text-[10px] font-bold text-gray-900 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* User Account */}
          <button
            onClick={() => alert("Sign In / Account modal: Demo mode")}
            className="p-1.5 hover:text-[#F2B52B] transition-colors"
            aria-label="Account"
          >
            <User className="w-5 h-5 stroke-[1.8]" />
          </button>

          {/* Shopping Bag / Cart */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-1.5 hover:text-[#F2B52B] transition-colors"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F2B52B] text-[10px] font-bold text-gray-900 flex items-center justify-center animate-in zoom-in">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-gray-700 hover:text-[#F2B52B] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across all categories..."
              className="w-full bg-gray-50 border border-gray-200 text-sm text-gray-900 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#F2B52B]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          <nav className="flex flex-col space-y-3 text-sm font-medium text-gray-800">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-lg hover:bg-gray-50 hover:text-[#F2B52B]"
            >
              Home
            </Link>
            <Link
              href="#categories"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-lg hover:bg-gray-50 hover:text-[#F2B52B]"
            >
              Shop
            </Link>
            <div className="pl-2 border-l-2 border-amber-300 ml-2 space-y-1.5">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                Categories
              </span>
              <Link
                href="#categories"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1 text-sm text-gray-700 hover:text-[#F2B52B]"
              >
                Electronics
              </Link>
              <Link
                href="#categories"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1 text-sm text-gray-700 hover:text-[#F2B52B]"
              >
                Clothing & Fashion
              </Link>
              <Link
                href="#categories"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1 text-sm text-gray-700 hover:text-[#F2B52B]"
              >
                Home & Kitchen
              </Link>
              <Link
                href="#categories"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1 text-sm text-gray-700 hover:text-[#F2B52B]"
              >
                Sports & Outdoors
              </Link>
            </div>
            <Link
              href="#benefits"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-lg hover:bg-gray-50 hover:text-[#F2B52B]"
            >
              About
            </Link>
            <Link
              href="#footer"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-lg hover:bg-gray-50 hover:text-[#F2B52B]"
            >
              Contact
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-lg font-bold text-[#F26E22] hover:bg-orange-50 flex items-center justify-between"
            >
              <span>Admin Panel</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-orange-100">
                Dashboard
              </span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
