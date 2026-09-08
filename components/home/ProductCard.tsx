"use client";

import React from "react";
import Image from "next/image";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Star, Check, Heart, ShoppingBag } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="group bg-white rounded-2xl p-3 sm:p-3.5 border border-gray-100/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full relative">
      {/* Top Image Container */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-50 mb-3">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Sale Badge */}
        {product.badge && (
          <div className="absolute top-2.5 left-2.5 bg-[#DC2626] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
            {product.badge}
          </div>
        )}

        {/* Wishlist Button (Reveals on Hover) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id, product.name);
          }}
          className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-xs transition-all duration-200 opacity-0 group-hover:opacity-100 ${
            isWishlisted
              ? "text-red-500 opacity-100"
              : "text-gray-400 hover:text-gray-800"
          }`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className="w-3.5 h-3.5"
            fill={isWishlisted ? "currentColor" : "none"}
          />
        </button>

        {/* Quick Add Overlay on Hover */}
        <div className="absolute inset-x-2.5 bottom-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() =>
              addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category,
              })
            }
            className="w-full py-2 bg-gray-950/90 backdrop-blur-xs text-white text-xs font-semibold rounded-lg hover:bg-[#F2B52B] hover:text-gray-950 transition-colors flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Category Pill aligned to right */}
          <div className="flex justify-end mb-1">
            <span className="text-[10px] sm:text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {product.category}
            </span>
          </div>

          {/* Product Title */}
          <h3 className="text-sm sm:text-[15px] font-bold text-gray-900 leading-tight mb-2 group-hover:text-[#F2B52B] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2.5 text-xs">
            <div className="flex items-center text-[#F2B52B]">
              <Star className="w-3.5 h-3.5 fill-[#F2B52B]" />
            </div>
            <span className="font-bold text-gray-900">
              {product.rating}
            </span>
            <span className="text-gray-400">
              ({product.reviews})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-xs sm:text-sm text-gray-400 line-through">
              ${product.oldPrice.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Stock & Shipping Status */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] sm:text-xs">
          <div className="flex items-center gap-1 text-emerald-600 font-medium">
            <Check className="w-3 h-3 stroke-[3]" />
            <span>In Stock</span>
          </div>
          <span className="text-gray-400">
            {product.shipping}
          </span>
        </div>
      </div>
    </div>
  );
}
