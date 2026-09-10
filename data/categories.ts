export interface Category {
  id: string;
  title: string;
  description: string;
  image: string;
  cta: string;
  href: string;
}

export const categories: Category[] = [
  {
    id: "electronics",
    title: "Electronics",
    description: "Latest gadgets, smartphones, laptops, tablets, and electronic accessories for tech enthusiasts.",
    image: "/images/electronics.jpg",
    cta: "Shop Now →",
    href: "/category/electronics",
  },
  {
    id: "clothing-fashion",
    title: "Clothing & Fashion",
    description: "Trendy clothing, shoes, accessories, and fashion items for men, women, and children.",
    image: "/images/clothing-store.jpg",
    cta: "Shop Now →",
    href: "/category/clothing-fashion",
  },
  {
    id: "home-kitchen",
    title: "Home & Kitchen",
    description: "Everything for your home including furniture, kitchen appliances, decor, and housewares.",
    image: "/images/home-kitchen.jpg",
    cta: "Shop Now →",
    href: "/category/home-kitchen",
  },
  {
    id: "sports-outdoors",
    title: "Sports & Outdoors",
    description: "Sports equipment, outdoor gear, fitness accessories, and adventure essentials for active lifestyles.",
    image: "/images/sports-outdoors.jpg",
    cta: "Shop Now →",
    href: "/category/sports-outdoors",
  },
  {
    id: "books-media",
    title: "Books & Media",
    description: "Bestselling novels, educational guides, journals, and literature for passionate readers.",
    image: "/images/books.jpg",
    cta: "Shop Now →",
    href: "/category/books-media",
  },
  {
    id: "health-beauty",
    title: "Health & Beauty",
    description: "Skincare essentials, cosmetics, natural wellness, and personal care routines.",
    image: "/images/beauty.jpg",
    cta: "Shop Now →",
    href: "/category/health-beauty",
  },
];
