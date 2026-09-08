import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Category } from "@/data/categories";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <div className="group bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      {/* Category Image with rounded corners */}
      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-50 mb-4">
        <Image
          src={category.image}
          alt={category.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center text-center justify-between px-2">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 group-hover:text-[#F2B52B] transition-colors">
            {category.title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed line-clamp-3 mb-4">
            {category.description}
          </p>
        </div>

        <Link
          href={category.href}
          className="inline-flex items-center text-xs sm:text-sm font-semibold text-[#F2B52B] group-hover:text-[#E0A41D] transition-colors pb-1"
        >
          {category.cta}
        </Link>
      </div>
    </div>
  );
}
