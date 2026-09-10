"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Plus, ExternalLink, LogOut, User, Check, X } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";

interface AdminHeaderProps {
  onMobileMenuToggle: () => void;
  title?: string;
  subtitle?: string;
}

export function AdminHeader({
  onMobileMenuToggle,
  title = "Admin Dashboard",
  subtitle,
}: AdminHeaderProps) {
  const router = useRouter();
  const { user, logout } = useAdminAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowLogoutConfirm(false);
    router.replace("/admin/login");
  };

  return (
    <header className="h-[76px] bg-white border-b border-gray-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-none">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1 hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/"
          target="_blank"
          className="hidden md:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors"
        >
          <span>View Store</span>
          <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
        </Link>

        <Link
          href="/admin/products?action=new"
          className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs font-bold text-white bg-linear-to-r from-[#FF7527] to-[#E8590C] hover:from-[#E8590C] hover:to-[#CF4A00] rounded-xl shadow-xs shadow-orange-500/30 transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Product</span>
          <span className="sm:hidden">Product</span>
        </Link>

        {/* User Badge & Logout */}
        <div className="relative pl-1 sm:pl-2 border-l border-gray-200">
          {!showLogoutConfirm ? (
            <div className="flex items-center gap-2">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs font-bold text-gray-900 leading-tight truncate max-w-[130px]">
                  {user?.name || "Admin"}
                </span>
                <span className="text-[10px] text-gray-500 truncate max-w-[130px]">
                  {user?.email || "admin@sparkomart.com"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(true)}
                title="Sign Out"
                className="p-2 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 border border-gray-200 hover:border-red-200 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-xs font-semibold hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-red-50 p-1 rounded-xl border border-red-200 animate-in fade-in">
              <span className="text-[11px] font-semibold text-red-700 px-2">
                Logout?
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="p-1 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                title="Confirm Logout"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="p-1 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                title="Cancel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
