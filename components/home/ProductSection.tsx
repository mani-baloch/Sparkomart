import React from "react";
import Link from "next/link";
import { Product } from "@/data/products";
import { ProductCard } from "./ProductCard";
import { SectionHeading } from "./SectionHeading";

interface ProductSectionProps {
  id?: string;
  title: string;
  subtitle: string;
  products: Product[];
  showCtaButton?: boolean;
}

export function ProductSection({
  id,
  title,
  subtitle,
  products,
  showCtaButton = false,
}: ProductSectionProps) {
  return (
    <section id={id} className="w-full bg-white py-12 md:py-16">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title={title} subtitle={subtitle} />

        {/* 4-Column Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Optional centered CTA button (for Featured Products section) */}
        {showCtaButton && (
          <div className="text-center mt-10 md:mt-12">
            <Link
              href="#categories"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-[#F2B52B] hover:bg-[#E0A41D] text-white font-semibold text-sm rounded-lg shadow-sm transition-colors duration-200"
            >
              Shop All Categories &rarr;
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
