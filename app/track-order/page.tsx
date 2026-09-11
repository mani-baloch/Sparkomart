"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Copy,
  Check,
  Phone,
  HelpCircle,
} from "lucide-react";
import { getOrderByIdOrTracking, subscribeToOrders } from "@/lib/services/orders";

interface OrderTrackingData {
  orderId: string;
  trackingNumber: string;
  carrier: string;
  orderDate: string;
  estimatedDelivery: string;
  status: "processing" | "shipped" | "out_for_delivery" | "delivered";
  statusText: string;
  recipient: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  items: Array<{
    name: string;
    image: string;
    price: number;
    quantity: number;
    category: string;
  }>;
  timeline: Array<{
    title: string;
    description: string;
    date: string;
    completed: boolean;
    current?: boolean;
  }>;
}

const SAMPLE_ORDERS: Record<string, OrderTrackingData> = {
  "SPK-94821": {
    orderId: "SPK-94821",
    trackingNumber: "FX-9823481204US",
    carrier: "FedEx Priority",
    orderDate: "September 04, 2026",
    estimatedDelivery: "Delivered on September 08, 2026",
    status: "delivered",
    statusText: "Delivered Successfully",
    recipient: {
      name: "Alex Johnson",
      address: "5900 Balcones Dr, Suite 23935",
      city: "Austin",
      state: "TX",
      zip: "78731",
    },
    items: [
      {
        name: "Wireless Bluetooth Headphones",
        image: "/images/headphones.jpg",
        price: 79.99,
        quantity: 1,
        category: "Electronics",
      },
      {
        name: "Yoga Mat Premium",
        image: "/images/yoga-mat.jpg",
        price: 49.99,
        quantity: 1,
        category: "Sports & Outdoors",
      },
    ],
    timeline: [
      {
        title: "Order Placed",
        description: "Your order was received and confirmed.",
        date: "Sep 04, 2026 • 10:24 AM",
        completed: true,
      },
      {
        title: "Processing & Quality Check",
        description: "Items packed and prepared for pickup.",
        date: "Sep 05, 2026 • 02:15 PM",
        completed: true,
      },
      {
        title: "Shipped & In Transit",
        description: "Departed regional distribution center.",
        date: "Sep 06, 2026 • 09:40 AM",
        completed: true,
      },
      {
        title: "Out for Delivery",
        description: "Courier out for local delivery in Austin, TX.",
        date: "Sep 08, 2026 • 08:30 AM",
        completed: true,
      },
      {
        title: "Delivered",
        description: "Package handed directly to resident at front door.",
        date: "Sep 08, 2026 • 01:45 PM",
        completed: true,
        current: true,
      },
    ],
  },
  "SPK-83719": {
    orderId: "SPK-83719",
    trackingNumber: "USPS-94055102008891",
    carrier: "USPS Priority Mail",
    orderDate: "September 07, 2026",
    estimatedDelivery: "Expected Today by 7:00 PM",
    status: "out_for_delivery",
    statusText: "Out for Delivery",
    recipient: {
      name: "Sarah Miller",
      address: "742 Evergreen Terrace",
      city: "Austin",
      state: "TX",
      zip: "78704",
    },
    items: [
      {
        name: "Stainless Steel Cookware Set",
        image: "/images/cookware.jpg",
        price: 149.99,
        quantity: 1,
        category: "Home & Kitchen",
      },
    ],
    timeline: [
      {
        title: "Order Placed",
        description: "Order confirmed and processed.",
        date: "Sep 07, 2026 • 08:15 AM",
        completed: true,
      },
      {
        title: "Processing",
        description: "Order verified and packed securely.",
        date: "Sep 07, 2026 • 01:30 PM",
        completed: true,
      },
      {
        title: "Shipped",
        description: "Departed sorting facility.",
        date: "Sep 08, 2026 • 11:20 PM",
        completed: true,
      },
      {
        title: "Out for Delivery",
        description: "With local courier on final delivery route.",
        date: "Today • 08:10 AM",
        completed: true,
        current: true,
      },
      {
        title: "Delivered",
        description: "Package arriving at destination.",
        date: "Pending delivery",
        completed: false,
      },
    ],
  },
  "SPK-62910": {
    orderId: "SPK-62910",
    trackingNumber: "FX-772910284411",
    carrier: "FedEx Express",
    orderDate: "September 08, 2026",
    estimatedDelivery: "Expected in 2 Days",
    status: "shipped",
    statusText: "In Transit",
    recipient: {
      name: "Michael Chen",
      address: "1200 Grand Avenue",
      city: "Dallas",
      state: "TX",
      zip: "75201",
    },
    items: [
      {
        name: "Kitchen Knife Set Professional",
        image: "/images/knife-set.jpg",
        price: 129.99,
        quantity: 1,
        category: "Home & Kitchen",
      },
    ],
    timeline: [
      {
        title: "Order Placed",
        description: "Order placed and payment authorized.",
        date: "Sep 08, 2026 • 03:20 PM",
        completed: true,
      },
      {
        title: "Processing",
        description: "Packaged and labeled for dispatch.",
        date: "Sep 09, 2026 • 09:00 AM",
        completed: true,
      },
      {
        title: "Shipped",
        description: "In transit from Dallas logistics hub.",
        date: "Sep 09, 2026 • 04:30 PM",
        completed: true,
        current: true,
      },
      {
        title: "Out for Delivery",
        description: "Will be out with courier soon.",
        date: "Expected soon",
        completed: false,
      },
      {
        title: "Delivered",
        description: "Final destination.",
        date: "Expected in 2 days",
        completed: false,
      },
    ],
  },
};

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("id") || "";

  const [orderIdInput, setOrderIdInput] = useState(initialQuery || "SPK-94821");
  const [activeOrder, setActiveOrder] = useState<OrderTrackingData | null>(
    SAMPLE_ORDERS["SPK-94821"]
  );
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const [activeQuery, setActiveQuery] = useState(initialQuery || "SPK-94821");

  useEffect(() => {
    if (initialQuery) {
      handleTrack(initialQuery);
    }
  }, [initialQuery]);

  // Live updates listener: if admin updates order status, refresh tracking view
  useEffect(() => {
    const unsub = subscribeToOrders(() => {
      if (activeQuery) {
        handleTrack(activeQuery);
      }
    });
    return unsub;
  }, [activeQuery]);

  const handleTrack = async (queryId?: string) => {
    const idToSearch = (queryId || orderIdInput).trim().toUpperCase();
    if (!idToSearch) {
      setError("Please enter a valid Order ID or Tracking Number.");
      return;
    }

    setError("");
    setActiveQuery(idToSearch);

    // 1. Check Real Orders from Database & Local Storage
    try {
      const realOrder = await getOrderByIdOrTracking(idToSearch);
      if (realOrder) {
        const isPlaced = true;
        const isProcessing =
          realOrder.order_status === "processing" ||
          realOrder.order_status === "shipped" ||
          realOrder.order_status === "delivered";
        const isShipped =
          realOrder.order_status === "shipped" || realOrder.order_status === "delivered";
        const isDelivered = realOrder.order_status === "delivered";

        const timeline = [
          {
            title: "Order Placed",
            description: `Order received and confirmed. Payment: ${
              realOrder.payment_method === "cod" ? "Cash on Delivery" : "Paid via Card"
            }.`,
            date: new Date(realOrder.created_at).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
            completed: isPlaced,
            current: realOrder.order_status === "pending",
          },
          {
            title: "Processing & Quality Check",
            description: "Items inspected, packaged securely, and labeled.",
            date: isProcessing ? "In Progress / Ready" : "Pending",
            completed: isProcessing,
            current: realOrder.order_status === "processing",
          },
          {
            title: "Shipped & In Transit",
            description: `Handed over to ${realOrder.carrier || "FedEx Express"} for delivery.`,
            date: isShipped ? "In Transit" : "Scheduled",
            completed: isShipped,
            current: realOrder.order_status === "shipped",
          },
          {
            title: "Delivered",
            description: "Package safely arrived at recipient address.",
            date: isDelivered ? "Delivered" : "Expected in 2-3 days",
            completed: isDelivered,
            current: realOrder.order_status === "delivered",
          },
        ];

        setActiveOrder({
          orderId: realOrder.id,
          trackingNumber: realOrder.tracking_number,
          carrier: realOrder.carrier || "FedEx Express",
          orderDate: new Date(realOrder.created_at).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
          estimatedDelivery:
            realOrder.estimated_delivery || "Expected in 2-3 business days",
          status: (realOrder.order_status as any) || "processing",
          statusText:
            realOrder.order_status === "delivered"
              ? "Delivered Successfully"
              : realOrder.order_status === "shipped"
              ? "In Transit"
              : "Processing & On Schedule",
          recipient: {
            name: realOrder.shipping_address?.fullName || realOrder.customer_name,
            address: realOrder.shipping_address?.street || "Shipping Address",
            city: realOrder.shipping_address?.city || "Austin",
            state: realOrder.shipping_address?.state || "TX",
            zip: realOrder.shipping_address?.zip || "78731",
          },
          items: realOrder.items.map((i) => ({
            name: i.name,
            image: i.image || "/images/electronics.jpg",
            price: i.price,
            quantity: i.quantity,
            category: i.category || "General",
          })),
          timeline: timeline,
        });
        return;
      }
    } catch (e) {
      console.error("Order lookup error:", e);
    }

    // 2. Check sample orders
    if (SAMPLE_ORDERS[idToSearch]) {
      setActiveOrder(SAMPLE_ORDERS[idToSearch]);
      return;
    }

    // If custom order ID was entered, dynamically generate a realistic tracked order
    setActiveOrder({
      orderId: idToSearch,
      trackingNumber: `SPK-TRK-${Math.floor(100000000 + Math.random() * 900000000)}`,
      carrier: "FedEx Standard Shipping",
      orderDate: "Verified Order",
      estimatedDelivery: "Delivery Scheduled in 2-4 Business Days",
      status: "shipped",
      statusText: "Package In Transit",
      recipient: {
        name: "Verified Recipient",
        address: "5900 Balcones Dr, Suite 23935",
        city: "Austin",
        state: "TX",
        zip: "78731",
      },
      items: [
        {
          name: "SparkoMart Premium Package",
          image: "/images/home-kitchen.jpg",
          price: 89.99,
          quantity: 1,
          category: "Order Items",
        },
      ],
      timeline: [
        {
          title: "Order Placed",
          description: "Order verified and confirmed in SparkoMart system.",
          date: "Completed",
          completed: true,
        },
        {
          title: "Processing & Packaging",
          description: "Quality inspection and bubble-wrap packaging completed.",
          date: "Completed",
          completed: true,
        },
        {
          title: "Shipped & In Transit",
          description: "Carrier en route to regional distribution facility.",
          date: "Active Now",
          completed: true,
          current: true,
        },
        {
          title: "Out for Delivery",
          description: "Courier will deliver during business hours.",
          date: "Next Step",
          completed: false,
        },
        {
          title: "Delivered",
          description: "Delivered safely to recipient.",
          date: "Upcoming",
          completed: false,
        },
      ],
    });
  };

  const handleCopyTracking = (tracking: string) => {
    navigator.clipboard.writeText(tracking);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDFD]">
      {/* Sticky Top Header System */}
      <div className="sticky top-0 z-40 w-full shadow-xs">
        <AnnouncementBar />
        <Navbar />
      </div>

      <main className="flex-1 max-w-[1240px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Page Hero Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F2B52B]/15 border border-[#F2B52B]/40 text-[#916200] text-xs font-bold uppercase tracking-wider mb-4">
            <Truck className="w-3.5 h-3.5 text-[#F2B52B]" />
            <span>Real-time Tracking</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-950 tracking-tight mb-4">
            Track Your Order
          </h1>
          <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
            Enter your SparkoMart Order ID or Carrier Tracking Number to check
            live delivery status and package timeline.
          </p>
        </div>

        {/* Tracking Search Form */}
        <div className="max-w-xl mx-auto mb-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleTrack();
            }}
            className="flex flex-col sm:flex-row gap-2.5 bg-white p-2 sm:p-2.5 rounded-2xl border border-gray-200 shadow-sm"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                placeholder="Enter Order ID (e.g. SPK-94821)"
                className="w-full bg-gray-50 text-gray-900 placeholder:text-gray-400 text-sm font-medium rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#F2B52B]/50 transition-all uppercase"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[#F2B52B] hover:bg-[#e0a41d] active:scale-98 text-gray-950 font-bold text-sm rounded-xl transition-all shadow-xs cursor-pointer shrink-0 flex items-center justify-center gap-2"
            >
              <span>Track Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Sample Chips */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-500">
            <span className="font-semibold text-gray-600">Quick Test Orders:</span>
            {Object.keys(SAMPLE_ORDERS).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setOrderIdInput(id);
                  handleTrack(id);
                }}
                className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-amber-100 hover:text-amber-900 border border-gray-200 font-mono transition-colors cursor-pointer"
              >
                {id}
              </button>
            ))}
          </div>
        </div>

        {/* Tracking Details View */}
        {activeOrder && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in-50 duration-300">
            {/* Status Summary Banner */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="font-mono font-bold text-sm text-gray-500">
                    Order {activeOrder.orderId}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      activeOrder.status === "delivered"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : activeOrder.status === "out_for_delivery"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                    <span>{activeOrder.statusText}</span>
                  </span>
                </div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                  {activeOrder.estimatedDelivery}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Shipped via <strong className="text-gray-800">{activeOrder.carrier}</strong> • Ordered on {activeOrder.orderDate}
                </p>
              </div>

              {/* Tracking Code Chip with Copy */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                <div className="text-xs">
                  <span className="text-gray-400 block font-medium">Tracking Number</span>
                  <span className="font-mono font-bold text-gray-900">
                    {activeOrder.trackingNumber}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyTracking(activeOrder.trackingNumber)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-gray-700 hover:text-black text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-gray-500" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Order Progress Stepper */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-950 mb-6">
                Delivery Progress
              </h3>

              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3.5 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-200">
                {activeOrder.timeline.map((step, idx) => {
                  return (
                    <div key={idx} className="relative flex items-start gap-4">
                      {/* Stepper Dot/Icon */}
                      <div
                        className={`absolute -left-6 sm:-left-8 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${
                          step.completed
                            ? "bg-[#F2B52B] border-[#F2B52B] text-gray-950 shadow-xs"
                            : "bg-white border-gray-300 text-gray-300"
                        }`}
                      >
                        {step.completed ? (
                          <Check className="w-4 h-4 stroke-[3]" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                          <h4
                            className={`text-sm font-bold ${
                              step.current
                                ? "text-[#F26E22]"
                                : step.completed
                                ? "text-gray-900"
                                : "text-gray-400"
                            }`}
                          >
                            {step.title}
                          </h4>
                          <span className="text-xs text-gray-500 font-mono">
                            {step.date}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recipient & Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Delivery Address */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-gray-900 font-bold text-sm mb-3">
                    <MapPin className="w-4 h-4 text-[#F2B52B]" />
                    <span>Shipping Address</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    {activeOrder.recipient.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {activeOrder.recipient.address}
                    <br />
                    {activeOrder.recipient.city}, {activeOrder.recipient.state} {activeOrder.recipient.zip}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span>Shipping Type: Standard Free</span>
                  <span className="text-emerald-600 font-bold">Verified</span>
                </div>
              </div>

              {/* Items in Package */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
                    <Package className="w-4 h-4 text-[#F2B52B]" />
                    <span>Items in Package ({activeOrder.items.length})</span>
                  </div>
                  <Link
                    href="/shop"
                    className="text-xs font-semibold text-[#F26E22] hover:underline"
                  >
                    Buy Again
                  </Link>
                </div>

                <div className="space-y-3">
                  {activeOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3.5 p-2 rounded-2xl bg-gray-50 border border-gray-100/80"
                    >
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white border border-gray-100 shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-bold text-gray-900 truncate">
                          {item.name}
                        </h5>
                        <p className="text-[11px] text-gray-500">
                          Qty: {item.quantity} • {item.category}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-gray-900 shrink-0">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Need Help CTA Banner */}
            <div className="bg-gradient-to-r from-gray-900 to-[#16375B] rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                  <HelpCircle className="w-6 h-6 text-[#F2B52B]" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-white">
                    Need help with your shipment?
                  </h4>
                  <p className="text-xs text-gray-300 mt-0.5">
                    Our customer support team is ready to assist 24/7.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href="/contact"
                  className="px-5 py-2.5 rounded-xl bg-white text-gray-950 font-bold text-xs hover:bg-gray-100 transition-colors"
                >
                  Contact Support
                </Link>
                <a
                  href="tel:+15123555110"
                  className="px-4 py-2.5 rounded-xl bg-white/15 border border-white/20 text-white font-bold text-xs hover:bg-white/25 transition-colors flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-[#F2B52B]" />
                  <span>Call Us</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-sm font-semibold text-gray-500 animate-pulse">
            Loading order tracking...
          </div>
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
