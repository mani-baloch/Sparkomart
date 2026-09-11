"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { createOrder, PaymentMethod } from "@/lib/services/orders";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  Lock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ArrowRight,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useCustomerAuth();

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "TX",
    zip: "",
    country: "United States",
    notes: "",
  });

  // Pre-fill if logged in customer
  useEffect(() => {
    if (user) {
      const defaultAddr = user.addresses?.[0];
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        email: prev.email || user.email || "",
        phone: prev.phone || user.phone || defaultAddr?.phone || "",
        street: prev.street || defaultAddr?.street || "",
        city: prev.city || defaultAddr?.city || "",
        state: prev.state || defaultAddr?.state || "TX",
        zip: prev.zip || defaultAddr?.zip || "",
      }));
    }
  }, [user]);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiry: "",
    cvc: "",
  });

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<any | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Quick helper to fill test card
  const handleFillDemoCard = () => {
    setCardData({
      cardNumber: "4242 •••• •••• 4242",
      cardHolder: formData.fullName || "John Doe",
      expiry: "12/28",
      cvc: "888",
    });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Form Validations
    if (!formData.fullName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage("Please enter your contact phone number.");
      return;
    }
    if (!formData.street.trim() || !formData.city.trim() || !formData.zip.trim()) {
      setErrorMessage("Please enter complete delivery address details.");
      return;
    }

    if (items.length === 0) {
      setErrorMessage("Your cart is empty. Please add items before placing an order.");
      return;
    }

    if (paymentMethod === "card") {
      if (!cardData.cardNumber.trim() || !cardData.expiry.trim() || !cardData.cvc.trim()) {
        setErrorMessage("Please provide complete credit/debit card information.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country,
          notes: formData.notes,
        },
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          category: item.category,
          quantity: item.quantity,
        })),
        subtotal: subtotal,
        shippingFee: 0,
        total: subtotal,
        paymentMethod: paymentMethod,
        cardDetails:
          paymentMethod === "card"
            ? {
                cardNumberLast4: cardData.cardNumber.slice(-4) || "4242",
                cardHolderName: cardData.cardHolder || formData.fullName,
              }
            : undefined,
        notes: formData.notes,
      };

      const result = await createOrder(orderPayload);

      if (result.success && result.order) {
        setPlacedOrder(result.order);
        clearCart();
      } else {
        setErrorMessage(result.error || "Failed to place order. Please try again.");
      }
    } catch (err) {
      console.error("Order placement error:", err);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyOrderId = () => {
    if (!placedOrder) return;
    navigator.clipboard.writeText(placedOrder.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDFD]">
      <div className="sticky top-0 z-40 w-full shadow-xs">
        <AnnouncementBar />
        <Navbar />
      </div>

      <main className="flex-1 max-w-[1140px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-6">
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/cart" className="hover:text-gray-900 transition-colors">
            Cart
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-bold">Checkout</span>
        </div>

        {/* ORDER SUCCESS SCREEN */}
        {placedOrder ? (
          <div className="max-w-xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] p-8 sm:p-12 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-3xl bg-linear-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/25">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Order Placed Successfully!
            </span>

            <h1 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
              Thank You, {placedOrder.customer_name}!
            </h1>

            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              We received your order and have notified our warehouse. A confirmation has
              been sent to <strong className="text-gray-900">{placedOrder.customer_email}</strong>.
            </p>

            {/* Order & Tracking ID Box */}
            <div className="mt-8 p-5 bg-gray-50/80 rounded-2xl border border-gray-200/80 text-left space-y-3">
              <div className="flex items-center justify-between border-b border-gray-200/60 pb-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block">
                    Order ID
                  </span>
                  <span className="font-mono text-base sm:text-lg font-black text-gray-900">
                    {placedOrder.id}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={copyOrderId}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {copiedId ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-gray-500">Tracking Number:</span>
                <span className="font-mono font-bold text-gray-900">
                  {placedOrder.tracking_number}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Payment Method:</span>
                <span className="font-bold text-gray-900 uppercase">
                  {placedOrder.payment_method === "cod" ? "Cash on Delivery (COD)" : "Card Paid"}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Total Paid / Due:</span>
                <span className="font-black text-sm text-gray-900">
                  ${placedOrder.total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 space-y-3">
              <Link
                href={`/track-order?id=${placedOrder.id}`}
                className="w-full py-4 bg-[#F2B52B] hover:bg-[#e0a41d] active:scale-[0.99] text-gray-950 font-black text-sm rounded-2xl transition-all shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Track Your Order Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/"
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition-colors block"
              >
                Return to Storefront
              </Link>
            </div>
          </div>
        ) : items.length === 0 ? (
          /* EMPTY CART NOTICE */
          <div className="max-w-md mx-auto bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-xs">
            <div className="w-16 h-16 rounded-full bg-orange-50 text-[#F26E22] flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Your bag is empty</h2>
            <p className="text-xs text-gray-500 mt-1 mb-6">
              You haven&apos;t added any items to your shopping bag yet.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#16375B] text-white font-bold text-xs rounded-xl hover:bg-[#0F243E] transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          /* CHECKOUT FORM */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form (7 cols) */}
            <form onSubmit={handlePlaceOrder} className="lg:col-span-7 space-y-8">
              {/* Error Alert */}
              {errorMessage && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3 animate-in fade-in">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <p className="font-semibold">{errorMessage}</p>
                </div>
              )}

              {/* 1. Contact Info */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <h2 className="text-base sm:text-lg font-bold text-gray-950 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#F2B52B]/20 text-[#D59800] text-xs font-black flex items-center justify-center">
                      1
                    </span>
                    <span>Contact Information</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#F2B52B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#F2B52B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (512) 000-0000"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#F2B52B]"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Shipping Address */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <h2 className="text-base sm:text-lg font-bold text-gray-950 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#F2B52B]/20 text-[#D59800] text-xs font-black flex items-center justify-center">
                      2
                    </span>
                    <span>Shipping Address</span>
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 5800 Balcones Dr, Suite 2986"
                      value={formData.street}
                      onChange={(e) =>
                        setFormData({ ...formData, street: e.target.value })
                      }
                      className="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#F2B52B]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Austin"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        className="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#F2B52B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="TX"
                        value={formData.state}
                        onChange={(e) =>
                          setFormData({ ...formData, state: e.target.value })
                        }
                        className="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#F2B52B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        ZIP / Postal Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="78731"
                        value={formData.zip}
                        onChange={(e) =>
                          setFormData({ ...formData, zip: e.target.value })
                        }
                        className="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#F2B52B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Delivery Instructions (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Leave package by the front door or call on arrival"
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      className="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#F2B52B]"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Payment Method */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <h2 className="text-base sm:text-lg font-bold text-gray-950 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#F2B52B]/20 text-[#D59800] text-xs font-black flex items-center justify-center">
                      3
                    </span>
                    <span>Payment Method</span>
                  </h2>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-bold">
                    <Lock className="w-3 h-3 text-emerald-600" />
                    <span>256-Bit Encrypted</span>
                  </div>
                </div>

                {/* Method Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Option: Cash on Delivery */}
                  <div
                    onClick={() => setPaymentMethod("cod")}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      paymentMethod === "cod"
                        ? "border-[#F2B52B] bg-amber-50/20 shadow-xs"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#F2B52B] flex items-center justify-center">
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === "cod"
                            ? "border-[#F2B52B] bg-[#F2B52B]"
                            : "border-gray-300"
                        }`}
                      >
                        {paymentMethod === "cod" && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-sm text-gray-950">
                        Cash on Delivery
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        Pay with cash upon delivery of package.
                      </div>
                    </div>
                  </div>

                  {/* Option: Credit/Debit Card */}
                  <div
                    onClick={() => setPaymentMethod("card")}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      paymentMethod === "card"
                        ? "border-[#F2B52B] bg-amber-50/20 shadow-xs"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#16375B] flex items-center justify-center">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === "card"
                            ? "border-[#F2B52B] bg-[#F2B52B]"
                            : "border-gray-300"
                        }`}
                      >
                        {paymentMethod === "card" && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-sm text-gray-950">
                        Card Payment
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        Visa, Mastercard, Amex, Discover.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Input Drawer */}
                {paymentMethod === "card" && (
                  <div className="mt-4 p-5 rounded-2xl bg-gray-50/80 border border-gray-200/80 space-y-3.5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-800">
                        Enter Card Details
                      </span>
                      <button
                        type="button"
                        onClick={handleFillDemoCard}
                        className="text-[11px] font-bold text-[#F26E22] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Auto-fill Demo Card</span>
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="4242 •••• •••• 4242"
                        value={cardData.cardNumber}
                        onChange={(e) =>
                          setCardData({ ...cardData, cardNumber: e.target.value })
                        }
                        className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 font-mono tracking-wider focus:outline-none focus:border-[#F2B52B]"
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-1">
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                          Expires (MM/YY)
                        </label>
                        <input
                          type="text"
                          placeholder="12/28"
                          value={cardData.expiry}
                          onChange={(e) =>
                            setCardData({ ...cardData, expiry: e.target.value })
                          }
                          className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 font-mono focus:outline-none focus:border-[#F2B52B]"
                        />
                      </div>

                      <div className="sm:col-span-1">
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                          CVV / CVC
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          placeholder="888"
                          value={cardData.cvc}
                          onChange={(e) =>
                            setCardData({ ...cardData, cvc: e.target.value })
                          }
                          className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 font-mono focus:outline-none focus:border-[#F2B52B]"
                        />
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                          Name on Card
                        </label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          value={cardData.cardHolder}
                          onChange={(e) =>
                            setCardData({ ...cardData, cardHolder: e.target.value })
                          }
                          className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#F2B52B]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#F2B52B] hover:bg-[#e0a41d] active:scale-[0.99] text-gray-950 font-black text-base rounded-2xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? "Placing Order..."
                    : `Complete Order • $${subtotal.toFixed(2)}`}
                </span>
              </button>
            </form>

            {/* Right Column: Order Summary (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] p-6 sm:p-7 space-y-5">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <h3 className="font-bold text-gray-950 text-base">
                    Order Summary ({items.length} items)
                  </h3>
                  <Link
                    href="/cart"
                    className="text-xs font-bold text-[#F26E22] hover:underline"
                  >
                    Edit Cart
                  </Link>
                </div>

                {/* Items List */}
                <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="py-3 flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 relative overflow-hidden shrink-0 border border-gray-200/60">
                        <Image
                          src={item.image || "/images/electronics.jpg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-gray-900 truncate">
                          {item.name}
                        </h4>
                        <span className="text-[11px] text-gray-500">
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-right font-bold text-xs text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Financial breakdown */}
                <div className="pt-4 border-t border-gray-100 space-y-2.5 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-gray-900">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-bold text-emerald-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Estimated Tax</span>
                    <span className="font-medium text-gray-500">$0.00</span>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
                    <span className="text-sm font-bold text-gray-950">Total</span>
                    <span className="text-2xl font-black text-gray-950">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Guarantees Box */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-3 text-xs text-gray-600">
                <div className="flex items-center gap-2.5">
                  <Truck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Free tracked shipping across all US states.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>30-Day Hassle Free Returns Guarantee.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
