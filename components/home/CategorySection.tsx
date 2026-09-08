import React from "react";
import { categories } from "@/data/categories";
import { CategoryCard } from "./CategoryCard";
import { SectionHeading } from "./SectionHeading";

export function CategorySection() {
  return (
    <section id="categories" className="w-full bg-white py-12 md:py-16">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Shop by Category"
          subtitle="Explore our diverse range of products across multiple categories"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
