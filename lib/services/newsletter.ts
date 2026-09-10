import { createBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

export interface NewsletterSubscriber {
  id: string;
  email: string;
  created_at: string;
}

const LOCAL_STORAGE_KEY = "sparkomart_newsletter_subscribers";

function getLocalSubscribers(): NewsletterSubscriber[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => {
          if (typeof item === "string") {
            return {
              id: item,
              email: item,
              created_at: new Date().toISOString(),
            };
          }
          return item;
        });
      }
    }
  } catch (e) {
    console.warn("Failed to parse local subscribers:", e);
  }
  return [];
}

function saveLocalSubscribers(subscribers: NewsletterSubscriber[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(subscribers));
    window.dispatchEvent(new Event("sparkomart_newsletter_updated"));
  } catch (e) {
    console.error("Failed to save local subscribers:", e);
  }
}

export async function subscribeToNewsletter(email: string): Promise<{
  success: boolean;
  alreadySubscribed?: boolean;
  error?: string;
}> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes("@") || !cleanEmail.includes(".")) {
    return { success: false, error: "Please provide a valid email address." };
  }

  // 1. Check local cache
  const localList = getLocalSubscribers();
  if (localList.some((s) => s.email.toLowerCase() === cleanEmail)) {
    return { success: false, alreadySubscribed: true };
  }

  let dbSaved = false;

  // 2. Try saving to Supabase if configured
  if (isSupabaseConfigured()) {
    const supabase = createBrowserClient();
    if (supabase) {
      try {
        const { error } = await supabase
          .from("newsletter_subscribers")
          .insert({ email: cleanEmail });

        if (!error) {
          dbSaved = true;
        } else if (error.code === "23505") {
          // Unique constraint violation in Postgres
          return { success: false, alreadySubscribed: true };
        } else {
          console.warn("Supabase newsletter insert note:", error.message);
        }
      } catch (err) {
        console.warn("Supabase newsletter connection error:", err);
      }
    }
  }

  // 3. Always update local storage so data is safely preserved
  const newSub: NewsletterSubscriber = {
    id: `sub-${Date.now()}`,
    email: cleanEmail,
    created_at: new Date().toISOString(),
  };
  saveLocalSubscribers([newSub, ...localList]);

  return { success: true };
}

export async function getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
  const localList = getLocalSubscribers();

  if (isSupabaseConfigured()) {
    const supabase = createBrowserClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("newsletter_subscribers")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          // Merge Supabase and local list
          const dbEmails = new Set(data.map((d) => d.email.toLowerCase()));
          const combined = [
            ...data,
            ...localList.filter((l) => !dbEmails.has(l.email.toLowerCase())),
          ];
          return combined;
        }
      } catch (err) {
        console.warn("Failed to load subscribers from Supabase, using local store:", err);
      }
    }
  }

  return localList;
}

export async function deleteNewsletterSubscriber(email: string): Promise<boolean> {
  const cleanEmail = email.trim().toLowerCase();

  // Remove from Supabase
  if (isSupabaseConfigured()) {
    const supabase = createBrowserClient();
    if (supabase) {
      try {
        await supabase
          .from("newsletter_subscribers")
          .delete()
          .eq("email", cleanEmail);
      } catch (e) {
        console.warn("Failed to delete subscriber from Supabase:", e);
      }
    }
  }

  // Remove from local store
  const localList = getLocalSubscribers();
  const updated = localList.filter((s) => s.email.toLowerCase() !== cleanEmail);
  saveLocalSubscribers(updated);

  return true;
}
