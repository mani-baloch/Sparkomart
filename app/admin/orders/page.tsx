"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Search,
  Trash2,
  Download,
  Eye,
  X,
  Radio,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  CreditCard,
  Banknote,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  DollarSign,
  Package,
} from "lucide-react";
import {
  getOrders,
  updateOrderStatus,
  deleteOrder,
  subscribeToOrders,
  Order,
  OrderStatus,
} from "@/lib/services/orders";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadOrders = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await getOrders();
      setOrders(data);

      if (selectedOrder) {
        const freshSelected = data.find((o) => o.id === selectedOrder.id);
        if (freshSelected) setSelectedOrder(freshSelected);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();

    const unsubscribe = subscribeToOrders(() => {
      loadOrders(true);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, order_status: newStatus } : o))
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, order_status: newStatus } : null));
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (orderId: string) => {
    await deleteOrder(orderId);
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(null);
    }
    setDeleteConfirmId(null);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCSV = () => {
    if (orders.length === 0) return;
    const header =
      "Order ID,Tracking Number,Customer Name,Email,Phone,Items Count,Total Amount,Payment Method,Payment Status,Order Status,Date\n";
    const rows = orders
      .map(
        (o) =>
          `"${o.id}","${o.tracking_number}","${(o.customer_name || "").replace(/"/g, '""')}","${
            o.customer_email
          }","${o.customer_phone}","${o.items.length}","${o.total.toFixed(2)}","${
            o.payment_method
          }","${o.payment_status}","${o.order_status}","${new Date(
            o.created_at
          ).toLocaleString()}"`
      )
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `sparkomart_orders_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (statusFilter !== "all" && order.order_status !== statusFilter) {
        return false;
      }
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        order.id.toLowerCase().includes(q) ||
        order.tracking_number.toLowerCase().includes(q) ||
        order.customer_name.toLowerCase().includes(q) ||
        order.customer_email.toLowerCase().includes(q) ||
        order.customer_phone.toLowerCase().includes(q)
      );
    });
  }, [orders, statusFilter, search]);

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const processingCount = orders.filter((o) => o.order_status === "processing").length;
  const shippedCount = orders.filter((o) => o.order_status === "shipped").length;
  const deliveredCount = orders.filter((o) => o.order_status === "delivered").length;
  const cancelledCount = orders.filter((o) => o.order_status === "cancelled").length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
            <ShoppingBag className="w-6 h-6 text-[#F26E22]" />
            <span>Customer Orders</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-100 text-[#F26E22] font-bold">
              {orders.length} Total
            </span>
          </h2>
          <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
            <span>Manage customer purchases, payments, and fulfillment statuses.</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <Radio className="w-2.5 h-2.5 animate-pulse" />
              Live Order Sync Active
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={orders.length === 0}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-[#16375B] hover:bg-[#0F243E] rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Orders CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div
          onClick={() => setStatusFilter("all")}
          className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer ${
            statusFilter === "all"
              ? "border-[#F26E22] ring-2 ring-orange-500/10 shadow-sm"
              : "border-gray-100 hover:border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Total Volume</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-gray-900 mt-2">
            ${totalRevenue.toFixed(2)}
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5">{orders.length} orders total</p>
        </div>

        <div
          onClick={() => setStatusFilter("processing")}
          className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer ${
            statusFilter === "processing"
              ? "border-[#F26E22] ring-2 ring-orange-500/10 shadow-sm"
              : "border-gray-100 hover:border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600">Processing</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 mt-2">
            {processingCount}
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5">Need packaging</p>
        </div>

        <div
          onClick={() => setStatusFilter("shipped")}
          className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer ${
            statusFilter === "shipped"
              ? "border-[#F26E22] ring-2 ring-orange-500/10 shadow-sm"
              : "border-gray-100 hover:border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-600">Shipped</span>
            <Truck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-600 mt-2">
            {shippedCount}
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5">In transit</p>
        </div>

        <div
          onClick={() => setStatusFilter("delivered")}
          className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer ${
            statusFilter === "delivered"
              ? "border-[#F26E22] ring-2 ring-orange-500/10 shadow-sm"
              : "border-gray-100 hover:border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600">Delivered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">
            {deliveredCount}
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5">Fulfilled</p>
        </div>

        <div
          onClick={() => setStatusFilter("cancelled")}
          className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer ${
            statusFilter === "cancelled"
              ? "border-[#F26E22] ring-2 ring-orange-500/10 shadow-sm"
              : "border-gray-100 hover:border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Cancelled</span>
            <AlertCircle className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-black text-gray-500 mt-2">
            {cancelledCount}
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5">Refunded / Stopped</p>
        </div>
      </div>

      {/* Search & Status Filter Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by Order ID, tracking, name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F2B52B]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(["all", "processing", "shipped", "delivered", "cancelled"] as const).map(
            (tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer ${
                  statusFilter === tab
                    ? "bg-[#16375B] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-sm text-gray-500 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
            <span>Loading orders...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center text-gray-500 flex flex-col items-center justify-center gap-2">
            <ShoppingBag className="w-12 h-12 text-gray-300 stroke-[1.5]" />
            <p className="font-bold text-gray-800 text-sm">No orders found</p>
            <p className="text-xs text-gray-400 max-w-xs">
              {search
                ? `No orders match "${search}". Try searching another ID or name.`
                : "When customers checkout, their orders will appear here immediately."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Order ID & Date</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items & Total</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredOrders.map((order) => {
                  return (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className="hover:bg-amber-50/30 transition-colors cursor-pointer"
                    >
                      {/* Order ID & Date */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-gray-950 text-sm">
                            {order.id}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(order.id, order.id);
                            }}
                            className="text-gray-400 hover:text-gray-700"
                            title="Copy Order ID"
                          >
                            {copiedId === order.id ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        <div className="text-gray-400 text-[11px] mt-0.5">
                          {new Date(order.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>

                      {/* Customer Info */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-900 leading-tight">
                          {order.customer_name}
                        </div>
                        <div className="text-gray-500 text-[11px] mt-0.5">
                          {order.customer_email}
                        </div>
                        <div className="text-gray-400 text-[10px]">{order.customer_phone}</div>
                      </td>

                      {/* Items & Total */}
                      <td className="py-3.5 px-4">
                        <div className="font-black text-gray-950 text-sm">
                          ${order.total.toFixed(2)}
                        </div>
                        <div className="text-gray-500 text-[11px] mt-0.5">
                          {order.items.length} {order.items.length === 1 ? "item" : "items"}
                        </div>
                      </td>

                      {/* Payment Method & Status */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          {order.payment_method === "card" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                              <CreditCard className="w-3 h-3" /> Card Paid
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold">
                              <Banknote className="w-3 h-3" /> COD ({order.payment_status})
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={order.order_status}
                          disabled={updatingId === order.id}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value as OrderStatus)
                          }
                          className={`text-xs font-bold px-2.5 py-1 rounded-xl border cursor-pointer focus:outline-none ${
                            order.order_status === "delivered"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : order.order_status === "shipped"
                              ? "bg-blue-50 text-blue-800 border-blue-200"
                              : order.order_status === "cancelled"
                              ? "bg-rose-50 text-rose-800 border-rose-200"
                              : "bg-amber-50 text-amber-800 border-amber-200"
                          }`}
                        >
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td
                        className="py-3.5 px-4 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            title="View Full Order"
                            className="p-1.5 rounded-lg text-gray-600 hover:text-[#16375B] hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <Link
                            href={`/track-order?id=${order.id}`}
                            target="_blank"
                            title="View Live Tracking"
                            className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(order.id)}
                            title="Delete Order"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full border border-gray-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-start justify-between bg-gray-50/50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xl font-black text-gray-950">
                    {selectedOrder.id}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                      selectedOrder.order_status === "delivered"
                        ? "bg-emerald-100 text-emerald-800"
                        : selectedOrder.order_status === "shipped"
                        ? "bg-blue-100 text-blue-800"
                        : selectedOrder.order_status === "cancelled"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {selectedOrder.order_status}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Placed on {new Date(selectedOrder.created_at).toLocaleString()}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Tracking & Carrier bar */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-gray-400 block font-semibold text-[10px] uppercase">
                    Tracking Number
                  </span>
                  <span className="font-mono font-black text-gray-900 text-sm">
                    {selectedOrder.tracking_number}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/track-order?id=${selectedOrder.id}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors shadow-xs"
                  >
                    <span>View Customer Tracking</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Customer & Shipping Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-gray-100 space-y-1 text-xs">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                    Customer Information
                  </span>
                  <div className="font-bold text-gray-900 text-sm">
                    {selectedOrder.customer_name}
                  </div>
                  <div className="text-gray-600">{selectedOrder.customer_email}</div>
                  <div className="text-gray-600">{selectedOrder.customer_phone}</div>
                </div>

                <div className="p-4 rounded-2xl border border-gray-100 space-y-1 text-xs">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                    Shipping Address
                  </span>
                  <div className="font-bold text-gray-900">
                    {selectedOrder.shipping_address?.street || "Address"}
                  </div>
                  <div className="text-gray-600">
                    {selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.state}{" "}
                    {selectedOrder.shipping_address?.zip}
                  </div>
                  <div className="text-gray-600">
                    {selectedOrder.shipping_address?.country || "United States"}
                  </div>
                  {selectedOrder.notes && (
                    <div className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg mt-2 font-medium">
                      Note: {selectedOrder.notes}
                    </div>
                  )}
                </div>
              </div>

              {/* Items Purchased List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Items Purchased ({selectedOrder.items.length})
                </h4>
                <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3.5 flex items-center gap-3.5 text-xs bg-white">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 relative overflow-hidden shrink-0 border border-gray-200">
                        <Image
                          src={item.image || "/images/electronics.jpg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-gray-900 truncate">{item.name}</h5>
                        <p className="text-gray-500 text-[11px] mt-0.5">
                          ${item.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <div className="font-bold text-gray-900 text-sm text-right">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Totals */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">
                    ${selectedOrder.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Fee</span>
                  <span className="font-bold text-emerald-600">FREE</span>
                </div>
                <div className="pt-2 border-t border-gray-200/60 flex justify-between items-baseline">
                  <span className="font-bold text-gray-900 text-sm">Total Paid / Due</span>
                  <span className="font-black text-xl text-gray-950">
                    ${selectedOrder.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer / Status Changer */}
            <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-600">Set Status:</span>
                {(["processing", "shipped", "delivered"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleStatusChange(selectedOrder.id, s)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                      selectedOrder.order_status === s
                        ? "bg-[#16375B] text-white shadow-xs"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setDeleteConfirmId(selectedOrder.id)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Order</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div
          className="fixed inset-0 z-60 bg-gray-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setDeleteConfirmId(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-sm w-full p-6 border border-gray-100 shadow-xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h4 className="text-base font-bold text-gray-900">Delete this order?</h4>
              <p className="text-xs text-gray-500 mt-1">
                Order record will be removed from your database and local storage.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2.5 rounded-xl bg-red-600 text-xs font-bold text-white hover:bg-red-700 transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
