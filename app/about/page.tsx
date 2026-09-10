import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Star, Heart, Zap, Target, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | SparkoMart",
  description:
    "We're passionate about bringing you premium fashion and lifestyle pieces that speak volumes about your unique style.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDFD]">
      {/* Sticky Top Header System */}
      <div className="sticky top-0 z-40 w-full shadow-xs">
        <AnnouncementBar />
        <Navbar />
      </div>

      <main className="flex-1 w-full">
        {/* 1. Hero Header Section */}
        <section className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 sm:pt-20 sm:pb-16 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-950 tracking-tight">
            About <span className="text-[#F2B52B]">SparkoMart</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-normal">
            We&apos;re passionate about bringing you premium fashion pieces that
            speak volumes about your unique style. Every design tells a story,
            and we&apos;re here to help you tell yours.
          </p>
        </section>

        {/* 2. Our Story Section */}
        <section className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left: Story Content */}
            <div className="lg:col-span-6 space-y-5">
              <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
                Our Story
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
                SparkoMart was born from a simple belief: everyone deserves to
                express their personality through high-quality, stylish clothing
                that doesn&apos;t compromise on comfort or craftsmanship.
              </p>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
                Started in 2020, we&apos;ve grown from a small passion project to
                a trusted brand serving thousands of fashion enthusiasts across
                Pakistan. Our journey began with a mission to bridge the gap
                between premium quality and accessible pricing.
              </p>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
                Every piece in our collection is carefully curated and tested to
                ensure it meets our high standards for quality, comfort, and
                style. We believe that great fashion should be inclusive and
                attainable for everyone.
              </p>
            </div>

            {/* Right: SparkoMart Visual Brand Card */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-[420px] aspect-square bg-white rounded-3xl shadow-[0_15px_45px_rgba(0,0,0,0.06)] border border-gray-100 p-8 sm:p-12 flex flex-col items-center justify-center relative overflow-hidden group hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-300">
                <div className="w-full h-full flex flex-col items-center justify-center select-none">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full max-h-[300px]"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Dark Navy Blue Curved Handle */}
                    <path
                      d="M43 23 V14.5 C43 10 46 6.5 50 6.5 C54 6.5 57 10 57 14.5 V23"
                      stroke="#16375B"
                      strokeWidth="4.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Orange Shopping Bag with Notch */}
                    <path
                      d="
                        M 35 23
                        H 65
                        C 69 23, 72 26, 72 30
                        V 58
                        C 72 62, 69 65, 65 65
                        H 55
                        C 51 65, 49 62, 49 58
                        V 47
                        C 49 41, 44 38, 38 41
                        C 32 44, 28 41, 28 36
                        V 30
                        C 28 26, 31 23, 35 23
                        Z
                      "
                      fill="#F26E22"
                    />

                    {/* Dark Navy Blue Cursor Arrow */}
                    <path
                      d="
                        M 44.5 45.2
                        C 45.8 46.5, 45.8 48, 44.5 49.2
                        L 39.2 64.2
                        C 38.4 66, 36.6 66.2, 35.4 64.8
                        L 34.2 57.5
                        L 26.8 56.5
                        C 25.2 56.2, 24.6 54.2, 25.8 53
                        L 41.2 44.2
                        C 42.4 43.4, 43.4 44, 44.5 45.2
                        Z
                      "
                      fill="#16375B"
                    />

                    {/* SparkoMart Typography */}
                    <text
                      x="50"
                      y="85"
                      textAnchor="middle"
                      fontFamily="var(--font-sans), system-ui, -apple-system, sans-serif"
                      fontWeight="900"
                      fontSize="17"
                      letterSpacing="-0.5"
                    >
                      <tspan fill="#F26E22">Sparko</tspan>
                      <tspan fill="#16375B">Mart</tspan>
                    </text>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Our Values Section */}
        <section className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
              Our Values
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-500 font-normal">
              These core values guide everything we do at SparkoMart.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 1: Quality First */}
            <div className="bg-white rounded-3xl border border-gray-100/90 shadow-[0_4px_25px_rgba(0,0,0,0.03)] p-8 sm:p-10 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-6">
                <Star className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-950 mb-3">
                Quality First
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-normal">
                We never compromise on quality. Every product undergoes
                rigorous testing to ensure it meets our premium standards.
              </p>
            </div>

            {/* Card 2: Customer Love */}
            <div className="bg-white rounded-3xl border border-gray-100/90 shadow-[0_4px_25px_rgba(0,0,0,0.03)] p-8 sm:p-10 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-6">
                <Heart className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-950 mb-3">
                Customer Love
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-normal">
                Our customers are at the heart of everything we do. Your
                satisfaction and happiness drive our innovation.
              </p>
            </div>

            {/* Card 3: Innovation */}
            <div className="bg-white rounded-3xl border border-gray-100/90 shadow-[0_4px_25px_rgba(0,0,0,0.03)] p-8 sm:p-10 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-6">
                <Zap className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-950 mb-3">
                Innovation
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-normal">
                We constantly evolve and adapt, bringing fresh designs and
                modern styles to keep you ahead of trends.
              </p>
            </div>
          </div>
        </section>

        {/* 4. SparkoMart by Numbers Section */}
        <section className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-950 text-center tracking-tight mb-12">
            SparkoMart by Numbers
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 text-center">
            {/* Stat 1 */}
            <div>
              <div className="text-4xl sm:text-5xl font-black text-[#F2B52B] tracking-tight mb-2">
                10k+
              </div>
              <div className="text-xs sm:text-sm font-semibold text-gray-600">
                Happy Customers
              </div>
            </div>

            {/* Stat 2 */}
            <div>
              <div className="text-4xl sm:text-5xl font-black text-[#F2B52B] tracking-tight mb-2">
                500+
              </div>
              <div className="text-xs sm:text-sm font-semibold text-gray-600">
                Products
              </div>
            </div>

            {/* Stat 3 */}
            <div>
              <div className="text-4xl sm:text-5xl font-black text-[#F2B52B] tracking-tight mb-2">
                98%
              </div>
              <div className="text-xs sm:text-sm font-semibold text-gray-600">
                Satisfaction Rate
              </div>
            </div>

            {/* Stat 4 */}
            <div>
              <div className="text-4xl sm:text-5xl font-black text-[#F2B52B] tracking-tight mb-2">
                4.8
              </div>
              <div className="text-xs sm:text-sm font-semibold text-gray-600">
                Average Rating
              </div>
            </div>
          </div>
        </section>

        {/* 5. Our Mission Section */}
        <section className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 text-center">
          <div className="flex justify-center mb-5">
            <Target className="w-12 h-12 text-gray-950 stroke-[2]" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight mb-5">
            Our Mission
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-normal mb-8">
            To make premium fashion accessible to everyone while maintaining the
            highest standards of quality, comfort, and style. We believe
            fashion is a form of self-expression, and everyone deserves to look
            and feel their best.
          </p>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-gray-200 bg-white text-sm font-bold text-gray-900 hover:bg-gray-50 hover:border-gray-300 shadow-xs transition-all cursor-pointer group"
          >
            <span>Shop Our Collection</span>
            <ArrowRight className="w-4 h-4 text-gray-800 group-hover:translate-x-1 transition-transform" />
          </Link>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
