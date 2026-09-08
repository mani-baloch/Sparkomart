export interface Product {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  price: number;
  oldPrice: number;
  badge?: string;
  inStock: boolean;
  shipping: string;
  image: string;
}

export const products: Product[] = [
  {
    id: "yoga-mat-premium",
    name: "Yoga Mat Premium",
    category: "Sports & Outdoors",
    rating: 4.9,
    reviews: 98,
    price: 49.99,
    oldPrice: 59.99,
    badge: "Sale",
    inStock: true,
    shipping: "Fast Shipping",
    image: "/images/yoga-mat.jpg",
  },
  {
    id: "kitchen-knife-set-pro",
    name: "Kitchen Knife Set Professional",
    category: "Home & Kitchen",
    rating: 4.9,
    reviews: 189,
    price: 129.99,
    oldPrice: 179.99,
    badge: "Sale",
    inStock: true,
    shipping: "Fast Shipping",
    image: "/images/knife-set.jpg",
  },
  {
    id: "stainless-steel-cookware",
    name: "Stainless Steel Cookware Set",
    category: "Home & Kitchen",
    rating: 4.8,
    reviews: 234,
    price: 149.99,
    oldPrice: 169.99,
    badge: "Sale",
    inStock: true,
    shipping: "Fast Shipping",
    image: "/images/cookware.jpg",
  },
  {
    id: "wireless-bluetooth-headphones",
    name: "Wireless Bluetooth Headphones",
    category: "Electronics",
    rating: 4.8,
    reviews: 324,
    price: 199.99,
    oldPrice: 249.99,
    badge: "Sale",
    inStock: true,
    shipping: "Fast Shipping",
    image: "/images/headphones.jpg",
  },
];
