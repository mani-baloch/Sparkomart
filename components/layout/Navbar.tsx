"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { SparkMartLogo } from "@/components/icons/SparkMartLogo";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import {
  Search,
  Heart,
  User,
  ShoppingBag,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
} from "lucide-react";

const dropdownCategories = [
  {
    id: "electronics",
    title: "Electronics",
    subtitle: "Explore products",
    image: "/images/electronics.jpg",
    href: "/category/electronics",
  },
  {
    id: "clothing-fashion",
    title: "Clothing & Fashion",
    subtitle: "Explore products",
    image: "/images/clothing-store.jpg",
    href: "/category/clothing-fashion",
  },
  {
    id: "home-kitchen",
    title: "Home & Kitchen",
    subtitle: "Explore products",
    image: "/images/home-kitchen.jpg",
    href: "/category/home-kitchen",
  },
  {
    id: "sports-outdoors",
    title: "Sports & Outdoors",
    subtitle: "Explore products",
    image: "/images/sports-outdoors.jpg",
    href: "/category/sports-outdoors",
  },
  {
    id: "books-media",
    title: "Books & Media",
    subtitle: "Explore products",
    image: "/images/books.jpg",
    href: "/category/books-media",
  },
  {
    id: "health-beauty",
    title: "Health & Beauty",
    subtitle: "Explore products",
    image: "/images/beauty.jpg",
    href: "/category/health-beauty",
  },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated } = useCustomerAuth();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const categoryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCategoryMouseEnter = () => {
    if (categoryTimeoutRef.current) {
      clearTimeout(categoryTimeoutRef.current);
      categoryTimeoutRef.current = null;
    }
    setIsCategoryOpen(true);
  };

  const handleCategoryMouseLeave = () => {
    if (categoryTimeoutRef.current) {
      clearTimeout(categoryTimeoutRef.current);
    }
    categoryTimeoutRef.current = setTimeout(() => {
      setIsCategoryOpen(false);
    }, 220);
  };

  useEffect(() => {
    return () => {
      if (categoryTimeoutRef.current) {
        clearTimeout(categoryTimeoutRef.current);
      }
    };
  }, []);

  const isWishlistActive = pathname === "/wishlist";
  const isCartActive = pathname === "/cart";
  const isUserActive = pathname === "/login" || pathname === "/profile";
  const isShopActive = pathname === "/shop";
  const isAboutActive = pathname === "/about";
  const isContactActive = pathname === "/contact";

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
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
        <nav className="hidden lg:flex items-center gap-1.5 text-sm font-semibold text-gray-800">
          <Link
            href="/"
            className="px-4 py-2 rounded-xl text-gray-800 hover:bg-[#F2B52B] hover:text-gray-950 transition-all duration-200"
          >
            Home
          </Link>
          <Link
            href="/shop"
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              isShopActive
                ? "bg-[#F2B52B] text-gray-950 font-bold shadow-xs"
                : "text-gray-800 hover:bg-[#F2B52B] hover:text-gray-950"
            }`}
          >
            Shop
          </Link>

            {/* Categories Dropdown */}
            <div
              className="relative"
              onMouseEnter={handleCategoryMouseEnter}
              onMouseLeave={handleCategoryMouseLeave}
            >
              <button
                type="button"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
                  isCategoryOpen
                    ? "bg-[#F2B52B] text-gray-950 shadow-xs"
                    : "text-gray-800 hover:bg-[#F2B52B] hover:text-gray-950"
                }`}
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                aria-expanded={isCategoryOpen}
              >
                <span>Categories</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isCategoryOpen ? "rotate-180 text-gray-950" : "text-gray-800"
                  }`}
                />
              </button>

              {isCategoryOpen && (
                <div
                  className="absolute top-full left-0 pt-2 z-50"
                  onMouseEnter={handleCategoryMouseEnter}
                  onMouseLeave={handleCategoryMouseLeave}
                >
                  {/* Invisible Bridge across gap to catch cursor */}
                  <div className="absolute -top-2 left-0 right-0 h-2" />
                  <div className="w-[280px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-gray-100 p-2.5 space-y-1 animate-in fade-in-50 slide-in-from-top-1 duration-150">
                    {dropdownCategories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={cat.href}
                        onClick={() => {
                          if (categoryTimeoutRef.current) {
                            clearTimeout(categoryTimeoutRef.current);
                          }
                          setIsCategoryOpen(false);
                        }}
                        className="flex items-center justify-between p-2 rounded-2xl hover:bg-gray-50/90 transition-all group cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="relative w-11 h-11 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100/90 shrink-0 shadow-xs">
                            <Image
                              src={cat.image}
                              alt={cat.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-200"
                              sizes="44px"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-bold text-gray-950 leading-tight group-hover:text-[#F26E22] transition-colors">
                              {cat.title}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {cat.subtitle}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-800 group-hover:text-black group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                      </Link>
                    ))}

                    <div className="border-t border-gray-100 mt-2 pt-2 px-1 pb-0.5">
                      <Link
                        href="/categories"
                        onClick={() => {
                          if (categoryTimeoutRef.current) {
                            clearTimeout(categoryTimeoutRef.current);
                          }
                          setIsCategoryOpen(false);
                        }}
                        className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-bold text-gray-800 hover:text-black hover:bg-gray-50 transition-colors group cursor-pointer"
                      >
                        <span>View All Categories</span>
                        <ArrowRight className="w-4 h-4 text-gray-800 group-hover:text-black group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

          <Link
            href="/about"
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              isAboutActive
                ? "bg-[#F2B52B] text-gray-950 font-bold shadow-xs"
                : "text-gray-800 hover:bg-[#F2B52B] hover:text-gray-950"
            }`}
          >
            About
          </Link>
          <Link
            href="/contact"
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              isContactActive
                ? "bg-[#F2B52B] text-gray-950 font-bold shadow-xs"
                : "text-gray-800 hover:bg-[#F2B52B] hover:text-gray-950"
            }`}
          >
            Contact
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
        <div className="flex items-center gap-3 sm:gap-5 text-gray-700">
          {/* Wishlist */}
          <Link
            href="/wishlist"
            className={`transition-all duration-200 relative ${
              isWishlistActive
                ? "w-9 h-9 rounded-full bg-[#F2B52B] text-gray-900 flex items-center justify-center shadow-xs"
                : "p-1.5 text-gray-700 hover:text-[#F2B52B]"
            }`}
            aria-label="Wishlist"
          >
            <Heart className={`${isWishlistActive ? "w-4 h-4 stroke-[2]" : "w-5 h-5 stroke-[1.8]"}`} />
            {wishlistCount > 0 && !isWishlistActive && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F2B52B] text-[10px] font-bold text-gray-900 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* User Account */}
          <Link
            href={isAuthenticated ? "/profile" : "/login"}
            className={`transition-all duration-200 relative ${
              isUserActive
                ? "w-9 h-9 rounded-full bg-[#F2B52B] text-gray-900 flex items-center justify-center shadow-xs"
                : "p-1.5 text-gray-700 hover:text-[#F2B52B]"
            }`}
            aria-label="Account"
            title={isAuthenticated ? `Logged in as ${user?.name || user?.email}` : "Sign In"}
          >
            <User className={`${isUserActive ? "w-4 h-4 stroke-[2]" : "w-5 h-5 stroke-[1.8]"}`} />
          </Link>

          {/* Shopping Bag / Cart */}
          <Link
            href="/cart"
            className="relative p-1.5 hover:text-[#F2B52B] transition-colors"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F2B52B] text-[10px] font-bold text-gray-900 flex items-center justify-center animate-in zoom-in">
                {totalItems}
              </span>
            )}
          </Link>

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
              href="/shop"
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
                href="/category/electronics"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1 text-sm text-gray-700 hover:text-[#F2B52B]"
              >
                Electronics
              </Link>
              <Link
                href="/category/clothing-fashion"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1 text-sm text-gray-700 hover:text-[#F2B52B]"
              >
                Clothing & Fashion
              </Link>
              <Link
                href="/category/home-kitchen"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1 text-sm text-gray-700 hover:text-[#F2B52B]"
              >
                Home & Kitchen
              </Link>
              <Link
                href="/category/sports-outdoors"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1 text-sm text-gray-700 hover:text-[#F2B52B]"
              >
                Sports & Outdoors
              </Link>
              <Link
                href="/category/books-media"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1 text-sm text-gray-700 hover:text-[#F2B52B]"
              >
                Books & Media
              </Link>
              <Link
                href="/category/health-beauty"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1 text-sm text-gray-700 hover:text-[#F2B52B]"
              >
                Health & Beauty
              </Link>
            </div>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-2 py-1.5 rounded-lg transition-colors ${
                isAboutActive
                  ? "bg-[#F2B52B] text-gray-950 font-bold"
                  : "hover:bg-gray-50 hover:text-[#F2B52B]"
              }`}
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-2 py-1.5 rounded-lg transition-colors ${
                isContactActive
                  ? "bg-[#F2B52B] text-gray-950 font-bold"
                  : "hover:bg-gray-50 hover:text-[#F2B52B]"
              }`}
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
