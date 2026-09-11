"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import {
  ShoppingBag,
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
} from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, subtotal, totalItems } =
    useCart();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      {/* Sticky Header System */}
      <div className="sticky top-0 z-40 w-full shadow-xs">
        <AnnouncementBar />
        <Navbar />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
        {items.length === 0 ? (
          /* ========================================================================= */
          /* Empty Cart State (Matches User Screenshot 1 Exactly)                       */
          /* ========================================================================= */
          <div className="w-full max-w-[440px] bg-white rounded-[28px] border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-8 sm:p-10 flex flex-col items-center text-center my-12 animate-in fade-in zoom-in-95 duration-200">
            {/* Top Gray Circular Icon Container */}
            <div className="w-16 h-16 rounded-full bg-gray-100/90 flex items-center justify-center mb-6">
              <ShoppingBag className="w-7 h-7 text-gray-800 stroke-[1.8]" />
            </div>

            {/* Heading */}
            <h1 className="text-2xl sm:text-[26px] font-black text-gray-900 tracking-tight mb-2.5">
              Your cart is empty
            </h1>

            {/* Subtitle */}
            <p className="text-gray-500 text-sm max-w-[280px] leading-relaxed mb-8">
              Looks like you haven&apos;t added anything to your cart yet.
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
          /* Populated Cart State                                                      */
          /* ========================================================================= */
          <div className="w-full max-w-6xl mx-auto my-6 sm:my-10 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                  Shopping Cart
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  You have {totalItems} item{totalItems > 1 ? "s" : ""} in your bag
                </p>
              </div>

              <button
                onClick={clearCart}
                className="text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors"
              >
                Clear Cart
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Items List */}
              <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs divide-y divide-gray-100">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6"
                  >
                    {/* Item Image */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-bold text-[#F26E22] uppercase tracking-wider">
                        {item.category}
                      </span>
                      <h3 className="text-base font-bold text-gray-900 truncate">
                        {item.name}
                      </h3>
                      <div className="text-sm font-semibold text-gray-500 mt-0.5">
                        ${item.price.toFixed(2)} each
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between sm:justify-end gap-6">
                      <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50/50 p-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 rounded-lg text-gray-500 hover:bg-white hover:text-gray-900 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded-lg text-gray-500 hover:bg-white hover:text-gray-900 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-right min-w-[70px]">
                        <div className="text-base font-black text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        title="Remove from cart"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary Box */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs space-y-6">
                <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-gray-900">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-emerald-600 font-bold">FREE</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Estimated Tax</span>
                    <span className="font-medium text-gray-500">$0.00</span>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-between items-baseline">
                    <span className="text-base font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-black text-gray-900">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full py-4 bg-[#F2B52B] hover:bg-[#e0a41d] active:scale-[0.99] text-gray-900 font-extrabold text-sm rounded-2xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/"
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Continue Shopping</span>
                </Link>

                <div className="pt-4 border-t border-gray-100 space-y-2 text-[11px] text-gray-400">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-500" />
                    <span>Free Fast Delivery across USA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>30-Day Money Back Guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
