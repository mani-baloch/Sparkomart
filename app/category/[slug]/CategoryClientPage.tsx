"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/home/ProductCard";
import { products as fallbackProducts, Product } from "@/data/products";
import { categories as fallbackCategories, Category } from "@/data/categories";
import {
  Search,
  ChevronDown,
  ArrowLeft,
  X,
  Package,
  ArrowRight,
} from "lucide-react";

interface CategoryClientPageProps {
  slug: string;
  initialProducts?: Product[];
  initialCategories?: Category[];
}

const PRICE_RANGES = [
  { label: "All Prices", value: "all" },
  { label: "Under $50", value: "under-50" },
  { label: "$50 to $100", value: "50-100" },
  { label: "$100 to $200", value: "100-200" },
  { label: "Above $200", value: "above-200" },
];

const SORT_OPTIONS = [
  { label: "Name A-Z", value: "name-asc" },
  { label: "Name Z-A", value: "name-desc" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Featured", value: "featured" },
  { label: "Highest Rated", value: "rating-desc" },
];

export function CategoryClientPage({
  slug,
  initialProducts,
  initialCategories,
}: CategoryClientPageProps) {
  const normalizedSlug = slug.toLowerCase();

  const availableCategories = useMemo(() => {
    return initialCategories && initialCategories.length > 0
      ? initialCategories
      : fallbackCategories;
  }, [initialCategories]);

  const availableProducts = useMemo(() => {
    return initialProducts && initialProducts.length > 0
      ? initialProducts
      : fallbackProducts;
  }, [initialProducts]);

  // Find matching category
  const category = useMemo(() => {
    const matched = availableCategories.find(
      (c) =>
        c.id.toLowerCase() === normalizedSlug ||
        c.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === normalizedSlug
    );

    if (matched) return matched;

    // Fallback: title-case the slug
    const fallbackTitle = slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    return {
      id: slug,
      title: fallbackTitle,
      description: `Explore our collection of premium ${fallbackTitle} items on SparkoMart.`,
      image: "/images/electronics.jpg",
      cta: "Shop Now →",
      href: `/category/${slug}`,
    };
  }, [availableCategories, normalizedSlug, slug]);

  const otherCategories = useMemo(() => {
    return availableCategories.filter(
      (c) => c.id.toLowerCase() !== category.id.toLowerCase()
    );
  }, [availableCategories, category.id]);

  // Filtering & Sorting State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [selectedSort, setSelectedSort] = useState("name-asc");

  // Filter products by this category
  const categoryProducts = useMemo(() => {
    return availableProducts.filter((p) => {
      const matchExact =
        p.category.toLowerCase() === category.title.toLowerCase();
      const matchSlug =
        p.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") === normalizedSlug;
      return matchExact || matchSlug;
    });
  }, [availableProducts, category.title, normalizedSlug]);

  const filteredProducts = useMemo(() => {
    return categoryProducts
      .filter((product) => {
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
          return product.name.toLowerCase().includes(query);
        }

        return true;
      })
      .sort((a, b) => {
        if (selectedSort === "name-asc") return a.name.localeCompare(b.name);
        if (selectedSort === "name-desc") return b.name.localeCompare(a.name);
        if (selectedSort === "price-asc") return a.price - b.price;
        if (selectedSort === "price-desc") return b.price - a.price;
        if (selectedSort === "rating-desc") return b.rating - a.rating;
        if (selectedSort === "reviews-desc") return b.reviews - a.reviews;
        return 0;
      });
  }, [categoryProducts, selectedPrice, selectedSort, searchQuery]);

  const hasActiveFilters =
    selectedPrice !== "all" ||
    selectedSort !== "name-asc" ||
    searchQuery.trim() !== "";

  const handleResetFilters = () => {
    setSelectedPrice("all");
    setSelectedSort("name-asc");
    setSearchQuery("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDFD]">
      {/* Top Header System */}
      <div className="sticky top-0 z-40 w-full shadow-xs">
        <AnnouncementBar />
        <Navbar />
      </div>

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* 1. Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 font-normal">
            <li>
              <Link
                href="/"
                className="hover:text-gray-900 transition-colors"
              >
                Home
              </Link>
            </li>
            <li className="text-gray-400 font-light">/</li>
            <li>
              <Link
                href="/shop"
                className="hover:text-gray-900 transition-colors"
              >
                Shop
              </Link>
            </li>
            <li className="text-gray-400 font-light">/</li>
            <li className="text-gray-900 font-medium truncate">
              {category.title}
            </li>
          </ol>
        </nav>

        {/* 2. Category Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
          <div className="flex items-start gap-4 sm:gap-5">
            {/* Category Image Thumbnail */}
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200/80 shadow-xs shrink-0 mt-0.5">
              <Image
                src={category.image}
                alt={category.title}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-950 tracking-tight">
                {category.title}
              </h1>
              {/* Golden Accent Underline */}
              <div className="h-1 w-12 bg-[#F2B52B] rounded-full mt-2" />

              <p className="mt-3.5 text-sm sm:text-base text-gray-600 max-w-2xl leading-relaxed">
                {category.description}
              </p>
              <p className="mt-2 text-xs sm:text-sm text-gray-500 font-medium">
                {categoryProducts.length} products available
              </p>
            </div>
          </div>

          {/* All Products Back Button */}
          <div className="shrink-0 sm:pt-1">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-900 hover:bg-gray-50 hover:border-gray-300 shadow-xs transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-gray-800" />
              <span>All Products</span>
            </Link>
          </div>
        </div>

        {/* 3. Search & Filters Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Search Input */}
          <div className="relative w-full sm:w-80 md:w-96">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search in ${category.title}...`}
              className="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl pl-10 pr-9 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#F2B52B] focus:ring-1 focus:ring-[#F2B52B] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-700 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Price Range Filter */}
          <div className="relative min-w-[130px]">
            <select
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(e.target.value)}
              className="appearance-none bg-[#F9FAFB] border border-gray-200 rounded-xl px-4 py-2 pr-9 text-sm font-medium text-gray-800 focus:outline-none focus:border-[#F2B52B] focus:ring-1 focus:ring-[#F2B52B] transition-all cursor-pointer"
            >
              {PRICE_RANGES.map((price) => (
                <option key={price.value} value={price.value}>
                  {price.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sort Dropdown */}
          <div className="relative min-w-[135px]">
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="appearance-none bg-[#F9FAFB] border border-gray-200 rounded-xl px-4 py-2 pr-9 text-sm font-medium text-gray-800 focus:outline-none focus:border-[#F2B52B] focus:ring-1 focus:ring-[#F2B52B] transition-all cursor-pointer"
            >
              {SORT_OPTIONS.map((sort) => (
                <option key={sort.value} value={sort.value}>
                  {sort.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50/50 transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* 4. Divider Line */}
        <hr className="border-gray-200/70 mb-6" />

        {/* 5. Products Counter */}
        <div className="text-sm font-normal text-gray-600 mb-6">
          Showing {filteredProducts.length} of {categoryProducts.length} products
        </div>

        {/* 5. Products Grid (4 Columns) */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center max-w-md mx-auto my-12 shadow-xs mb-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              No products found
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              No items in {category.title} matched your search criteria.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-2.5 rounded-xl bg-[#F2B52B] text-gray-950 font-bold text-sm hover:bg-[#d99f20] transition-colors shadow-xs cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* 6. Explore Other Categories Section */}
        <div className="mt-14 pt-10 border-t border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-950">
                Explore Other Categories
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Discover more curated products across our other popular collections
              </p>
            </div>
            <Link
              href="/categories"
              className="text-xs sm:text-sm font-bold text-gray-800 hover:text-[#B47C05] flex items-center gap-1 transition-colors"
            >
              <span>All Categories</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {otherCategories.map((other) => {
              const otherHref =
                other.href && !other.href.startsWith("#")
                  ? other.href
                  : `/category/${other.id}`;

              return (
                <Link
                  key={other.id}
                  href={otherHref}
                  className="group bg-white rounded-2xl p-3 border border-gray-100 shadow-xs hover:shadow-md hover:border-[#F2B52B]/40 hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
                >
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100 mb-2.5">
                  <Image
                    src={other.image}
                    alt={other.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 50vw, 20vw"
                  />
                </div>
                <div className="font-bold text-xs sm:text-sm text-gray-900 group-hover:text-[#B47C05] transition-colors truncate">
                  {other.title}
                </div>
                <span className="text-[11px] text-gray-400 mt-0.5">
                  Explore →
                </span>
              </Link>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
