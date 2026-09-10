"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/home/ProductCard";
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  Zap,
  Heart,
  Share2,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
} from "lucide-react";

interface ProductDetailsClientProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailsClient({
  product,
  relatedProducts,
}: ProductDetailsClientProps) {
  const router = useRouter();
  const { addToCart, setIsCartOpen } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  const isWishlisted = isInWishlist(product.id);

  const categorySlug = product.category.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      });
    }
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const handleBuyNow = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
    router.push("/cart");
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDFD]">
      {/* Sticky Top Header System */}
      <div className="sticky top-0 z-40 w-full shadow-xs">
        <AnnouncementBar />
        <Navbar />
      </div>

      <main className="flex-1 max-w-[1240px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* 1. Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center space-x-2 text-xs sm:text-sm text-gray-500 font-normal">
            <li>
              <Link href="/" className="hover:text-gray-900 transition-colors">
                Home
              </Link>
            </li>
            <li className="text-gray-400 font-light">/</li>
            <li>
              <Link href="/shop" className="hover:text-gray-900 transition-colors">
                Shop
              </Link>
            </li>
            <li className="text-gray-400 font-light">/</li>
            <li>
              <Link
                href={`/category/${categorySlug}`}
                className="hover:text-gray-900 transition-colors"
              >
                {product.category}
              </Link>
            </li>
            <li className="text-gray-400 font-light">/</li>
            <li className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* 2. Back to Shop Button */}
        <div className="mb-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:border-gray-300 shadow-xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-gray-700" />
            <span>Back to Shop</span>
          </Link>
        </div>

        {/* 3. Product Hero (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 mb-20">
          {/* Left Column: Product Image */}
          <div className="lg:col-span-6">
            <div className="relative w-full aspect-4/3 sm:aspect-square rounded-3xl overflow-hidden bg-gray-100 border border-gray-100 shadow-md">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

              {product.badge && (
                <div className="absolute top-4 left-4 bg-[#DC2626] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  {product.badge}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="lg:col-span-6 flex flex-col justify-start">
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight mb-3">
              {product.name}
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4 font-normal">
              {product.description ||
                "High-performance design crafted with premium materials to ensure exceptional durability, comfort, and style."}
            </p>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-2 mb-5 text-sm">
              <div className="flex items-center text-[#F2B52B]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#F2B52B]" />
                ))}
              </div>
              <span className="font-bold text-gray-900">({product.rating.toFixed(1)})</span>
              <span className="text-gray-500">{product.reviews} reviews</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
                ${product.price.toFixed(2)}
              </span>
              {product.oldPrice > product.price && (
                <span className="text-lg sm:text-xl text-gray-400 line-through">
                  ${product.oldPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Quantity Stepper */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Quantity
              </label>
              <div className="inline-flex items-center border border-gray-200 rounded-xl bg-white p-1 shadow-xs">
                <button
                  type="button"
                  onClick={decrementQuantity}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-700 hover:bg-gray-100 font-bold transition-colors cursor-pointer select-none"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-sm text-gray-900 select-none">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={incrementQuantity}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-700 hover:bg-gray-100 font-bold transition-colors cursor-pointer select-none"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Notification alert */}
            {addedNotice && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-in fade-in duration-150">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Added {quantity} item(s) to your cart!</span>
                </div>
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="underline hover:text-emerald-950 font-bold cursor-pointer"
                >
                  View Cart
                </button>
              </div>
            )}

            {copied && (
              <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150">
                <Check className="w-4 h-4 text-amber-600" />
                <span>Product link copied to clipboard!</span>
              </div>
            )}

            {/* Action Buttons Row 1 */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mb-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl border-2 border-gray-950 text-gray-950 font-bold hover:bg-gray-950 hover:text-white transition-all flex items-center justify-center gap-2 text-sm shadow-xs cursor-pointer active:scale-[0.99]"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-linear-to-r from-[#F25A1A] to-[#E33800] text-white font-bold hover:opacity-95 shadow-md shadow-orange-600/20 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer active:scale-[0.99]"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Buy Now</span>
              </button>
            </div>

            {/* Action Buttons Row 2 */}
            <div className="flex items-center gap-3 mb-8">
              <button
                type="button"
                onClick={() =>
                  toggleWishlist(product.id, product.name, {
                    price: product.price,
                    image: product.image,
                    category: product.category,
                    inStock: product.inStock,
                  })
                }
                className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm font-semibold text-gray-800 hover:bg-gray-50 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
                  }`}
                />
                <span>{isWishlisted ? "In Wishlist" : "Add to Wishlist"}</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm font-semibold text-gray-800 hover:bg-gray-50 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-gray-600" />
                <span>Share</span>
              </button>
            </div>

            {/* Perks List */}
            <div className="space-y-3 pt-6 border-t border-gray-100 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <Truck className="w-4 h-4 text-gray-700 shrink-0" />
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="w-4 h-4 text-gray-700 shrink-0" />
                <span>30-day return policy</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-gray-700 shrink-0" />
                <span>2-year warranty included</span>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-gray-700 shrink-0" />
                <span>Fast 2 - 3 day delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mb-20 pt-10 border-t border-gray-200/80">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
                Related Products
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-gray-500 font-normal">
                You might also like these items
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
