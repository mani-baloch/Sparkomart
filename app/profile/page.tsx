"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCustomerAuth, CustomerAddress } from "@/context/CustomerAuthContext";
import { useWishlist, WishlistItem } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import {
  User,
  MapPin,
  Package,
  Heart,
  Settings,
  Camera,
  CheckCircle2,
  Edit3,
  Plus,
  Search,
  ShoppingCart,
  LayoutGrid,
  List,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  Trash2,
  X,
  Globe,
  ChevronsUpDown,
  Sparkles,
} from "lucide-react";

export default function CustomerProfilePage() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    isLoading,
    logout,
    updateUserProfile,
    addAddress,
    deleteAddress,
    changePassword,
    deleteAccount,
  } = useCustomerAuth();

  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  // Active Tab state: "personal" | "addresses" | "orders" | "wishlist" | "settings"
  const [activeTab, setActiveTab] = useState<
    "personal" | "addresses" | "orders" | "wishlist" | "settings"
  >("personal");

  // Edit Personal Info Modal
  const [isEditPersonalOpen, setIsEditPersonalOpen] = useState(false);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editGender, setEditGender] = useState("Not Provided");
  const [editDob, setEditDob] = useState("");
  const [personalSuccessMsg, setPersonalSuccessMsg] = useState<string | null>(null);

  // Add Address Modal
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [addrName, setAddrName] = useState("");
  const [addrPhone, setAddrPhone] = useState("");
  const [addrStreet, setAddrStreet] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrState, setAddrState] = useState("");
  const [addrZip, setAddrZip] = useState("");
  const [addrCountry, setAddrCountry] = useState("United States");

  // Order History State
  const [orderSearch, setOrderSearch] = useState("");
  const [orderFilter, setOrderFilter] = useState("all");

  // Wishlist State
  const [wishlistSearch, setWishlistSearch] = useState("");
  const [wishlistSort, setWishlistSort] = useState("recent");
  const [wishlistFilter, setWishlistFilter] = useState("all");
  const [wishlistView, setWishlistView] = useState<"grid" | "list">("grid");

  // Settings State
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmNewPass, setConfirmNewPass] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmNewPass, setShowConfirmNewPass] = useState(false);
  const [settingsSuccessMsg, setSettingsSuccessMsg] = useState<string | null>(null);
  const [settingsErrorMsg, setSettingsErrorMsg] = useState<string | null>(null);

  // Avatar Upload Modal
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [avatarUrlInput, setAvatarUrlInput] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Sync personal info inputs with user
  useEffect(() => {
    if (user) {
      setEditFirstName(user.firstName || user.name?.split(" ")[0] || "Shams");
      setEditLastName(user.lastName || user.name?.split(" ").slice(1).join(" ") || "Din");
      setEditPhone(user.phone || "");
      setEditGender(user.gender || "Not Provided");
      setEditDob(user.dob || "Not provided");
    }
  }, [user]);

  const handleSignOut = async () => {
    await logout();
    router.replace("/login");
  };

  const handleSavePersonalInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile({
      firstName: editFirstName.trim(),
      lastName: editLastName.trim(),
      phone: editPhone.trim(),
      gender: editGender,
      dob: editDob.trim(),
    });
    setPersonalSuccessMsg("Personal details updated successfully!");
    setTimeout(() => {
      setPersonalSuccessMsg(null);
      setIsEditPersonalOpen(false);
    }, 1000);
  };

  const handleAddAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrStreet.trim() || !addrCity.trim()) return;

    await addAddress({
      name: addrName.trim() || user?.name || "Home",
      phone: addrPhone.trim() || user?.phone || "",
      street: addrStreet.trim(),
      city: addrCity.trim(),
      state: addrState.trim(),
      zip: addrZip.trim(),
      country: addrCountry,
    });

    setIsAddAddressOpen(false);
    setAddrName("");
    setAddrPhone("");
    setAddrStreet("");
    setAddrCity("");
    setAddrState("");
    setAddrZip("");
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsErrorMsg(null);
    setSettingsSuccessMsg(null);

    if (newPass !== confirmNewPass) {
      setSettingsErrorMsg("New passwords do not match.");
      return;
    }

    if (newPass.length < 6) {
      setSettingsErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    const res = await changePassword(currentPass, newPass);
    if (res.success) {
      setSettingsSuccessMsg("Password updated successfully!");
      setCurrentPass("");
      setNewPass("");
      setConfirmNewPass("");
    } else {
      setSettingsErrorMsg(res.error || "Failed to update password.");
    }
  };

  const handleDeleteAccountClick = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (confirmed) {
      await deleteAccount();
      router.replace("/");
    }
  };

  const handleSaveAvatar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (avatarUrlInput.trim()) {
      await updateUserProfile({ avatarUrl: avatarUrlInput.trim() });
    }
    setIsAvatarModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#F2B52B] flex items-center justify-center animate-spin">
            <Sparkles className="w-5 h-5 text-gray-900" />
          </div>
          <p className="text-gray-500 text-xs font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  // Display fields
  const displayFirstName = user.firstName || user.name?.split(" ")[0] || "Shams";
  const displayLastName = user.lastName || user.name?.split(" ").slice(1).join(" ") || "Din";
  const displayFullName = `${displayFirstName} ${displayLastName}`.trim() || user.name || "Shams Din";
  const displayEmail = user.email || "muhammadusman.dev.pro@gmail.com";
  const displayPhone = user.phone ? user.phone : "+1 Not provided";
  const displayGender = user.gender || "Not Provided";
  const displayDob = user.dob || "Not provided";
  const addresses = user.addresses || [];

  // Filtered wishlist
  const filteredWishlist = wishlistItems.filter((item: WishlistItem) => {
    if (wishlistSearch.trim()) {
      const q = wishlistSearch.toLowerCase();
      if (!item.name.toLowerCase().includes(q) && !item.category?.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      {/* Sticky Header System */}
      <div className="sticky top-0 z-40 w-full shadow-xs">
        <AnnouncementBar />
        <Navbar />
      </div>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
        {/* ======================================================== */}
        {/* 1. TOP USER PROFILE CARD (Exact Screenshot Match)        */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Big Circular Avatar with Camera Overlay */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center overflow-hidden border-2 border-white shadow-sm relative">
                {user.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={displayFullName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <User className="w-12 h-12" />
                )}
              </div>

              {/* Camera Icon Overlay */}
              <button
                type="button"
                onClick={() => {
                  setAvatarUrlInput(user.avatarUrl || "");
                  setIsAvatarModalOpen(true);
                }}
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-black hover:bg-gray-800 text-white flex items-center justify-center shadow-md transition-colors cursor-pointer"
                title="Change profile photo"
                aria-label="Change profile photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Name, Email, and Status Badges */}
            <div>
              <h1 className="text-2xl sm:text-[26px] font-black text-gray-950 tracking-tight">
                {displayFullName}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
                {displayEmail}
              </p>

              <div className="flex items-center gap-2 mt-3">
                {/* Verified Badge */}
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-700">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Verified</span>
                </span>

                {/* Customer Badge */}
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[11px] font-bold text-blue-700">
                  Customer
                </span>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleSignOut}
            className="self-start sm:self-center px-5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all cursor-pointer shadow-xs"
          >
            Logout
          </button>
        </div>

        {/* ======================================================== */}
        {/* 2. NAVIGATION TABS BAR (Exact Screenshot Match)          */}
        {/* ======================================================== */}
        <div className="bg-white rounded-2xl border border-gray-100 p-1.5 shadow-xs flex items-center justify-between gap-1 overflow-x-auto">
          <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-max">
            {/* Tab 1: Personal Info */}
            <button
              type="button"
              onClick={() => setActiveTab("personal")}
              className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "personal"
                  ? "bg-blue-50/80 border border-blue-200/80 text-blue-700 shadow-2xs"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <User className="w-4 h-4" />
              <span>Personal Info</span>
            </button>

            {/* Tab 2: Addresses */}
            <button
              type="button"
              onClick={() => setActiveTab("addresses")}
              className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "addresses"
                  ? "bg-blue-50/80 border border-blue-200/80 text-blue-700 shadow-2xs"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Addresses</span>
            </button>

            {/* Tab 3: Order History */}
            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "orders"
                  ? "bg-blue-50/80 border border-blue-200/80 text-blue-700 shadow-2xs"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Order History</span>
            </button>

            {/* Tab 4: Wishlist */}
            <button
              type="button"
              onClick={() => setActiveTab("wishlist")}
              className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "wishlist"
                  ? "bg-blue-50/80 border border-blue-200/80 text-blue-700 shadow-2xs"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Wishlist</span>
            </button>

            {/* Tab 5: Settings */}
            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "settings"
                  ? "bg-blue-50/80 border border-blue-200/80 text-blue-700 shadow-2xs"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center text-gray-400 pr-3">
            <ChevronsUpDown className="w-4 h-4" />
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. TAB CONTENT                                          */}
        {/* ======================================================== */}

        {/* -------------------------------------------------------- */}
        {/* TAB 1: PERSONAL INFORMATION                              */}
        {/* -------------------------------------------------------- */}
        {activeTab === "personal" && (
          <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-150">
            {/* Header with Edit Button */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-950">
                  Personal Information
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Manage your personal details and contact information
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsEditPersonalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-950 text-white text-xs font-bold hover:bg-gray-800 transition-colors shadow-xs cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>

            {/* 2-Column Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* First Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  First Name
                </label>
                <div className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-100 rounded-xl text-sm font-semibold text-gray-900">
                  {displayFirstName}
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Last Name
                </label>
                <div className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-100 rounded-xl text-sm font-semibold text-gray-900">
                  {displayLastName}
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-100 rounded-xl text-sm font-semibold text-gray-900 break-all">
                  {displayEmail}
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  Email cannot be changed. Contact support if needed.
                </p>
              </div>

              {/* Phone Number (US) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Phone Number (US)
                </label>
                <div className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-100 rounded-xl text-sm font-medium text-gray-700">
                  {displayPhone}
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  US phone numbers only
                </p>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Gender
                </label>
                <div className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-100 rounded-xl text-sm font-medium text-gray-700">
                  {displayGender}
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Date of Birth
                </label>
                <div className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-100 rounded-xl text-sm font-medium text-gray-700">
                  {displayDob}
                </div>
              </div>
            </div>

            {/* Account Status Box */}
            <div className="pt-3">
              <h3 className="text-xs font-bold text-gray-700 mb-3">
                Account Status
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Email Verified */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
                  <span className="text-xs font-semibold text-emerald-900">Email</span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                    Verified
                  </span>
                </div>

                {/* Phone Status */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-xs font-medium text-gray-700">Phone</span>
                  <span className="text-[11px] font-medium text-gray-500 bg-gray-200/70 px-2.5 py-0.5 rounded-full">
                    {user.phoneVerified ? "Verified" : "Not Verified"}
                  </span>
                </div>

                {/* Account Type */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-blue-50/50 border border-blue-100">
                  <span className="text-xs font-semibold text-blue-900">Account</span>
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-100/70 px-2.5 py-0.5 rounded-full">
                    Customer
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------- */}
        {/* TAB 2: ADDRESSES                                         */}
        {/* -------------------------------------------------------- */}
        {activeTab === "addresses" && (
          <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-150">
            {/* Header with Add Address Button */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-950">
                  Saved Addresses
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Manage your shipping and billing addresses
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddAddressOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-950 text-white text-xs font-bold hover:bg-gray-800 transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Address</span>
              </button>
            </div>

            {/* Addresses list or Empty State */}
            {addresses.length === 0 ? (
              <div className="py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <MapPin className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="text-base font-bold text-gray-950 mb-1">
                  No addresses saved
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
                  Add your first address to get started with faster checkout
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-5 rounded-2xl border border-gray-200/80 bg-gray-50/50 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">
                          {addr.name}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        {addr.street}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {addr.city}, {addr.state} {addr.zip}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {addr.country} {addr.phone && `• ${addr.phone}`}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-gray-200/60 flex justify-end">
                      <button
                        type="button"
                        onClick={() => deleteAddress(addr.id)}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* -------------------------------------------------------- */}
        {/* TAB 3: ORDER HISTORY                                     */}
        {/* -------------------------------------------------------- */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-150">
            {/* Header & Search Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-950">
                  Order History
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Track your orders and view past purchases
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative flex-1 sm:w-60">
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F2B52B]"
                  />
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                <select
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                  className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-700 cursor-pointer"
                >
                  <option value="all">All Orders</option>
                  <option value="delivered">Delivered</option>
                  <option value="processing">Processing</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Empty State */}
            <div className="py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4 text-gray-400">
                <Package className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="text-base font-bold text-gray-950 mb-1">
                No orders found
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
                You haven&apos;t placed any orders yet
              </p>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------- */}
        {/* TAB 4: WISHLIST                                          */}
        {/* -------------------------------------------------------- */}
        {activeTab === "wishlist" && (
          <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-150">
            {/* Header with Title & View Toggles */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-gray-900" />
                  <h2 className="text-base sm:text-lg font-bold text-gray-950">
                    My Wishlist
                  </h2>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {wishlistItems.length} items saved for later
                </p>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setWishlistView("grid")}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                    wishlistView === "grid"
                      ? "bg-gray-950 text-white border-gray-950"
                      : "bg-white text-gray-400 border-gray-200 hover:text-gray-700"
                  }`}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setWishlistView("list")}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                    wishlistView === "list"
                      ? "bg-gray-950 text-white border-gray-950"
                      : "bg-white text-gray-400 border-gray-200 hover:text-gray-700"
                  }`}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Search wishlist..."
                  value={wishlistSearch}
                  onChange={(e) => setWishlistSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F2B52B]"
                />
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <select
                value={wishlistSort}
                onChange={(e) => setWishlistSort(e.target.value)}
                className="px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-700 cursor-pointer"
              >
                <option value="recent">Recently Added</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>

              <select
                value={wishlistFilter}
                onChange={(e) => setWishlistFilter(e.target.value)}
                className="px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-700 cursor-pointer"
              >
                <option value="all">All Items</option>
                <option value="in-stock">In Stock</option>
              </select>
            </div>

            {/* Wishlist Items or Empty State */}
            {filteredWishlist.length === 0 ? (
              <div className="py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <Heart className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="text-base font-bold text-gray-950 mb-1">
                  Your wishlist is empty
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto mb-6">
                  Save items you love to your wishlist to keep track of them
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gray-950 text-white text-xs font-bold hover:bg-gray-800 transition-colors shadow-xs"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Continue Shopping</span>
                </Link>
              </div>
            ) : (
              <div
                className={
                  wishlistView === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                    : "space-y-3"
                }
              >
                {filteredWishlist.map((item: WishlistItem) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl border border-gray-100 bg-white shadow-2xs hover:shadow-md transition-all flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">{item.category}</div>
                        <h4 className="text-sm font-bold text-gray-900 leading-snug line-clamp-1">
                          {item.name}
                        </h4>
                        <div className="text-sm font-black text-gray-900 mt-1">
                          ${item.price.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          addToCart({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            image: item.image,
                            category: item.category || "General",
                          })
                        }
                        className="px-3 py-1.5 rounded-lg bg-[#F2B52B] text-gray-950 text-xs font-bold hover:bg-[#d99f20] transition-colors cursor-pointer"
                      >
                        Add to Cart
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromWishlist(item.id)}
                        className="text-[11px] text-gray-400 hover:text-red-600 font-medium text-center transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* -------------------------------------------------------- */}
        {/* TAB 5: SETTINGS                                          */}
        {/* -------------------------------------------------------- */}
        {activeTab === "settings" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Card 1: Change Password */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
                <Lock className="w-4 h-4 text-gray-800" />
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-950">
                    Change Password
                  </h2>
                  <p className="text-xs text-gray-500">
                    Update your account password for better security
                  </p>
                </div>
              </div>

              {settingsSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{settingsSuccessMsg}</span>
                </div>
              )}

              {settingsErrorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{settingsErrorMsg}</span>
                </div>
              )}

              <form onSubmit={handleChangePasswordSubmit} className="space-y-4 max-w-xl">
                {/* Current Password */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPass ? "text" : "password"}
                      required
                      placeholder="Enter your current password"
                      value={currentPass}
                      onChange={(e) => setCurrentPass(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl pr-10 focus:outline-none focus:border-[#F2B52B]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPass ? "text" : "password"}
                      required
                      placeholder="Enter your new password"
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl pr-10 focus:outline-none focus:border-[#F2B52B]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmNewPass ? "text" : "password"}
                      required
                      placeholder="Confirm your new password"
                      value={confirmNewPass}
                      onChange={(e) => setConfirmNewPass(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl pr-10 focus:outline-none focus:border-[#F2B52B]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmNewPass(!showConfirmNewPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-950 text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-xs cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Change Password</span>
                </button>
              </form>
            </div>

            {/* Card 2: Account Management (Danger Zone) */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <Globe className="w-4 h-4 text-gray-800" />
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-950">
                    Account Management
                  </h2>
                  <p className="text-xs text-gray-500">
                    Manage your account data and preferences
                  </p>
                </div>
              </div>

              {/* Danger Zone Box */}
              <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold text-rose-900">
                      Danger Zone
                    </h3>
                    <p className="text-xs text-rose-600 mt-0.5">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDeleteAccountClick}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-xs shrink-0 cursor-pointer self-start sm:self-center"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Account</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* EDIT PERSONAL INFO MODAL                                 */}
        {/* ======================================================== */}
        {isEditPersonalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="text-base font-bold text-gray-900">
                  Edit Personal Information
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditPersonalOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {personalSuccessMsg && (
                <div className="my-3 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-medium">
                  {personalSuccessMsg}
                </div>
              )}

              <form onSubmit={handleSavePersonalInfo} className="mt-4 space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={editFirstName}
                      onChange={(e) => setEditFirstName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F2B52B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      value={editLastName}
                      onChange={(e) => setEditLastName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F2B52B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F2B52B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={editGender}
                    onChange={(e) => setEditGender(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F2B52B]"
                  >
                    <option value="Not Provided">Not Provided</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="text"
                    placeholder="MM/DD/YYYY"
                    value={editDob}
                    onChange={(e) => setEditDob(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F2B52B]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditPersonalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#F2B52B] text-gray-950 text-xs font-bold hover:bg-[#d99f20]"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ADD ADDRESS MODAL                                        */}
        {/* ======================================================== */}
        {isAddAddressOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="text-base font-bold text-gray-900">
                  Add New Address
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddAddressOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddAddressSubmit} className="mt-4 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Address Label (e.g. Home, Office)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Home"
                    value={addrName}
                    onChange={(e) => setAddrName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F2B52B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="123 Main St, Apt 4B"
                    value={addrStreet}
                    onChange={(e) => setAddrStreet(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F2B52B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Austin"
                      value={addrCity}
                      onChange={(e) => setAddrCity(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F2B52B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="TX"
                      value={addrState}
                      onChange={(e) => setAddrState(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F2B52B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="78701"
                      value={addrZip}
                      onChange={(e) => setAddrZip(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F2B52B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Phone (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="+1 (555) 000-0000"
                      value={addrPhone}
                      onChange={(e) => setAddrPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F2B52B]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddAddressOpen(false)}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gray-950 text-white text-xs font-bold hover:bg-gray-800"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* AVATAR PHOTO MODAL                                       */}
        {/* ======================================================== */}
        {isAvatarModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="text-base font-bold text-gray-900">
                  Update Profile Photo
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAvatarModalOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveAvatar} className="mt-4 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={avatarUrlInput}
                    onChange={(e) => setAvatarUrlInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F2B52B]"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    Paste an image URL for your profile avatar.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAvatarModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gray-950 text-white text-xs font-bold hover:bg-gray-800"
                  >
                    Update Photo
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
