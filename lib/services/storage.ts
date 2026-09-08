import { createBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

export async function uploadProductImage(
  file: File
): Promise<{ url: string | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return {
      url: null,
      error: "Supabase credentials are not configured in .env.local",
    };
  }

  const supabase = createBrowserClient();
  if (!supabase) {
    return { url: null, error: "Failed to initialize Supabase client" };
  }

  try {
    const fileExt = file.name.split(".").pop() || "jpg";
    const cleanFileName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9]/g, "-")
      .toLowerCase();
    const filePath = `products/${Date.now()}-${cleanFileName}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      return { url: null, error: uploadError.message };
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    return { url: data.publicUrl, error: null };
  } catch (err: any) {
    return {
      url: null,
      error: err.message || "An unexpected error occurred during image upload",
    };
  }
}
