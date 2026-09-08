import { createBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { categories as fallbackCategories, Category } from "@/data/categories";

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) {
    return fallbackCategories;
  }

  const supabase = createBrowserClient();
  if (!supabase) return fallbackCategories;

  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      return fallbackCategories;
    }

    return data.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      image: item.image || "/images/home-kitchen.jpg",
      cta: item.cta || "Shop Now →",
      href: item.href || `#${item.id}`,
    }));
  } catch (err) {
    console.warn("Failed to fetch categories from Supabase, using fallback:", err);
    return fallbackCategories;
  }
}

export async function createCategory(category: {
  id: string;
  title: string;
  description?: string;
  image?: string;
  cta?: string;
  href?: string;
}): Promise<{ data: Category | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return {
      data: null,
      error: "Supabase credentials are not configured in .env.local",
    };
  }

  const supabase = createBrowserClient();
  if (!supabase) return { data: null, error: "Failed to initialize Supabase client" };

  const slug = category.id.trim().toLowerCase().replace(/\s+/g, "-");

  const { data, error } = await supabase
    .from("categories")
    .insert({
      id: slug,
      title: category.title,
      description: category.description || "",
      image: category.image || "",
      cta: category.cta || "Shop Now →",
      href: category.href || `#${slug}`,
    })
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return {
    data: {
      id: data.id,
      title: data.title,
      description: data.description,
      image: data.image,
      cta: data.cta,
      href: data.href,
    },
    error: null,
  };
}

export async function updateCategory(
  id: string,
  updates: Partial<Category>
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase credentials are not configured in .env.local" };
  }

  const supabase = createBrowserClient();
  if (!supabase) return { error: "Failed to initialize Supabase client" };

  const { error } = await supabase
    .from("categories")
    .update({
      title: updates.title,
      description: updates.description,
      image: updates.image,
      cta: updates.cta,
      href: updates.href,
    })
    .eq("id", id);

  return { error: error ? error.message : null };
}

export async function deleteCategory(id: string): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase credentials are not configured in .env.local" };
  }

  const supabase = createBrowserClient();
  if (!supabase) return { error: "Failed to initialize Supabase client" };

  const { error } = await supabase.from("categories").delete().eq("id", id);
  return { error: error ? error.message : null };
}
