"use client";

import React from "react";
import Link from "next/link";
import { Menu, Plus, ExternalLink } from "lucide-react";

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

      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors"
        >
          <span>View Store</span>
          <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
        </Link>

        <Link
          href="/admin/products?action=new"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-linear-to-r from-[#FF7527] to-[#E8590C] hover:from-[#E8590C] hover:to-[#CF4A00] rounded-xl shadow-xs shadow-orange-500/30 transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Product</span>
        </Link>
      </div>
    </header>
  );
}
