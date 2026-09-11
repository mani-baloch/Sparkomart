import { createBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

export interface ContactMessage {
  id: string;
  full_name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied";
  created_at: string;
}

export interface ContactFormInput {
  fullName: string;
  email: string;
  subject?: string;
  message: string;
}

const LOCAL_STORAGE_KEY = "sparkomart_contact_messages";
const UPDATE_EVENT_KEY = "sparkomart_contact_messages_updated";

function getLocalMessages(): ContactMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => ({
          id: item.id || `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          full_name: item.full_name || item.fullName || "Anonymous",
          email: item.email || "",
          subject: item.subject || "General Inquiry",
          message: item.message || "",
          status: item.status || "unread",
          created_at: item.created_at || new Date().toISOString(),
        }));
      }
    }
  } catch (e) {
    console.warn("Failed to parse local contact messages:", e);
  }
  return [];
}

function saveLocalMessages(messages: ContactMessage[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
    window.dispatchEvent(new Event(UPDATE_EVENT_KEY));
  } catch (e) {
    console.error("Failed to save local contact messages:", e);
  }
}

/**
 * Submit a new contact message from website visitors.
 * Saves locally immediately and also to Supabase if connected.
 */
export async function submitContactMessage(
  input: ContactFormInput
): Promise<{ success: boolean; data?: ContactMessage; error?: string }> {
  const name = input.fullName.trim();
  const email = input.email.trim().toLowerCase();
  const subject = (input.subject || "").trim();
  const message = input.message.trim();

  if (!name) {
    return { success: false, error: "Please provide your full name." };
  }
  if (!email || !email.includes("@") || !email.includes(".")) {
    return { success: false, error: "Please enter a valid email address." };
  }
  if (!message) {
    return { success: false, error: "Please enter your message." };
  }

  const newId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const newMsg: ContactMessage = {
    id: newId,
    full_name: name,
    email: email,
    subject: subject || "General Inquiry",
    message: message,
    status: "unread",
    created_at: new Date().toISOString(),
  };

  // 1. Immediately save to LocalStorage (ensures zero data loss & instant cross-tab sync)
  const currentLocal = getLocalMessages();
  saveLocalMessages([newMsg, ...currentLocal]);

  // 2. Persist to Supabase if configured
  if (isSupabaseConfigured()) {
    const supabase = createBrowserClient();
    if (supabase) {
      try {
        const { error } = await supabase.from("contact_messages").insert({
          id: newMsg.id,
          full_name: newMsg.full_name,
          email: newMsg.email,
          subject: newMsg.subject,
          message: newMsg.message,
          status: newMsg.status,
          created_at: newMsg.created_at,
        });

        if (error) {
          console.warn("Supabase contact message sync notice:", error.message);
        }
      } catch (err) {
        console.warn("Supabase contact message connection error:", err);
      }
    }
  }

  return { success: true, data: newMsg };
}

/**
 * Fetch all contact messages for the Admin panel.
 * Merges Supabase messages with local storage messages.
 */
export async function getContactMessages(): Promise<ContactMessage[]> {
  const localList = getLocalMessages();

  if (isSupabaseConfigured()) {
    const supabase = createBrowserClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("contact_messages")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && Array.isArray(data)) {
          const dbMessages: ContactMessage[] = data.map((d) => ({
            id: d.id,
            full_name: d.full_name,
            email: d.email,
            subject: d.subject || "General Inquiry",
            message: d.message,
            status: (d.status as "unread" | "read" | "replied") || "unread",
            created_at: d.created_at,
          }));

          // Merge: include DB messages, plus any local messages not yet in DB
          const dbIds = new Set(dbMessages.map((m) => m.id));
          const localOnly = localList.filter((m) => !dbIds.has(m.id));

          const combined = [...dbMessages, ...localOnly].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );

          // Update local cache with combined fresh data
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(combined));
            } catch (e) {}
          }

          return combined;
        }
      } catch (err) {
        console.warn("Failed to load contact messages from Supabase, using local store:", err);
      }
    }
  }

  return localList.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

/**
 * Update the read/reply status of a message.
 */
export async function updateContactMessageStatus(
  id: string,
  status: "unread" | "read" | "replied"
): Promise<boolean> {
  // 1. Update in local storage
  const currentList = getLocalMessages();
  const updated = currentList.map((m) => (m.id === id ? { ...m, status } : m));
  saveLocalMessages(updated);

  // 2. Update in Supabase
  if (isSupabaseConfigured()) {
    const supabase = createBrowserClient();
    if (supabase) {
      try {
        await supabase
          .from("contact_messages")
          .update({ status })
          .eq("id", id);
      } catch (err) {
        console.warn("Failed to update status in Supabase:", err);
      }
    }
  }

  return true;
}

/**
 * Delete a contact message.
 */
export async function deleteContactMessage(id: string): Promise<boolean> {
  // 1. Remove from local store
  const currentList = getLocalMessages();
  const updated = currentList.filter((m) => m.id !== id);
  saveLocalMessages(updated);

  // 2. Remove from Supabase
  if (isSupabaseConfigured()) {
    const supabase = createBrowserClient();
    if (supabase) {
      try {
        await supabase
          .from("contact_messages")
          .delete()
          .eq("id", id);
      } catch (err) {
        console.warn("Failed to delete message from Supabase:", err);
      }
    }
  }

  return true;
}

/**
 * Get count of unread messages for sidebar badge.
 */
export function getUnreadMessagesCount(): number {
  const list = getLocalMessages();
  return list.filter((m) => m.status === "unread").length;
}

/**
 * Real-time subscription:
 * Listens to local window events, storage events (cross-tab sync),
 * and Supabase realtime postgres_changes (if available).
 */
export function subscribeToContactMessages(onUpdate: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handleLocalEvent = () => onUpdate();
  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === LOCAL_STORAGE_KEY) {
      onUpdate();
    }
  };

  window.addEventListener(UPDATE_EVENT_KEY, handleLocalEvent);
  window.addEventListener("storage", handleStorageEvent);

  let supabaseChannel: any = null;

  if (isSupabaseConfigured()) {
    try {
      const supabase = createBrowserClient();
      if (supabase) {
        supabaseChannel = supabase
          .channel("realtime-contact-messages")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "contact_messages" },
            () => {
              onUpdate();
            }
          )
          .subscribe();
      }
    } catch (err) {
      console.warn("Supabase realtime channel subscription notice:", err);
    }
  }

  return () => {
    window.removeEventListener(UPDATE_EVENT_KEY, handleLocalEvent);
    window.removeEventListener("storage", handleStorageEvent);
    if (supabaseChannel && isSupabaseConfigured()) {
      try {
        const supabase = createBrowserClient();
        if (supabase) {
          supabase.removeChannel(supabaseChannel);
        }
      } catch (e) {}
    }
  };
}
