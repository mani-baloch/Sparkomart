import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { ArrowRight, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "All Categories | SparkoMart",
  description: "Browse all product categories on SparkoMart. Discover electronics, fashion, home, sports, books, and beauty collections.",
};

export default function AllCategoriesPage() {
  // Compute product count per category
  const categoryCounts = categories.reduce((acc, cat) => {
    const count = products.filter(
      (p) =>
        p.category.toLowerCase() === cat.title.toLowerCase() ||
        p.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") === cat.id.toLowerCase()
    ).length;
    acc[cat.id] = count;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDFD]">
      {/* Sticky Top Header System */}
      <div className="sticky top-0 z-40 w-full shadow-xs">
        <AnnouncementBar />
        <Navbar />
      </div>

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {/* Page Hero */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">


          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-950 tracking-tight mb-4">
            All Product Categories
          </h1>

          <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Browse our diverse range of curated departments. From the latest electronics to everyday essentials, find everything you need in one place.
          </p>

          <div className="w-20 h-1.5 bg-[#F2B52B] rounded-full mx-auto mt-4" />
        </div>

        {/* Categories Grid (3 Columns on desktop, 2 on tablet, 1 on mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {categories.map((cat) => {
            const count = categoryCounts[cat.id] || 0;
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                className="group bg-white rounded-3xl p-4 sm:p-5 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Category Card Image */}
                  <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-gray-100 mb-5">
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-gray-900 shadow-xs">
                      {count} Products
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h2 className="text-xl font-black text-gray-950 mb-2 group-hover:text-[#F26E22] transition-colors">
                    {cat.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed line-clamp-3 mb-6">
                    {cat.description}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900 group-hover:text-[#F26E22] transition-colors">
                    Explore Collection
                  </span>
                  <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-[#F2B52B] flex items-center justify-center text-gray-700 group-hover:text-gray-950 transition-all">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
