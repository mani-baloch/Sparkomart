import React from "react";
import { categories as defaultCategories, Category } from "@/data/categories";
import { CategoryCard } from "./CategoryCard";
import { SectionHeading } from "./SectionHeading";

interface CategorySectionProps {
  categories?: Category[];
}

export function CategorySection({ categories: customCategories }: CategorySectionProps) {
  const displayCategories = customCategories && customCategories.length > 0
    ? customCategories
    : defaultCategories;

  return (
    <section id="categories" className="w-full bg-white py-12 md:py-16">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Shop by Category"
          subtitle="Explore our diverse range of products across multiple categories"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
