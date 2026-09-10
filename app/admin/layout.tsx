"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminAuthProvider, useAdminAuth } from "@/context/AdminAuthContext";
import { Sparkles, ShieldAlert } from "lucide-react";

function AdminLayoutGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  // Redirect to login if unauthenticated on protected routes
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoginPage) {
      router.replace("/admin/login");
    }
  }, [isLoading, isAuthenticated, isLoginPage, router]);

  // If on login page, render it directly without sidebar/header
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="w-14 h-14 rounded-2xl bg-linear-to-tr from-[#FF7527] to-[#E8590C] flex items-center justify-center shadow-xl shadow-orange-500/25 animate-pulse mb-4">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <div className="text-sm font-bold text-gray-800">SparkoMart Admin</div>
        <div className="text-xs text-gray-500 mt-1">Authenticating session...</div>
      </div>
    );
  }

  // If not authenticated and not yet redirected, show access guard
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-3">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div className="text-sm font-bold text-gray-900">Access Restricted</div>
        <div className="text-xs text-gray-500 mt-1">Redirecting to admin login...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/60 flex">
      {/* Sidebar */}
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 transition-all duration-300">
        <AdminHeader
          onMobileMenuToggle={() => setMobileOpen((prev) => !prev)}
        />
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <AdminLayoutGuard>{children}</AdminLayoutGuard>
    </AdminAuthProvider>
  );
}
