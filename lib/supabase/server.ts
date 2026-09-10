import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { isSupabaseConfigured } from "./client";

const DEFAULT_SUPABASE_URL = "https://hpzdmiugjnnkhajougzt.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_iKH6AhGhK8e1T5x-bMqhsw_yoR6xBcW";

export const createServerClient = (): SupabaseClient<Database> | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  });
};
