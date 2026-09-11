"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  FolderTree,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ArrowRight,
  TrendingUp,
  Database,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import { getProducts } from "@/lib/services/products";
import { getCategories } from "@/lib/services/categories";
import {
  getContactMessages,
  subscribeToContactMessages,
  ContactMessage,
} from "@/lib/services/contact";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { Product } from "@/data/products";
import { Category } from "@/data/categories";

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [supabaseConnected, setSupabaseConnected] = useState(false);

  useEffect(() => {
    setSupabaseConnected(isSupabaseConfigured());

    async function loadData() {
      setLoading(true);
      try {
        const [prodData, catData, msgData] = await Promise.all([
          getProducts(),
          getCategories(),
          getContactMessages(),
        ]);
        setProducts(prodData);
        setCategories(catData);
        setMessages(msgData);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();

    // Subscribe to live contact messages updates
    const unsub = subscribeToContactMessages(async () => {
      try {
        const fresh = await getContactMessages();
        setMessages(fresh);
      } catch (e) {}
    });

    return () => {
      unsub();
    };
  }, []);

  const totalProducts = products.length;
  const inStockCount = products.filter((p) => p.inStock).length;
  const outOfStockCount = totalProducts - inStockCount;
  const totalCategories = categories.length;
  const totalMessages = messages.length;
  const unreadMessages = messages.filter((m) => m.status === "unread").length;

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Store Overview
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your SparkoMart catalog, inventory, and categories in real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Link
            href="/admin/messages"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl shadow-xs transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-[#F26E22]" />
            <span>Messages ({totalMessages})</span>
            {unreadMessages > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-orange-100 text-[#F26E22] text-[10px] font-bold">
                {unreadMessages} new
              </span>
            )}
          </Link>
          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl shadow-xs transition-colors"
          >
            <FolderTree className="w-4 h-4 text-[#16375B]" />
            <span>Categories ({totalCategories})</span>
          </Link>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold text-white bg-[#16375B] hover:bg-[#0F243E] rounded-xl shadow-xs transition-colors"
          >
            <Package className="w-4 h-4 text-[#F2B52B]" />
            <span>All Products ({totalProducts})</span>
          </Link>
        </div>
      </div>

      {/* Supabase Status Alert Banner */}
      {!supabaseConnected && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 text-amber-700 mt-0.5">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-900">
                Local Fallback Mode Active
              </h3>
              <p className="text-xs text-amber-800/90 mt-0.5 leading-relaxed">
                Supabase credentials are not yet added to{" "}
                <code className="font-mono bg-amber-100/80 px-1 py-0.5 rounded text-amber-900 font-bold">
                  .env.local
                </code>
                . Catalog &amp; message data are fully saved in browser storage.
              </p>
            </div>
          </div>
          <div className="text-xs font-semibold text-amber-900 bg-amber-200/60 px-3 py-1.5 rounded-lg shrink-0 self-start sm:self-center">
            Run supabase/schema.sql &amp; add keys
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Products */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Total Products
            </span>
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#F26E22] flex items-center justify-center">
              <Package className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-gray-900">
              {loading ? "..." : totalProducts}
            </span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> Active
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1.5">
            Across {totalCategories} categories
          </p>
        </div>

        {/* Card 2: In Stock */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              In Stock
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-gray-900">
              {loading ? "..." : inStockCount}
            </span>
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
              Available
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1.5">Ready for orders</p>
        </div>

        {/* Card 3: Out of Stock */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Out of Stock
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-gray-900">
              {loading ? "..." : outOfStockCount}
            </span>
            {outOfStockCount > 0 && (
              <span className="text-xs text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full font-medium">
                Restock
              </span>
            )}
          </div>
          <p className="text-[11px] text-gray-500 mt-1.5">
            {outOfStockCount === 0 ? "All in stock!" : "Needs inventory update"}
          </p>
        </div>

        {/* Card 4: Categories */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Categories
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#16375B] flex items-center justify-center">
              <FolderTree className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-gray-900">
              {loading ? "..." : totalCategories}
            </span>
            <span className="text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full font-medium">
              Sections
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1.5">Organized catalog</p>
        </div>

        {/* Card 5: Inquiries / Contact Messages */}
        <Link
          href="/admin/messages"
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs hover:shadow-md hover:border-orange-200 transition-all block group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F26E22]">
              Inquiries
            </span>
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#F26E22] flex items-center justify-center group-hover:bg-orange-100 transition-colors">
              <MessageSquare className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-gray-900">
              {loading ? "..." : totalMessages}
            </span>
            {unreadMessages > 0 ? (
              <span className="text-xs text-[#F26E22] bg-orange-100 px-2 py-0.5 rounded-full font-bold animate-pulse">
                {unreadMessages} New
              </span>
            ) : (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                Live
              </span>
            )}
          </div>
          <p className="text-[11px] text-gray-500 mt-1.5">
            Contact form submissions
          </p>
        </Link>
      </div>

      {/* Quick Actions & Recent Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recent Products */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900">Catalog Preview</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Recently added products in your store
              </p>
            </div>
            <Link
              href="/admin/products"
              className="text-xs font-bold text-[#F26E22] hover:text-[#D55712] flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="p-8 text-center text-sm text-gray-500">
                Loading products...
              </div>
            ) : products.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-500">
                No products found. Start by adding your first product!
              </div>
            ) : (
              products.slice(0, 5).map((product) => (
                <div
                  key={product.id}
                  className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50/70 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 relative overflow-hidden shrink-0 border border-gray-200/60">
                      <Image
                        src={product.image || "/images/hero-workspace.jpg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-sm text-gray-900 truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {product.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                      </div>
                      {product.oldPrice && (
                        <div className="text-[11px] text-gray-500 line-through">
                          ${product.oldPrice.toFixed(2)}
                        </div>
                      )}
                    </div>

                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                        product.inStock
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Col: Quick Actions & Help */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs">
            <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2.5">
              <Link
                href="/admin/products?action=new"
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/50 text-gray-800 font-semibold text-sm transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#F26E22] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span>Add New Product</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-[#F26E22] transition-colors" />
              </Link>

              <Link
                href="/admin/categories"
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 text-gray-800 font-semibold text-sm transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#16375B] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <FolderTree className="w-4 h-4" />
                  </div>
                  <span>Manage Categories</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-[#16375B] transition-colors" />
              </Link>

              <Link
                href="/admin/messages"
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/50 text-gray-800 font-semibold text-sm transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#F26E22] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <span>Customer Messages</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {unreadMessages > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-orange-100 text-[#F26E22] text-[10px] font-bold">
                      {unreadMessages} new
                    </span>
                  )}
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-[#F26E22] transition-colors" />
                </div>
              </Link>

              <Link
                href="/"
                target="_blank"
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold text-sm transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                  <span>View Public Store</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-gray-900 transition-colors" />
              </Link>
            </div>
          </div>

          {/* Recent Inquiries Widget */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#F26E22]" />
                <span>Recent Inquiries</span>
              </h3>
              <Link
                href="/admin/messages"
                className="text-xs font-bold text-[#F26E22] hover:underline"
              >
                View All
              </Link>
            </div>
            {messages.length === 0 ? (
              <p className="text-xs text-gray-400 py-3 text-center">No inquiries received yet.</p>
            ) : (
              <div className="space-y-2.5">
                {messages.slice(0, 3).map((m) => (
                  <Link
                    key={m.id}
                    href="/admin/messages"
                    className="block p-3 rounded-xl bg-gray-50 hover:bg-orange-50/40 transition-colors border border-gray-100/80"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs text-gray-900 truncate">
                        {m.full_name}
                      </span>
                      {m.status === "unread" ? (
                        <span className="px-1.5 py-0.5 rounded-full bg-orange-100 text-[#F26E22] text-[9px] font-bold">
                          Unread
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-400 capitalize">
                          {m.status}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-600 font-medium truncate mt-0.5">
                      {m.subject || "General Inquiry"}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate mt-0.5">
                      {m.message}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Setup Guide Card */}
          <div className="bg-linear-to-br from-[#16375B] to-[#0F243E] text-white rounded-2xl p-6 shadow-md">
            <h4 className="font-black text-base tracking-tight mb-2">
              Supabase Integration
            </h4>
            <p className="text-xs text-white/80 leading-relaxed mb-4">
              All CRUD functions, image upload helpers, and database tables are
              already coded and ready to sync whenever your project keys are saved.
            </p>
            <div className="text-xs font-mono bg-black/25 px-3 py-2 rounded-lg text-[#F2B52B]">
              supabase/schema.sql
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
