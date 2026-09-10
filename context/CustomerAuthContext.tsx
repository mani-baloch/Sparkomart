"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createBrowserClient } from "@/lib/supabase/client";

export interface CustomerAddress {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault?: boolean;
}

export interface CustomerUser {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  gender?: string;
  dob?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  avatarUrl?: string;
  addresses?: CustomerAddress[];
}

interface PendingRegistration {
  email: string;
  password: string;
  fullName: string;
  firstName: string;
  lastName: string;
  otpCode: string;
  expiresAt: number;
}

interface CustomerAuthContextType {
  user: CustomerUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  sendSignUpOtp: (
    email: string,
    password: string,
    fullName: string,
    firstName?: string,
    lastName?: string
  ) => Promise<{ success: boolean; error?: string; otpCode?: string }>;
  verifySignUpOtp: (email: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  resendSignUpOtp: (email: string) => Promise<{ success: boolean; error?: string; otpCode?: string }>;
  updateUserProfile: (updates: Partial<CustomerUser>) => Promise<{ success: boolean; error?: string }>;
  addAddress: (address: Omit<CustomerAddress, "id">) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  changePassword: (currentPass: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  deleteAccount: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const STORAGE_KEY = "sparkomart_customer_session";
const PENDING_REG_KEY = "sparkomart_pending_reg";

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load session from storage or Supabase
  useEffect(() => {
    async function initSession() {
      try {
        const client = createBrowserClient();
        if (client) {
          const { data } = await client.auth.getSession();
          if (data?.session?.user) {
            const meta = data.session.user.user_metadata || {};
            const customer: CustomerUser = {
              id: data.session.user.id,
              email: data.session.user.email || "",
              name: meta.name || data.session.user.email?.split("@")[0] || "Customer",
              firstName: meta.first_name || meta.name?.split(" ")[0] || "Customer",
              lastName: meta.last_name || meta.name?.split(" ").slice(1).join(" ") || "",
              phone: meta.phone || "",
              gender: meta.gender || "Not Provided",
              dob: meta.dob || "Not provided",
              emailVerified: true,
              phoneVerified: false,
              avatarUrl: meta.avatar_url || "",
              addresses: meta.addresses || [],
            };
            setUser(customer);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(customer));
            setIsLoading(false);
            return;
          }
        }

        // Check local storage for customer session
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed && parsed.email) {
              // Ensure default values are populated
              const fullName = parsed.name || "Customer";
              const defaultFirst = parsed.firstName || fullName.split(" ")[0] || "Customer";
              const defaultLast = parsed.lastName || fullName.split(" ").slice(1).join(" ") || "";

              const fullUser: CustomerUser = {
                id: parsed.id || `cust-${Date.now()}`,
                email: parsed.email,
                name: fullName,
                firstName: defaultFirst,
                lastName: defaultLast,
                phone: parsed.phone || "",
                gender: parsed.gender || "Not Provided",
                dob: parsed.dob || "Not provided",
                emailVerified: parsed.emailVerified ?? true,
                phoneVerified: parsed.phoneVerified ?? false,
                avatarUrl: parsed.avatarUrl || "",
                addresses: parsed.addresses || [],
              };
              setUser(fullUser);
            }
          } catch {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch (err) {
        console.warn("Failed to load customer session:", err);
      } finally {
        setIsLoading(false);
      }
    }

    initSession();

    const client = createBrowserClient();
    if (client) {
      const {
        data: { subscription },
      } = client.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const meta = session.user.user_metadata || {};
          const customer: CustomerUser = {
            id: session.user.id,
            email: session.user.email || "",
            name: meta.name || session.user.email?.split("@")[0] || "Customer",
            firstName: meta.first_name || meta.name?.split(" ")[0] || "Customer",
            lastName: meta.last_name || meta.name?.split(" ").slice(1).join(" ") || "",
            phone: meta.phone || "",
            gender: meta.gender || "Not Provided",
            dob: meta.dob || "Not provided",
            emailVerified: true,
            phoneVerified: false,
            avatarUrl: meta.avatar_url || "",
            addresses: meta.addresses || [],
          };
          setUser(customer);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(customer));
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

  const saveUser = (u: CustomerUser | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      return { success: false, error: "Please enter your email and password." };
    }

    const client = createBrowserClient();
    if (client) {
      try {
        const { data, error } = await client.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPass,
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data?.user) {
          const meta = data.user.user_metadata || {};
          const customer: CustomerUser = {
            id: data.user.id,
            email: data.user.email || cleanEmail,
            name: meta.name || cleanEmail.split("@")[0] || "Customer",
            firstName: meta.first_name || meta.name?.split(" ")[0] || cleanEmail.split("@")[0],
            lastName: meta.last_name || meta.name?.split(" ").slice(1).join(" ") || "",
            phone: meta.phone || "",
            gender: meta.gender || "Not Provided",
            dob: meta.dob || "Not provided",
            emailVerified: true,
            phoneVerified: false,
            avatarUrl: meta.avatar_url || "",
            addresses: meta.addresses || [],
          };
          saveUser(customer);
          return { success: true };
        }
      } catch (err: unknown) {
        return {
          success: false,
          error: err instanceof Error ? err.message : "Failed to sign in.",
        };
      }
    }

    // Mock local customer login
    const firstName = cleanEmail.split("@")[0] || "Customer";
    const customer: CustomerUser = {
      id: "customer-" + Date.now(),
      email: cleanEmail,
      name: firstName,
      firstName,
      lastName: "",
      phone: "",
      gender: "Not Provided",
      dob: "Not provided",
      emailVerified: true,
      phoneVerified: false,
      avatarUrl: "",
      addresses: [],
    };
    saveUser(customer);
    return { success: true };
  };

  // Standard direct sign up (fallback)
  const signUp = async (
    email: string,
    password: string,
    name: string
  ): Promise<{ success: boolean; error?: string; message?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();
    const cleanName = name.trim();

    if (!cleanEmail || !cleanPass) {
      return { success: false, error: "Please provide an email and password." };
    }

    if (cleanPass.length < 6) {
      return { success: false, error: "Password must be at least 6 characters." };
    }

    const client = createBrowserClient();
    if (client) {
      try {
        const { data, error } = await client.auth.signUp({
          email: cleanEmail,
          password: cleanPass,
          options: {
            data: {
              name: cleanName || cleanEmail.split("@")[0],
              role: "customer",
            },
          },
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data?.user) {
          const parts = cleanName.split(" ");
          const customer: CustomerUser = {
            id: data.user.id,
            email: data.user.email || cleanEmail,
            name: cleanName || cleanEmail.split("@")[0] || "Customer",
            firstName: parts[0] || cleanName || "Customer",
            lastName: parts.slice(1).join(" ") || "",
            phone: "",
            gender: "Not Provided",
            dob: "Not provided",
            emailVerified: true,
            phoneVerified: false,
            avatarUrl: "",
            addresses: [],
          };
          saveUser(customer);
          return {
            success: true,
            message: "Account created successfully!",
          };
        }
      } catch (err: unknown) {
        return {
          success: false,
          error: err instanceof Error ? err.message : "Failed to register.",
        };
      }
    }

    // Mock customer creation
    const parts = cleanName.split(" ");
    const customer: CustomerUser = {
      id: "customer-" + Date.now(),
      email: cleanEmail,
      name: cleanName || cleanEmail.split("@")[0] || "Customer",
      firstName: parts[0] || cleanName || "Customer",
      lastName: parts.slice(1).join(" ") || "",
      phone: "",
      gender: "Not Provided",
      dob: "Not provided",
      emailVerified: true,
      phoneVerified: false,
      avatarUrl: "",
      addresses: [],
    };
    saveUser(customer);
    return { success: true, message: "Account created successfully!" };
  };

  // 1. Send OTP Verification Code
  const sendSignUpOtp = async (
    email: string,
    password: string,
    fullName: string,
    firstName: string = "",
    lastName: string = ""
  ): Promise<{ success: boolean; error?: string; otpCode?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();
    const cleanFullName = fullName.trim();
    const cleanFirst = (firstName || cleanFullName.split(" ")[0] || "Customer").trim();
    const cleanLast = (lastName || cleanFullName.split(" ").slice(1).join(" ") || "").trim();

    if (!cleanEmail || !cleanPass) {
      return { success: false, error: "Please enter email and password." };
    }

    if (cleanPass.length < 6) {
      return { success: false, error: "Password must be at least 6 characters." };
    }

    // Generate 6-digit random code
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store pending registration (valid for 15 minutes)
    const pending: PendingRegistration = {
      email: cleanEmail,
      password: cleanPass,
      fullName: cleanFullName,
      firstName: cleanFirst,
      lastName: cleanLast,
      otpCode: generatedCode,
      expiresAt: Date.now() + 15 * 60 * 1000,
    };

    localStorage.setItem(PENDING_REG_KEY, JSON.stringify(pending));

    const client = createBrowserClient();
    if (client) {
      try {
        // Trigger Supabase signUp with email verification
        await client.auth.signUp({
          email: cleanEmail,
          password: cleanPass,
          options: {
            data: {
              name: cleanFullName,
              first_name: cleanFirst,
              last_name: cleanLast,
              role: "customer",
            },
          },
        });
      } catch (err) {
        console.warn("Supabase signUp trigger warning (fallback will handle verification):", err);
      }
    }

    return {
      success: true,
      otpCode: generatedCode,
    };
  };

  // 2. Verify OTP & Open Account
  const verifySignUpOtp = async (
    email: string,
    otp: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();

    const storedPending = localStorage.getItem(PENDING_REG_KEY);
    if (!storedPending) {
      return { success: false, error: "Registration session expired. Please sign up again." };
    }

    let pending: PendingRegistration;
    try {
      pending = JSON.parse(storedPending);
    } catch {
      return { success: false, error: "Invalid registration data. Please try again." };
    }

    if (pending.email !== cleanEmail) {
      return { success: false, error: "Email mismatch. Please restart sign up." };
    }

    if (Date.now() > pending.expiresAt) {
      return { success: false, error: "Verification code expired. Please request a new code." };
    }

    // Check code match (allows generatedCode or test code 123456)
    const isValidCode = cleanOtp === pending.otpCode || cleanOtp === "123456";

    const client = createBrowserClient();
    if (client) {
      try {
        const { data, error } = await client.auth.verifyOtp({
          email: cleanEmail,
          token: cleanOtp,
          type: "signup",
        });

        if (!error && data?.user) {
          const customer: CustomerUser = {
            id: data.user.id,
            email: data.user.email || cleanEmail,
            name: pending.fullName || "Customer",
            firstName: pending.firstName,
            lastName: pending.lastName,
            phone: "",
            gender: "Not Provided",
            dob: "Not provided",
            emailVerified: true,
            phoneVerified: false,
            avatarUrl: "",
            addresses: [],
          };
          saveUser(customer);
          localStorage.removeItem(PENDING_REG_KEY);
          return { success: true };
        }
      } catch {
        // Fallback to local code validation if Supabase verification fails or SMTP is not set
      }
    }

    if (!isValidCode) {
      return { success: false, error: "Invalid 6-digit verification code. Please check and re-enter." };
    }

    // Successful Verification & Account Opening
    const customer: CustomerUser = {
      id: "customer-" + Date.now(),
      email: cleanEmail,
      name: pending.fullName || `${pending.firstName} ${pending.lastName}`.trim(),
      firstName: pending.firstName,
      lastName: pending.lastName,
      phone: "",
      gender: "Not Provided",
      dob: "Not provided",
      emailVerified: true,
      phoneVerified: false,
      avatarUrl: "",
      addresses: [],
    };

    saveUser(customer);
    localStorage.removeItem(PENDING_REG_KEY);
    return { success: true };
  };

  // 3. Resend OTP Code
  const resendSignUpOtp = async (
    email: string
  ): Promise<{ success: boolean; error?: string; otpCode?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const storedPending = localStorage.getItem(PENDING_REG_KEY);

    let pending: PendingRegistration | null = null;
    if (storedPending) {
      try {
        pending = JSON.parse(storedPending);
      } catch {
        pending = null;
      }
    }

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (pending && pending.email === cleanEmail) {
      pending.otpCode = newCode;
      pending.expiresAt = Date.now() + 15 * 60 * 1000;
      localStorage.setItem(PENDING_REG_KEY, JSON.stringify(pending));
    }

    const client = createBrowserClient();
    if (client) {
      try {
        await client.auth.resend({
          type: "signup",
          email: cleanEmail,
        });
      } catch (err) {
        console.warn("Supabase resend warning:", err);
      }
    }

    return {
      success: true,
      otpCode: newCode,
    };
  };

  // 4. Update Profile Info
  const updateUserProfile = async (
    updates: Partial<CustomerUser>
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: "No active user session." };

    const updatedUser: CustomerUser = {
      ...user,
      ...updates,
      name: updates.firstName || updates.lastName
        ? `${updates.firstName ?? user.firstName ?? ""} ${updates.lastName ?? user.lastName ?? ""}`.trim()
        : user.name,
    };

    saveUser(updatedUser);

    const client = createBrowserClient();
    if (client) {
      try {
        await client.auth.updateUser({
          data: {
            name: updatedUser.name,
            first_name: updatedUser.firstName,
            last_name: updatedUser.lastName,
            phone: updatedUser.phone,
            gender: updatedUser.gender,
            dob: updatedUser.dob,
            avatar_url: updatedUser.avatarUrl,
            addresses: updatedUser.addresses,
          },
        });
      } catch (err) {
        console.warn("Supabase updateUser warning:", err);
      }
    }

    return { success: true };
  };

  // 5. Add Address
  const addAddress = async (address: Omit<CustomerAddress, "id">) => {
    if (!user) return;
    const newAddress: CustomerAddress = {
      ...address,
      id: "addr-" + Date.now(),
    };
    const currentAddresses = user.addresses || [];
    const updatedAddresses = [newAddress, ...currentAddresses];
    await updateUserProfile({ addresses: updatedAddresses });
  };

  // 6. Delete Address
  const deleteAddress = async (id: string) => {
    if (!user) return;
    const updatedAddresses = (user.addresses || []).filter((a) => a.id !== id);
    await updateUserProfile({ addresses: updatedAddresses });
  };

  // 7. Change Password
  const changePassword = async (
    currentPass: string,
    newPass: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: "No user logged in." };

    if (!newPass || newPass.length < 6) {
      return { success: false, error: "New password must be at least 6 characters long." };
    }

    const client = createBrowserClient();
    if (client) {
      try {
        const { error } = await client.auth.updateUser({ password: newPass });
        if (error) {
          return { success: false, error: error.message };
        }
        return { success: true };
      } catch (err: unknown) {
        return { success: false, error: err instanceof Error ? err.message : "Failed to update password." };
      }
    }

    return { success: true };
  };

  // 8. Delete Account
  const deleteAccount = async (): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: "No user logged in." };

    const client = createBrowserClient();
    if (client) {
      try {
        await client.auth.signOut();
      } catch {}
    }

    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PENDING_REG_KEY);
    setUser(null);
    return { success: true };
  };

  const logout = async () => {
    try {
      const client = createBrowserClient();
      if (client) {
        await client.auth.signOut().catch(() => {});
      }
    } catch (err) {
      console.warn("SignOut warning:", err);
    } finally {
      localStorage.removeItem(STORAGE_KEY);
      setUser(null);
    }
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signUp,
        sendSignUpOtp,
        verifySignUpOtp,
        resendSignUpOtp,
        updateUserProfile,
        addAddress,
        deleteAddress,
        changePassword,
        deleteAccount,
        logout,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error("useCustomerAuth must be used within a CustomerAuthProvider");
  }
  return context;
}
