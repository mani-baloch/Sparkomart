"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Store,
  Database,
  ExternalLink,
  ChevronRight,
  Sparkles,
  LogOut,
  ShieldCheck,
  Mail,
  MessageSquare,
} from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { useAdminAuth } from "@/context/AdminAuthContext";
import {
  getUnreadMessagesCount,
  subscribeToContactMessages,
} from "@/lib/services/contact";

interface AdminSidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export function AdminSidebar({ mobileOpen, setMobileOpen }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAdminAuth();
  const [supabaseReady, setSupabaseReady] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    setSupabaseReady(isSupabaseConfigured());
    setUnreadMessages(getUnreadMessagesCount());

    const unsub = subscribeToContactMessages(() => {
      setUnreadMessages(getUnreadMessagesCount());
    });

    return () => {
      unsub();
    };
  }, []);

  const handleLogout = async () => {
    setMobileOpen(false);
    await logout();
    router.replace("/admin/login");
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: "Products",
      href: "/admin/products",
      icon: Package,
      exact: false,
    },
    {
      name: "Categories",
      href: "/admin/categories",
      icon: FolderTree,
      exact: false,
    },
    {
      name: "Messages",
      href: "/admin/messages",
      icon: MessageSquare,
      exact: false,
      badge: unreadMessages,
    },
    {
      name: "Subscribers",
      href: "/admin/subscribers",
      icon: Mail,
      exact: false,
    },
  ];

  const isActive = (itemHref: string, exact: boolean) => {
    if (exact) {
      return pathname === itemHref;
    }
    return pathname.startsWith(itemHref);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-white border-r border-gray-200/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-[76px] px-6 border-b border-gray-100 flex items-center justify-between">
          <Link
            href="/admin"
            className="flex items-center gap-3 group select-none"
            onClick={() => setMobileOpen(false)}
          >
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#FF7527] to-[#E8590C] flex items-center justify-center shadow-md shadow-orange-500/20 text-white font-black text-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-baseline">
                <span className="font-black text-lg tracking-tight text-[#F26E22]">
                  Sparko
                </span>
                <span className="font-black text-lg tracking-tight text-[#16375B]">
                  Mart
                </span>
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block -mt-1">
                Admin Panel
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-gray-500">
            Management
          </div>

          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                  active
                    ? "bg-[#16375B] text-white shadow-md shadow-[#16375B]/15"
                    : "text-gray-700 hover:bg-gray-100/80 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 ${
                      active ? "text-[#F2B52B]" : "text-gray-500"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {Boolean(item.badge && item.badge > 0) && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        active
                          ? "bg-orange-500 text-white"
                          : "bg-orange-100 text-[#F26E22]"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {active && <ChevronRight className="w-4 h-4 text-white/70" />}
                </div>
              </Link>
            );
          })}

          <div className="pt-6 px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-gray-500">
            Storefront
          </div>

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm text-gray-700 hover:bg-gray-100/80 hover:text-gray-900 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Store className="w-5 h-5 text-gray-500" />
              <span>Live Website</span>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-500" />
          </Link>
        </nav>

        {/* Admin User Card & Status Footer */}
        <div className="p-3 m-3 space-y-2.5">
          {/* User Account Info */}
          {user && (
            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-linear-to-br from-[#16375B] to-[#0E1726] flex items-center justify-center text-white font-bold text-xs shrink-0">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-gray-900 truncate">
                    {user.name || "Administrator"}
                  </div>
                  <div className="text-[10px] text-gray-500 truncate">
                    {user.email}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                title="Log Out"
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Supabase Status Footer */}
          <div className="p-3 rounded-2xl bg-gray-50/80 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-[#16375B]" />
                <span className="text-[11px] font-bold text-gray-800">
                  Database
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    supabaseReady
                      ? "bg-emerald-500 shadow-xs shadow-emerald-500/50 animate-pulse"
                      : "bg-amber-500"
                  }`}
                />
                <span className="text-[10px] font-semibold text-gray-600">
                  {supabaseReady ? "Connected" : "Mock"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
