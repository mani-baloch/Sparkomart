"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { CheckCircle2, ShoppingBag } from "lucide-react";

export function CartNotification() {
  const { notification, setIsCartOpen } = useCart();

  if (!notification) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-gray-800 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <CheckCircle2 className="w-5 h-5 text-[#F2B52B]" />
      <span className="text-sm font-medium">{notification}</span>
      <button
        onClick={() => setIsCartOpen(true)}
        className="ml-2 px-2.5 py-1 bg-[#F2B52B] text-gray-950 font-bold text-xs rounded-md hover:bg-[#e0a41d] transition-colors flex items-center gap-1"
      >
        <ShoppingBag className="w-3.5 h-3.5" />
        <span>View Cart</span>
      </button>
    </div>
  );
}
