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

    const dbCategories: Category[] = data.map((item) => {
      const validHref =
        item.href && !item.href.startsWith("#")
          ? item.href
          : `/category/${item.id}`;

      return {
        id: item.id,
        title: item.title,
        description: item.description || "",
        image: item.image || "/images/home-kitchen.jpg",
        cta: item.cta || "Shop Now →",
        href: validHref,
      };
    });

    // Merge with fallback categories to ensure default categories are always available
    const existingIds = new Set(dbCategories.map((c) => c.id.toLowerCase()));
    const missingFallbacks = fallbackCategories.filter(
      (fb) => !existingIds.has(fb.id.toLowerCase())
    );

    return [...dbCategories, ...missingFallbacks];
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

  const targetHref =
    category.href && !category.href.startsWith("#")
      ? category.href
      : `/category/${slug}`;

  const { data, error } = await supabase
    .from("categories")
    .insert({
      id: slug,
      title: category.title,
      description: category.description || "",
      image: category.image || "",
      cta: category.cta || "Shop Now →",
      href: targetHref,
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

  const updatePayload: {
    title?: string;
    description?: string;
    image?: string;
    cta?: string;
    href?: string;
  } = {
    title: updates.title,
    description: updates.description,
    image: updates.image,
    cta: updates.cta,
  };

  if (updates.href !== undefined) {
    updatePayload.href =
      updates.href && !updates.href.startsWith("#")
        ? updates.href
        : `/category/${id}`;
  }

  const { error } = await supabase
    .from("categories")
    .update(updatePayload)
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
