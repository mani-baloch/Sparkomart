"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/home/ProductCard";
import { products, Product } from "@/data/products";
import { Search, SlidersHorizontal, X, ArrowUpDown, Filter } from "lucide-react";

const CATEGORIES = [
  "All Categories",
  "Electronics",
  "Clothing & Fashion",
  "Home & Kitchen",
  "Sports & Outdoors",
  "Books & Media",
  "Health & Beauty",
];

const PRICE_RANGES = [
  { label: "All Prices", value: "all" },
  { label: "Under $50", value: "under-50" },
  { label: "$50 to $100", value: "50-100" },
  { label: "$100 to $200", value: "100-200" },
  { label: "Above $200", value: "above-200" },
];

const SORT_OPTIONS = [
  { label: "Sort: Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Highest Rated", value: "rating-desc" },
  { label: "Most Reviews", value: "reviews-desc" },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCategory = searchParams.get("category") || "All Categories";
  const initialSearch = searchParams.get("search") || "";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [selectedSort, setSelectedSort] = useState("featured");
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  // Sync URL changes to category or search
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      // Find matching category (case-insensitive or normalized)
      const matched = CATEGORIES.find(
        (c) => c.toLowerCase() === cat.toLowerCase()
      );
      if (matched) setSelectedCategory(matched);
    }
    const s = searchParams.get("search");
    if (s !== null) {
      setSearchQuery(s);
    }
  }, [searchParams]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category Filter
        if (
          selectedCategory !== "All Categories" &&
          product.category.toLowerCase() !== selectedCategory.toLowerCase()
        ) {
          return false;
        }

        // Price Filter
        if (selectedPrice === "under-50" && product.price >= 50) return false;
        if (
          selectedPrice === "50-100" &&
          (product.price < 50 || product.price > 100)
        )
          return false;
        if (
          selectedPrice === "100-200" &&
          (product.price < 100 || product.price > 200)
        )
          return false;
        if (selectedPrice === "above-200" && product.price <= 200) return false;

        // Search Query Filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const matchName = product.name.toLowerCase().includes(query);
          const matchCat = product.category.toLowerCase().includes(query);
          if (!matchName && !matchCat) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (selectedSort === "price-asc") return a.price - b.price;
        if (selectedSort === "price-desc") return b.price - a.price;
        if (selectedSort === "rating-desc") return b.rating - a.rating;
        if (selectedSort === "reviews-desc") return b.reviews - a.reviews;
        return 0; // featured (original order)
      });
  }, [selectedCategory, selectedPrice, selectedSort, searchQuery]);

  const hasActiveFilters =
    selectedCategory !== "All Categories" ||
    selectedPrice !== "all" ||
    selectedSort !== "featured" ||
    searchQuery.trim() !== "";

  const handleResetFilters = () => {
    setSelectedCategory("All Categories");
    setSelectedPrice("all");
    setSelectedSort("featured");
    setSearchQuery("");
    router.replace("/shop");
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      {/* 1. Hero Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-950 tracking-tight mb-3">
          Shop Collection
        </h1>
        <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Discover our curated collection of premium products across all
          categories. Quality guaranteed with fast shipping and hassle-free
          returns.
        </p>
        <div className="w-20 h-1.5 bg-[#F2B52B] rounded-full mx-auto mt-4" />
      </div>

      {/* 2. Filters & Controls Box */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-4 sm:p-6 mb-8 space-y-4">
        {/* Top Search Input */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by name or category..."
            className="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl pl-11 pr-10 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#F2B52B] focus:ring-2 focus:ring-[#F2B52B]/20 transition-all"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns Row */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
          {/* Category Dropdown */}
          <div className="relative flex-1 min-w-[160px] sm:min-w-[180px]">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full appearance-none bg-[#F9FAFB] border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#F2B52B] focus:ring-1 focus:ring-[#F2B52B] transition-all cursor-pointer pr-10"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">
              ▼
            </div>
          </div>

          {/* Price Range Dropdown */}
          <div className="relative flex-1 min-w-[140px] sm:min-w-[160px]">
            <select
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(e.target.value)}
              className="w-full appearance-none bg-[#F9FAFB] border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#F2B52B] focus:ring-1 focus:ring-[#F2B52B] transition-all cursor-pointer pr-10"
            >
              {PRICE_RANGES.map((price) => (
                <option key={price.value} value={price.value}>
                  {price.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">
              ▼
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="relative flex-1 min-w-[150px] sm:min-w-[170px]">
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="w-full appearance-none bg-[#F9FAFB] border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#F2B52B] focus:ring-1 focus:ring-[#F2B52B] transition-all cursor-pointer pr-10"
            >
              {SORT_OPTIONS.map((sort) => (
                <option key={sort.value} value={sort.value}>
                  {sort.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">
              ▼
            </div>
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50/50 transition-all cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Results Count Bar */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200/80">
        <p className="text-sm font-semibold text-gray-700">
          Showing{" "}
          <span className="text-gray-950 font-bold">
            {filteredProducts.length}
          </span>{" "}
          of <span className="text-gray-950 font-bold">{products.length}</span>{" "}
          Products
        </p>

        {selectedCategory !== "All Categories" && (
          <span className="text-xs font-bold text-gray-900 bg-[#F2B52B]/20 text-[#B47C05] px-2.5 py-1 rounded-full border border-[#F2B52B]/40">
            {selectedCategory}
          </span>
        )}
      </div>

      {/* 4. Products Grid (4 Columns) */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center max-w-md mx-auto my-12 shadow-xs">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            No products found
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            We couldn&apos;t find any items matching your selected filters. Try
            adjusting your search or clear all filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-6 py-2.5 rounded-xl bg-[#F2B52B] text-gray-950 font-bold text-sm hover:bg-[#d99f20] transition-colors shadow-xs cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDFD]">
      {/* Sticky Top Header System */}
      <div className="sticky top-0 z-40 w-full shadow-xs">
        <AnnouncementBar />
        <Navbar />
      </div>

      {/* Main Shop Content */}
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="max-w-[1280px] mx-auto px-4 py-20 text-center text-gray-400">
              Loading shop collection...
            </div>
          }
        >
          <ShopContent />
        </Suspense>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
