"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import {
  Heart,
  ArrowLeft,
  Trash2,
  ShoppingBag,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      {/* Sticky Header System */}
      <div className="sticky top-0 z-40 w-full shadow-xs">
        <AnnouncementBar />
        <Navbar />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
        {wishlistItems.length === 0 ? (
          /* ========================================================================= */
          /* Empty Wishlist State (Matches User Screenshot 2 Exactly)                  */
          /* ========================================================================= */
          <div className="w-full max-w-[440px] bg-white rounded-[28px] border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-8 sm:p-10 flex flex-col items-center text-center my-12 animate-in fade-in zoom-in-95 duration-200">
            {/* Top Gray Circular Icon Container */}
            <div className="w-16 h-16 rounded-full bg-gray-100/90 flex items-center justify-center mb-6">
              <Heart className="w-7 h-7 text-gray-800 stroke-[1.8]" />
            </div>

            {/* Heading */}
            <h1 className="text-2xl sm:text-[26px] font-black text-gray-900 tracking-tight mb-2.5">
              Your wishlist is empty
            </h1>

            {/* Subtitle */}
            <p className="text-gray-500 text-sm max-w-[280px] leading-relaxed mb-8">
              Save items you love for later by clicking the heart icon.
            </p>

            {/* Button */}
            <Link
              href="/"
              className="w-full py-3.5 bg-black hover:bg-neutral-800 active:scale-[0.99] text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        ) : (
          /* ========================================================================= */
          /* Populated Wishlist State                                                  */
          /* ========================================================================= */
          <div className="w-full max-w-6xl mx-auto my-6 sm:my-10 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                  My Wishlist
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  You have saved {wishlistItems.length} product
                  {wishlistItems.length > 1 ? "s" : ""}
                </p>
              </div>

              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs font-bold text-gray-700 hover:text-black bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-xs transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Continue Shopping</span>
              </Link>
            </div>

            {/* Wishlist Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-gray-100 p-4 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between relative group"
                >
                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-6 right-6 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-gray-400 hover:text-red-500 shadow-xs transition-colors"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div>
                    {/* Item Image */}
                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-3 border border-gray-100/80">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Meta */}
                    <span className="text-[10px] font-bold text-[#F26E22] uppercase tracking-wider">
                      {item.category || "General"}
                    </span>
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mt-0.5">
                      {item.name}
                    </h3>
                  </div>

                  <div className="pt-4 mt-2 border-t border-gray-50 flex items-center justify-between gap-3">
                    <span className="text-base font-black text-gray-900">
                      ${item.price.toFixed(2)}
                    </span>

                    <button
                      onClick={() =>
                        addToCart({
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          image: item.image,
                          category: item.category || "General",
                        })
                      }
                      className="px-3.5 py-2 bg-[#F2B52B] hover:bg-[#e0a41d] active:scale-95 text-gray-900 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Bag</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
