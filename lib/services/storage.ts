import { createBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

/**
 * Resizes and compresses an image in the browser before upload to ensure
 * fast uploads and standard JPEG/PNG formatting even for .jfif or large camera photos.
 */
async function processImageFile(
  file: File
): Promise<{ uploadBlob: Blob; dataUrl: string; cleanExt: string; mimeType: string }> {
  // Normalize extension
  const rawExt = (file.name.split(".").pop() || "jpg").toLowerCase();
  const cleanExt = rawExt === "jfif" ? "jpg" : rawExt;

  let mimeType = file.type;
  if (!mimeType || mimeType === "image/jfif" || cleanExt === "jpg" || cleanExt === "jpeg") {
    mimeType = "image/jpeg";
  } else if (cleanExt === "png") {
    mimeType = "image/png";
  } else if (cleanExt === "webp") {
    mimeType = "image/webp";
  }

  // If in SSR or no window, return original
  if (typeof window === "undefined") {
    return { uploadBlob: file, dataUrl: "", cleanExt, mimeType };
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onerror = () => {
      resolve({ uploadBlob: file, dataUrl: "", cleanExt, mimeType });
    };
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new window.Image();
      img.onerror = () => {
        resolve({ uploadBlob: file, dataUrl, cleanExt, mimeType });
      };
      img.onload = () => {
        try {
          const maxDim = 1400;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve({ uploadBlob: file, dataUrl, cleanExt, mimeType });
            return;
          }

          // White background for transparent or JPEG images
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const optimizedDataUrl = canvas.toDataURL(mimeType, 0.88);
                resolve({
                  uploadBlob: blob,
                  dataUrl: optimizedDataUrl,
                  cleanExt,
                  mimeType,
                });
              } else {
                resolve({ uploadBlob: file, dataUrl, cleanExt, mimeType });
              }
            },
            mimeType,
            0.88
          );
        } catch {
          resolve({ uploadBlob: file, dataUrl, cleanExt, mimeType });
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}

export async function uploadProductImage(
  file: File
): Promise<{ url: string | null; error: string | null; isFallback?: boolean }> {
  let processedDataUrl = "";

  try {
    const { uploadBlob, dataUrl, cleanExt, mimeType } = await processImageFile(file);
    processedDataUrl = dataUrl;

    if (!isSupabaseConfigured()) {
      return {
        url: processedDataUrl || URL.createObjectURL(file),
        error: null,
        isFallback: true,
      };
    }

    const supabase = createBrowserClient();
    if (!supabase) {
      return {
        url: processedDataUrl || URL.createObjectURL(file),
        error: null,
        isFallback: true,
      };
    }

    const cleanFileName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9]/g, "-")
      .toLowerCase();
    const filePath = `products/${Date.now()}-${cleanFileName}.${cleanExt}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, uploadBlob, {
        cacheControl: "3600",
        upsert: true,
        contentType: mimeType,
      });

    if (uploadError) {
      console.warn("Supabase storage upload issue, falling back to data URL:", uploadError.message);
      // Fallback to high quality data URL so the product image is NEVER lost
      if (processedDataUrl) {
        return { url: processedDataUrl, error: null, isFallback: true };
      }
      return { url: null, error: uploadError.message };
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    return { url: data.publicUrl, error: null };
  } catch (err: any) {
    console.warn("Unexpected image upload error, using fallback:", err);
    if (processedDataUrl) {
      return { url: processedDataUrl, error: null, isFallback: true };
    }
    return {
      url: null,
      error: err.message || "An unexpected error occurred during image upload",
    };
  }
}
