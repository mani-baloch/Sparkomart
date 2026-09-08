import React from "react";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="w-full bg-white py-10 md:py-14 lg:py-18">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headline, Description & CTA Buttons */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black text-gray-900 tracking-tight leading-[1.08] mb-6">
              Everything You
              <br />
              Need,{" "}
              <span className="text-[#F2B52B]">All in One</span>
              <br />
              Place.
            </h1>

            <p className="text-gray-500 text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
              From health &amp; beauty to tools &amp; automotive – SparkoMart
              brings you quality products across every category at unbeatable
              prices.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="#categories"
                className="inline-flex items-center justify-center px-6 py-3 bg-[#F2B52B] hover:bg-[#E0A41D] text-white font-semibold text-sm rounded-lg shadow-sm transition-colors duration-200"
              >
                Shop All Categories &rarr;
              </Link>
              <Link
                href="#categories"
                className="inline-flex items-center justify-center px-6 py-3 bg-white hover:bg-gray-50 text-gray-800 font-medium text-sm rounded-lg border border-gray-300 transition-colors duration-200"
              >
                Browse Categories
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Workspace Image */}
          <div className="lg:col-span-6">
            <div className="relative w-full aspect-[16/10] rounded-2xl md:rounded-3xl overflow-hidden shadow-md">
              <Image
                src="/images/hero-workspace.jpg"
                alt="Modern workspace with laptop, tablet, and headphones"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
