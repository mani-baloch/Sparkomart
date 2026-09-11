"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  MessageSquare,
  Search,
  Trash2,
  Mail,
  CheckCheck,
  Download,
  Calendar,
  User,
  Reply,
  Eye,
  X,
  Radio,
  Clock,
  CheckCircle2,
  Inbox,
  AlertCircle,
} from "lucide-react";
import {
  getContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
  subscribeToContactMessages,
  ContactMessage,
} from "@/lib/services/contact";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "unread" | "read" | "replied">("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const loadMessages = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await getContactMessages();
      setMessages(data);
      setLastUpdated(new Date());

      // If a message is currently opened in modal, keep its state synced
      if (selectedMessage) {
        const updatedSelected = data.find((m) => m.id === selectedMessage.id);
        if (updatedSelected) {
          setSelectedMessage(updatedSelected);
        }
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Initial load + Real-Time subscription ("sath ky sath")
  useEffect(() => {
    loadMessages();

    // Subscribe to real-time events (local window events, cross-tab storage, and Supabase channel)
    const unsubscribe = subscribeToContactMessages(() => {
      loadMessages(true);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Handler: Open modal & auto-mark unread as read
  const handleViewMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (msg.status === "unread") {
      await updateContactMessageStatus(msg.id, "read");
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, status: "read" } : m))
      );
    }
  };

  // Handler: Toggle status
  const handleUpdateStatus = async (id: string, newStatus: "unread" | "read" | "replied") => {
    await updateContactMessageStatus(id, newStatus);
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
    );
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  // Handler: Delete message
  const handleDelete = async (id: string) => {
    await deleteContactMessage(id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (selectedMessage?.id === id) {
      setSelectedMessage(null);
    }
    setDeleteConfirmId(null);
  };

  // Handler: Mark all as read
  const handleMarkAllAsRead = async () => {
    const unreadMessages = messages.filter((m) => m.status === "unread");
    if (unreadMessages.length === 0) return;

    for (const msg of unreadMessages) {
      await updateContactMessageStatus(msg.id, "read");
    }
    setMessages((prev) => prev.map((m) => ({ ...m, status: "read" })));
  };

  // Handler: Export CSV
  const handleExportCSV = () => {
    if (messages.length === 0) return;
    const header = "Sender Name,Email,Subject,Status,Date,Message\n";
    const rows = messages
      .map(
        (m) =>
          `"${(m.full_name || "").replace(/"/g, '""')}","${m.email}","${(m.subject || "").replace(/"/g, '""')}","${m.status}","${new Date(m.created_at).toLocaleString()}","${(m.message || "").replace(/"/g, '""')}"`
      )
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `sparkomart_messages_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered list
  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      // Filter by status tab
      if (statusFilter !== "all" && msg.status !== statusFilter) {
        return false;
      }
      // Filter by search query
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        msg.full_name.toLowerCase().includes(q) ||
        msg.email.toLowerCase().includes(q) ||
        msg.subject.toLowerCase().includes(q) ||
        msg.message.toLowerCase().includes(q)
      );
    });
  }, [messages, statusFilter, search]);

  const unreadCount = messages.filter((m) => m.status === "unread").length;
  const readCount = messages.filter((m) => m.status === "read").length;
  const repliedCount = messages.filter((m) => m.status === "replied").length;

  const formatDate = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      const now = new Date();
      const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

      if (diffMinutes < 1) return "Just now";
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    } catch {
      return "Recently";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
            <MessageSquare className="w-6 h-6 text-[#F26E22]" />
            <span>Contact Messages</span>
            {unreadCount > 0 ? (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-100 text-[#F26E22] font-bold animate-pulse">
                {unreadCount} New
              </span>
            ) : (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 font-bold">
                {messages.length}
              </span>
            )}
          </h2>
          <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
            <span>Customer inquiries submitted via the Contact Us page.</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <Radio className="w-2.5 h-2.5 animate-pulse" />
              Real-Time Sync Active
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Mark All Read</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleExportCSV}
            disabled={messages.length === 0}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-[#16375B] hover:bg-[#0F243E] rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div
          onClick={() => setStatusFilter("all")}
          className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer ${
            statusFilter === "all"
              ? "border-[#F26E22] ring-2 ring-orange-500/10 shadow-sm"
              : "border-gray-100 hover:border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">All Messages</span>
            <Inbox className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-black text-gray-900 mt-2">
            {messages.length}
          </div>
        </div>

        <div
          onClick={() => setStatusFilter("unread")}
          className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer ${
            statusFilter === "unread"
              ? "border-[#F26E22] ring-2 ring-orange-500/10 shadow-sm"
              : "border-gray-100 hover:border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#F26E22]">Unread</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#F26E22] animate-ping" />
          </div>
          <div className="text-2xl font-black text-[#F26E22] mt-2">
            {unreadCount}
          </div>
        </div>

        <div
          onClick={() => setStatusFilter("read")}
          className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer ${
            statusFilter === "read"
              ? "border-[#F26E22] ring-2 ring-orange-500/10 shadow-sm"
              : "border-gray-100 hover:border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Read</span>
            <CheckCircle2 className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-black text-gray-900 mt-2">
            {readCount}
          </div>
        </div>

        <div
          onClick={() => setStatusFilter("replied")}
          className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer ${
            statusFilter === "replied"
              ? "border-[#F26E22] ring-2 ring-orange-500/10 shadow-sm"
              : "border-gray-100 hover:border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600">Replied</span>
            <Reply className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">
            {repliedCount}
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, email, subject, or message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F2B52B]"
          />
        </div>

        <div className="flex items-center gap-2">
          {(["all", "unread", "read", "replied"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer ${
                statusFilter === tab
                  ? "bg-[#16375B] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-sm text-gray-500 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
            <span>Loading contact messages...</span>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="py-20 text-center text-gray-500 flex flex-col items-center justify-center gap-2">
            <Inbox className="w-12 h-12 text-gray-300 stroke-[1.5]" />
            <p className="font-bold text-gray-800 text-sm">No messages found</p>
            <p className="text-xs text-gray-400 max-w-xs">
              {search
                ? `No inquiries match "${search}". Try a different search.`
                : "When customers submit the contact form, their messages will appear here instantly."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4 w-12 text-center">Status</th>
                  <th className="py-3 px-4">Sender</th>
                  <th className="py-3 px-4">Subject & Message</th>
                  <th className="py-3 px-4 whitespace-nowrap">Received</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredMessages.map((msg) => {
                  const isUnread = msg.status === "unread";
                  const isReplied = msg.status === "replied";

                  return (
                    <tr
                      key={msg.id}
                      className={`hover:bg-amber-50/30 transition-colors cursor-pointer ${
                        isUnread ? "bg-orange-50/20 font-semibold" : ""
                      }`}
                      onClick={() => handleViewMessage(msg)}
                    >
                      {/* Status Indicator */}
                      <td className="py-3.5 px-4 text-center">
                        {isUnread ? (
                          <span
                            title="Unread"
                            className="inline-block w-2.5 h-2.5 rounded-full bg-[#F26E22] ring-4 ring-orange-500/20"
                          />
                        ) : isReplied ? (
                          <span
                            title="Replied"
                            className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500"
                          />
                        ) : (
                          <span
                            title="Read"
                            className="inline-block w-2.5 h-2.5 rounded-full bg-gray-300"
                          />
                        )}
                      </td>

                      {/* Sender Details */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-linear-to-br from-gray-100 to-gray-200 text-gray-700 flex items-center justify-center font-bold text-xs shrink-0 border border-gray-200">
                            {msg.full_name ? msg.full_name.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div>
                            <div className="text-gray-950 font-bold leading-tight">
                              {msg.full_name}
                            </div>
                            <div className="text-gray-500 text-[11px] mt-0.5">
                              {msg.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Subject & Message snippet */}
                      <td className="py-3.5 px-4 max-w-xs md:max-w-md">
                        <div className="text-gray-900 font-bold truncate">
                          {msg.subject || "General Inquiry"}
                        </div>
                        <div className="text-gray-500 text-[11px] truncate mt-0.5">
                          {msg.message}
                        </div>
                      </td>

                      {/* Time */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-gray-500 text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span>{formatDate(msg.created_at)}</span>
                        </div>
                      </td>

                      {/* Action buttons */}
                      <td
                        className="py-3.5 px-4 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Full */}
                          <button
                            type="button"
                            onClick={() => handleViewMessage(msg)}
                            title="View Message"
                            className="p-1.5 rounded-lg text-gray-600 hover:text-[#16375B] hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Quick Reply via Mailto */}
                          <a
                            href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(
                              msg.subject || "SparkoMart Inquiry"
                            )}`}
                            onClick={() => handleUpdateStatus(msg.id, "replied")}
                            title="Reply via Email"
                            className="p-1.5 rounded-lg text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                          >
                            <Reply className="w-4 h-4" />
                          </a>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(msg.id)}
                            title="Delete Message"
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

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div
          className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setSelectedMessage(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-xl w-full border border-gray-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-start justify-between bg-gray-50/50">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-[#FF7527] to-[#E8590C] text-white flex items-center justify-center font-black text-base shadow-sm">
                  {selectedMessage.full_name
                    ? selectedMessage.full_name.charAt(0).toUpperCase()
                    : "U"}
                </div>
                <div>
                  <h3 className="font-bold text-gray-950 text-base">
                    {selectedMessage.full_name}
                  </h3>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-0.5"
                  >
                    <Mail className="w-3 h-3" />
                    <span>{selectedMessage.email}</span>
                  </a>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Meta details */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>{new Date(selectedMessage.created_at).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-500">Status:</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                      selectedMessage.status === "unread"
                        ? "bg-orange-100 text-orange-700"
                        : selectedMessage.status === "replied"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {selectedMessage.status}
                  </span>
                </div>
              </div>

              {/* Subject */}
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Subject
                </span>
                <div className="text-base font-bold text-gray-900">
                  {selectedMessage.subject || "General Inquiry"}
                </div>
              </div>

              {/* Message Content */}
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Message
                </span>
                <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap font-normal">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            {/* Modal Footer / Actions */}
            <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleUpdateStatus(
                      selectedMessage.id,
                      selectedMessage.status === "unread" ? "read" : "unread"
                    )
                  }
                  className="px-3 py-2 rounded-xl text-xs font-bold border border-gray-200 bg-white hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer"
                >
                  {selectedMessage.status === "unread"
                    ? "Mark as Read"
                    : "Mark as Unread"}
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(selectedMessage.id)}
                  className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Delete message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                  selectedMessage.subject || "SparkoMart Inquiry"
                )}`}
                onClick={() => handleUpdateStatus(selectedMessage.id, "replied")}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-linear-to-r from-[#FF7527] to-[#E8590C] hover:from-[#E8590C] hover:to-[#CF4A00] rounded-xl shadow-xs shadow-orange-500/25 transition-transform active:scale-95"
              >
                <Reply className="w-4 h-4" />
                <span>Reply via Email</span>
              </a>
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
              <h4 className="text-base font-bold text-gray-900">
                Delete this inquiry?
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                This action cannot be undone. The message will be permanently removed.
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
