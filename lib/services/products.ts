import { createBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { products as fallbackProducts, Product } from "@/data/products";
import { categories as defaultCategories } from "@/data/categories";

export interface ProductInput {
  name: string;
  category_id: string;
  price: number;
  old_price?: number | null;
  rating?: number;
  reviews?: number;
  badge?: string | null;
  in_stock?: boolean;
  shipping?: string;
  image?: string;
  description?: string;
}

const STORAGE_KEY = "sparkomart_products_catalog";

function getLocalProducts(): Product[] {
  if (typeof window === "undefined") return fallbackProducts;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Failed to load local products store", e);
  }

  // Initialize with fallback
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackProducts));
  } catch (e) {}
  return fallbackProducts;
}

function saveLocalProducts(items: Product[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("sparkomart_products_updated"));
  } catch (e) {
    console.error("Failed to save local products", e);
  }
}

export async function getProducts(categoryId?: string): Promise<Product[]> {
  let allProducts = getLocalProducts();

  if (isSupabaseConfigured()) {
    const supabase = createBrowserClient();
    if (supabase) {
      try {
        let query = supabase
          .from("products")
          .select("*, categories:category_id (title)")
          .order("created_at", { ascending: false });

        if (categoryId && categoryId !== "all") {
          query = query.eq("category_id", categoryId);
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          allProducts = data.map((item: any) => {
            const matchedCat = defaultCategories.find(
              (c) => c.id.toLowerCase() === (item.category_id || "").toLowerCase()
            );
            const fallback = fallbackProducts.find((fp) => fp.id === item.id);

            return {
              id: item.id,
              name: item.name,
              category: item.categories?.title || matchedCat?.title || item.category_id || "General",
              rating: Number(item.rating) || 5.0,
              reviews: Number(item.reviews) || 0,
              price: Number(item.price) || 0,
              oldPrice: item.old_price ? Number(item.old_price) : Number(item.price),
              badge: item.badge || undefined,
              inStock: Boolean(item.in_stock),
              shipping: item.shipping || "Fast Shipping",
              image: item.image || fallback?.image || "/images/hero-workspace.jpg",
              description: item.description || fallback?.description || undefined,
            };
          });
          saveLocalProducts(allProducts);
        }
      } catch (err) {
        console.warn("Using local catalog:", err);
      }
    }
  }

  if (categoryId && categoryId !== "all") {
    const normSearch = categoryId.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return allProducts.filter((p) => {
      const normCat = p.category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return normCat === normSearch || p.category.toLowerCase() === categoryId.toLowerCase();
    });
  }

  return allProducts;
}

export async function getProductById(id: string): Promise<Product | null> {
  const allProducts = getLocalProducts();
  const normalizedId = id.toLowerCase();

  // Check in local catalog first
  let match = allProducts.find(
    (p) =>
      p.id.toLowerCase() === normalizedId ||
      p.id.toLowerCase().replace(/[^a-z0-9]+/g, "-") === normalizedId ||
      p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === normalizedId
  );

  // Alias support for 4K Smart TV
  if (!match && (normalizedId === "smart-tv-4k-ultra-hd" || normalizedId === "4k-smart-tv-55-inch")) {
    match = allProducts.find(
      (p) => p.id === "4k-smart-tv-55-inch" || p.id === "smart-tv-4k-ultra-hd"
    );
  }

  if (match) return match;

  if (isSupabaseConfigured()) {
    const supabase = createBrowserClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories:category_id (title)")
        .eq("id", id)
        .single();

      if (!error && data) {
        return {
          id: data.id,
          name: data.name,
          category: (data as any).categories?.title || data.category_id || "General",
          rating: Number(data.rating) || 5.0,
          reviews: Number(data.reviews) || 0,
          price: Number(data.price) || 0,
          oldPrice: data.old_price ? Number(data.old_price) : Number(data.price),
          badge: data.badge || undefined,
          inStock: Boolean(data.in_stock),
          shipping: data.shipping || "Fast Shipping",
          image: data.image || "/images/hero-workspace.jpg",
          description: (data as any).description || undefined,
        };
      }
    }
  }

  return null;
}

export async function createProduct(
  product: ProductInput
): Promise<{ data: any | null; error: string | null }> {
  // Find category title
  const matchedCat = defaultCategories.find(
    (c) =>
      c.id.toLowerCase() === product.category_id.toLowerCase() ||
      c.title.toLowerCase() === product.category_id.toLowerCase()
  );
  const categoryTitle = matchedCat ? matchedCat.title : product.category_id;

  const tempId =
    product.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") +
    "-" +
    Math.random().toString(36).slice(2, 6);

  const newProduct: Product = {
    id: tempId,
    name: product.name,
    category: categoryTitle,
    price: product.price,
    oldPrice: product.old_price ?? product.price,
    rating: product.rating ?? 5.0,
    reviews: product.reviews ?? 0,
    badge: product.badge ?? undefined,
    inStock: product.in_stock ?? true,
    shipping: product.shipping || "Fast Shipping",
    image: product.image || "/images/hero-workspace.jpg",
    description: product.description || undefined,
  };

  // Local catalog save
  const currentList = getLocalProducts();
  const updatedList = [newProduct, ...currentList];
  saveLocalProducts(updatedList);

  if (isSupabaseConfigured()) {
    const supabase = createBrowserClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("products")
          .insert({
            name: product.name,
            category_id: product.category_id,
            price: product.price,
            old_price: product.old_price ?? null,
            rating: product.rating ?? 5.0,
            reviews: product.reviews ?? 0,
            badge: product.badge ?? null,
            in_stock: product.in_stock ?? true,
            shipping: product.shipping || "Fast Shipping",
            image: product.image || "/images/hero-workspace.jpg",
          })
          .select()
          .single();

        if (!error && data) {
          return { data: { ...newProduct, id: data.id }, error: null };
        }
      } catch (err) {
        console.warn("Supabase insert error:", err);
      }
    }
  }

  return { data: newProduct, error: null };
}

export async function updateProduct(
  id: string,
  updates: Partial<ProductInput>
): Promise<{ error: string | null }> {
  const currentList = getLocalProducts();
  const index = currentList.findIndex((p) => p.id === id);
  if (index !== -1) {
    let categoryTitle = currentList[index].category;
    if (updates.category_id) {
      const matched = defaultCategories.find(
        (c) =>
          c.id.toLowerCase() === updates.category_id!.toLowerCase() ||
          c.title.toLowerCase() === updates.category_id!.toLowerCase()
      );
      categoryTitle = matched ? matched.title : updates.category_id;
    }

    currentList[index] = {
      ...currentList[index],
      ...(updates.name !== undefined && { name: updates.name }),
      ...(updates.category_id !== undefined && { category: categoryTitle }),
      ...(updates.price !== undefined && { price: updates.price }),
      ...(updates.old_price !== undefined && {
        oldPrice: updates.old_price ?? updates.price ?? currentList[index].oldPrice,
      }),
      ...(updates.rating !== undefined && { rating: updates.rating }),
      ...(updates.reviews !== undefined && { reviews: updates.reviews }),
      ...(updates.badge !== undefined && { badge: updates.badge || undefined }),
      ...(updates.in_stock !== undefined && { inStock: updates.in_stock }),
      ...(updates.shipping !== undefined && { shipping: updates.shipping }),
      ...(updates.image !== undefined && { image: updates.image }),
      ...(updates.description !== undefined && { description: updates.description }),
    };
    saveLocalProducts(currentList);
  }

  if (isSupabaseConfigured()) {
    const supabase = createBrowserClient();
    if (supabase) {
      try {
        const dbUpdates: any = {};
        if (updates.name !== undefined) dbUpdates.name = updates.name;
        if (updates.category_id !== undefined) dbUpdates.category_id = updates.category_id;
        if (updates.price !== undefined) dbUpdates.price = updates.price;
        if (updates.old_price !== undefined) dbUpdates.old_price = updates.old_price;
        if (updates.rating !== undefined) dbUpdates.rating = updates.rating;
        if (updates.reviews !== undefined) dbUpdates.reviews = updates.reviews;
        if (updates.badge !== undefined) dbUpdates.badge = updates.badge;
        if (updates.in_stock !== undefined) dbUpdates.in_stock = updates.in_stock;
        if (updates.shipping !== undefined) dbUpdates.shipping = updates.shipping;
        if (updates.image !== undefined) dbUpdates.image = updates.image;
        await supabase.from("products").update(dbUpdates).eq("id", id);
      } catch (err) {
        console.warn("Supabase update error:", err);
      }
    }
  }

  return { error: null };
}

export async function deleteProduct(id: string): Promise<{ error: string | null }> {
  const currentList = getLocalProducts();
  const filtered = currentList.filter((p) => p.id !== id);
  saveLocalProducts(filtered);

  if (isSupabaseConfigured()) {
    const supabase = createBrowserClient();
    if (supabase) {
      try {
        await supabase.from("products").delete().eq("id", id);
      } catch (err) {
        console.warn("Supabase delete error:", err);
      }
    }
  }

  return { error: null };
}
