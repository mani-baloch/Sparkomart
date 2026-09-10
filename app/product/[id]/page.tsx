import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductById, getProducts } from "@/lib/services/products";
import { ProductDetailsClient } from "./ProductDetailsClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return {
      title: "Product Not Found | SparkoMart",
    };
  }

  return {
    title: `${product.name} | SparkoMart`,
    description:
      product.description ||
      `Shop ${product.name} in ${product.category} on SparkoMart for $${product.price}. Fast USA Shipping and quality guaranteed.`,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  // Related products from the same category
  const allCategoryProducts = await getProducts(product.category);
  const relatedProducts = allCategoryProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <ProductDetailsClient
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
