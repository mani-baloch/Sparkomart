"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createBrowserClient } from "@/lib/supabase/client";

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  name: string;
}

interface AdminAuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initSession() {
      try {
        const client = createBrowserClient();
        if (client) {
          const { data } = await client.auth.getSession();
          if (data?.session?.user) {
            const sbUser: AdminUser = {
              id: data.session.user.id,
              email: data.session.user.email || "",
              role: (data.session.user.user_metadata?.role as string) || "admin",
              name:
                data.session.user.user_metadata?.name ||
                data.session.user.email?.split("@")[0] ||
                "Admin",
            };
            setUser(sbUser);
          }
        }
      } catch (err) {
        console.error("Failed to restore admin session:", err);
      } finally {
        setIsLoading(false);
      }
    }

    initSession();

    // Listen to Supabase auth state changes
    const client = createBrowserClient();
    if (client) {
      const {
        data: { subscription },
      } = client.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            role: (session.user.user_metadata?.role as string) || "admin",
            name:
              session.user.user_metadata?.name ||
              session.user.email?.split("@")[0] ||
              "Admin",
          });
        } else {
          setUser(null);
        }
        setIsLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      return { success: false, error: "Please enter both email and password." };
    }

    const client = createBrowserClient();
    if (!client) {
      return {
        success: false,
        error: "Supabase authentication is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment variables.",
      };
    }

    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPass,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data?.user) {
        const authUser: AdminUser = {
          id: data.user.id,
          email: data.user.email || cleanEmail,
          role: (data.user.user_metadata?.role as string) || "admin",
          name:
            data.user.user_metadata?.name ||
            data.user.email?.split("@")[0] ||
            "Admin",
        };
        setUser(authUser);
        return { success: true };
      }

      return { success: false, error: "Authentication failed. Please try again." };
    } catch (err: unknown) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "An unexpected error occurred.",
      };
    }
  };

  const logout = async () => {
    try {
      const client = createBrowserClient();
      if (client) {
        await client.auth.signOut();
      }
    } catch (err) {
      console.warn("SignOut warning:", err);
    } finally {
      setUser(null);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
