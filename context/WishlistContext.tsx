"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { products as mockProducts } from "@/data/products";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  inStock?: boolean;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  wishlistIds: string[];
  toggleWishlist: (itemOrId: string | WishlistItem, name?: string, extra?: Partial<WishlistItem>) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  wishlistCount: number;
}

const STORAGE_KEY = "sparkomart_wishlist";

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  // Restore from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setWishlistItems(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Could not load wishlist from localStorage:", e);
    }
  }, []);

  // Save to localStorage
  const saveItems = (newItems: WishlistItem[]) => {
    setWishlistItems(newItems);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    } catch (e) {
      console.warn("Could not save wishlist to localStorage:", e);
    }
  };

  const toggleWishlist = (
    itemOrId: string | WishlistItem,
    name?: string,
    extra?: Partial<WishlistItem>
  ) => {
    const id = typeof itemOrId === "string" ? itemOrId : itemOrId.id;
    const exists = wishlistItems.some((item) => item.id === id);

    if (exists) {
      saveItems(wishlistItems.filter((item) => item.id !== id));
    } else {
      let newItem: WishlistItem;
      if (typeof itemOrId !== "string") {
        newItem = itemOrId;
      } else {
        const foundMock = mockProducts.find((p) => p.id === id);
        newItem = {
          id,
          name: name || foundMock?.name || "Product",
          price: extra?.price ?? foundMock?.price ?? 0,
          image: extra?.image ?? foundMock?.image ?? "/images/electronics.jpg",
          category: extra?.category ?? foundMock?.category ?? "General",
          inStock: extra?.inStock ?? foundMock?.inStock ?? true,
        };
      }
      saveItems([...wishlistItems, newItem]);
    }
  };

  const removeFromWishlist = (id: string) => {
    saveItems(wishlistItems.filter((item) => item.id !== id));
  };

  const isInWishlist = (id: string) => wishlistItems.some((item) => item.id === id);

  const wishlistIds = wishlistItems.map((item) => item.id);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistIds,
        toggleWishlist,
        removeFromWishlist,
        isInWishlist,
        wishlistCount: wishlistItems.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
