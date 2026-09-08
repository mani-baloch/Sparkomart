import { createBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { products as fallbackProducts, Product } from "@/data/products";

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
}

export async function getProducts(categoryId?: string): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    if (categoryId) {
      return fallbackProducts.filter(
        (p) => p.category.toLowerCase() === categoryId.toLowerCase()
      );
    }
    return fallbackProducts;
  }

  const supabase = createBrowserClient();
  if (!supabase) return fallbackProducts;

  try {
    let query = supabase
      .from("products")
      .select("*, categories:category_id (title)")
      .order("created_at", { ascending: false });

    if (categoryId && categoryId !== "all") {
      query = query.eq("category_id", categoryId);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return fallbackProducts;
    }

    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      category: item.categories?.title || item.category_id || "General",
      rating: Number(item.rating) || 5.0,
      reviews: Number(item.reviews) || 0,
      price: Number(item.price) || 0,
      oldPrice: item.old_price ? Number(item.old_price) : Number(item.price),
      badge: item.badge || undefined,
      inStock: Boolean(item.in_stock),
      shipping: item.shipping || "Fast Shipping",
      image: item.image || "/images/hero-workspace.jpg",
    }));
  } catch (err) {
    console.warn("Failed to fetch products from Supabase, using fallback:", err);
    return fallbackProducts;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    return fallbackProducts.find((p) => p.id === id) || null;
  }

  const supabase = createBrowserClient();
  if (!supabase) return fallbackProducts.find((p) => p.id === id) || null;

  const { data, error } = await supabase
    .from("products")
    .select("*, categories:category_id (title)")
    .eq("id", id)
    .single();

  if (error || !data) return null;

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
  };
}

export async function createProduct(
  product: ProductInput
): Promise<{ data: any | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return {
      data: null,
      error: "Supabase credentials are not configured in .env.local",
    };
  }

  const supabase = createBrowserClient();
  if (!supabase) return { data: null, error: "Failed to initialize Supabase client" };

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

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function updateProduct(
  id: string,
  updates: Partial<ProductInput>
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase credentials are not configured in .env.local" };
  }

  const supabase = createBrowserClient();
  if (!supabase) return { error: "Failed to initialize Supabase client" };

  const payload: any = {};
  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.category_id !== undefined) payload.category_id = updates.category_id;
  if (updates.price !== undefined) payload.price = updates.price;
  if (updates.old_price !== undefined) payload.old_price = updates.old_price;
  if (updates.rating !== undefined) payload.rating = updates.rating;
  if (updates.reviews !== undefined) payload.reviews = updates.reviews;
  if (updates.badge !== undefined) payload.badge = updates.badge;
  if (updates.in_stock !== undefined) payload.in_stock = updates.in_stock;
  if (updates.shipping !== undefined) payload.shipping = updates.shipping;
  if (updates.image !== undefined) payload.image = updates.image;

  const { error } = await supabase.from("products").update(payload).eq("id", id);
  return { error: error ? error.message : null };
}

export async function deleteProduct(id: string): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase credentials are not configured in .env.local" };
  }

  const supabase = createBrowserClient();
  if (!supabase) return { error: "Failed to initialize Supabase client" };

  const { error } = await supabase.from("products").delete().eq("id", id);
  return { error: error ? error.message : null };
}
