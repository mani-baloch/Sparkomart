import React from "react";
import { Metadata } from "next";
import { CategoryClientPage } from "./CategoryClientPage";
import { getCategories } from "@/lib/services/categories";
import { getProducts } from "@/lib/services/products";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const normalizedSlug = slug.toLowerCase();
  const allCategories = await getCategories();

  const category = allCategories.find(
    (c) =>
      c.id.toLowerCase() === normalizedSlug ||
      c.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === normalizedSlug
  );

  const title = category ? `${category.title} | SparkoMart` : "Category | SparkoMart";
  const description = category
    ? category.description
    : "Explore top-quality products in this category on SparkoMart.";

  return {
    title,
    description,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const [allProducts, allCategories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <CategoryClientPage
      slug={slug}
      initialProducts={allProducts}
      initialCategories={allCategories}
    />
  );
}
