import { createBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  notes?: string;
}

export type PaymentMethod = "cod" | "card";
export type PaymentStatus = "pending" | "paid";
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string; // e.g. SPK-84920
  tracking_number: string; // e.g. FX-9283748291US
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shipping_fee: number;
  total: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  notes?: string;
  created_at: string;
  carrier?: string;
  estimated_delivery?: string;
}

export interface CreateOrderInput {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shippingFee?: number;
  total: number;
  paymentMethod: PaymentMethod;
  cardDetails?: {
    cardNumberLast4?: string;
    cardHolderName?: string;
  };
  notes?: string;
}

const LOCAL_STORAGE_KEY = "sparkomart_orders";
const UPDATE_EVENT_KEY = "sparkomart_orders_updated";

function getLocalOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => ({
          id: item.id || `SPK-${Math.floor(10000 + Math.random() * 90000)}`,
          tracking_number:
            item.tracking_number ||
            `FX-${Math.floor(100000000000 + Math.random() * 900000000000)}`,
          customer_name: item.customer_name || item.customerName || "Customer",
          customer_email: (item.customer_email || item.customerEmail || "").toLowerCase(),
          customer_phone: item.customer_phone || item.customerPhone || "",
          shipping_address: item.shipping_address || item.shippingAddress || {
            fullName: item.customer_name || "Customer",
            email: item.customer_email || "",
            phone: item.customer_phone || "",
            street: "5900 Balcones Dr",
            city: "Austin",
            state: "TX",
            zip: "78731",
            country: "United States",
          },
          items: item.items || [],
          subtotal: Number(item.subtotal || 0),
          shipping_fee: Number(item.shipping_fee || item.shippingFee || 0),
          total: Number(item.total || 0),
          payment_method: (item.payment_method as PaymentMethod) || "cod",
          payment_status: (item.payment_status as PaymentStatus) || "pending",
          order_status: (item.order_status as OrderStatus) || "processing",
          notes: item.notes || "",
          created_at: item.created_at || new Date().toISOString(),
          carrier: item.carrier || "FedEx Express",
          estimated_delivery: item.estimated_delivery || "Expected in 2-3 business days",
        }));
      }
    }
  } catch (e) {
    console.warn("Failed to parse local orders store:", e);
  }
  return [];
}

function saveLocalOrders(orders: Order[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(orders));
    window.dispatchEvent(new Event(UPDATE_EVENT_KEY));
  } catch (e) {
    console.error("Failed to save local orders:", e);
  }
}

/**
 * Place a new customer order.
 * Saves immediately to local storage (instant cross-tab and admin update)
 * and syncs to Supabase.
 */
export async function createOrder(
  input: CreateOrderInput
): Promise<{ success: boolean; order?: Order; error?: string }> {
  if (!input.customerName.trim()) {
    return { success: false, error: "Please enter your full name." };
  }
  if (!input.customerEmail.trim() || !input.customerEmail.includes("@")) {
    return { success: false, error: "Please enter a valid email address." };
  }
  if (!input.customerPhone.trim()) {
    return { success: false, error: "Please enter your phone number." };
  }
  if (!input.shippingAddress.street.trim() || !input.shippingAddress.city.trim()) {
    return { success: false, error: "Please enter complete shipping address details." };
  }
  if (!input.items || input.items.length === 0) {
    return { success: false, error: "Your shopping bag is empty." };
  }

  // Generate readable Order ID & Tracking Number
  const randomIdNumber = Math.floor(10000 + Math.random() * 90000);
  const orderId = `SPK-${randomIdNumber}`;
  const trackingNumber = `FX-${Math.floor(100000000000 + Math.random() * 900000000000)}`;

  const isCard = input.paymentMethod === "card";
  const paymentStatus: PaymentStatus = isCard ? "paid" : "pending";

  const newOrder: Order = {
    id: orderId,
    tracking_number: trackingNumber,
    customer_name: input.customerName.trim(),
    customer_email: input.customerEmail.trim().toLowerCase(),
    customer_phone: input.customerPhone.trim(),
    shipping_address: input.shippingAddress,
    items: input.items,
    subtotal: Number(input.subtotal),
    shipping_fee: Number(input.shippingFee || 0),
    total: Number(input.total),
    payment_method: input.paymentMethod,
    payment_status: paymentStatus,
    order_status: "processing",
    notes: input.notes?.trim() || "",
    created_at: new Date().toISOString(),
    carrier: "FedEx Express",
    estimated_delivery: "Expected in 2-3 business days",
  };

  // 1. Immediately save to LocalStorage so Admin Panel sees it live
  const localList = getLocalOrders();
  saveLocalOrders([newOrder, ...localList]);

  // 2. Persist to Supabase if configured
  if (isSupabaseConfigured()) {
    const supabase = createBrowserClient();
    if (supabase) {
      try {
        const { error } = await supabase.from("orders").insert({
          id: newOrder.id,
          tracking_number: newOrder.tracking_number,
          customer_name: newOrder.customer_name,
          customer_email: newOrder.customer_email,
          customer_phone: newOrder.customer_phone,
          shipping_address: newOrder.shipping_address as any,
          items: newOrder.items as any,
          subtotal: newOrder.subtotal,
          shipping_fee: newOrder.shipping_fee,
          total: newOrder.total,
          payment_method: newOrder.payment_method,
          payment_status: newOrder.payment_status,
          order_status: newOrder.order_status,
          notes: newOrder.notes,
          created_at: newOrder.created_at,
        });

        if (error) {
          console.warn("Supabase order insert note:", error.message);
        }
      } catch (err) {
        console.warn("Supabase order connection error:", err);
      }
    }
  }

  return { success: true, order: newOrder };
}

/**
 * Fetch all orders for the Admin Panel.
 * Merges Supabase records with local storage cache.
 */
export async function getOrders(): Promise<Order[]> {
  const localList = getLocalOrders();

  if (isSupabaseConfigured()) {
    const supabase = createBrowserClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && Array.isArray(data)) {
          const dbOrders: Order[] = data.map((d) => ({
            id: d.id,
            tracking_number: d.tracking_number,
            customer_name: d.customer_name,
            customer_email: d.customer_email,
            customer_phone: d.customer_phone,
            shipping_address: (d.shipping_address as unknown as ShippingAddress) || {
              fullName: d.customer_name,
              email: d.customer_email,
              phone: d.customer_phone,
              street: "",
              city: "",
              state: "",
              zip: "",
              country: "United States",
            },
            items: (d.items as unknown as OrderItem[]) || [],
            subtotal: Number(d.subtotal || 0),
            shipping_fee: Number(d.shipping_fee || 0),
            total: Number(d.total || 0),
            payment_method: (d.payment_method as PaymentMethod) || "cod",
            payment_status: (d.payment_status as PaymentStatus) || "pending",
            order_status: (d.order_status as OrderStatus) || "processing",
            notes: d.notes || "",
            created_at: d.created_at,
            carrier: "FedEx Express",
            estimated_delivery: "Expected in 2-3 business days",
          }));

          const dbIds = new Set(dbOrders.map((o) => o.id.toUpperCase()));
          const localOnly = localList.filter((o) => !dbIds.has(o.id.toUpperCase()));

          const combined = [...dbOrders, ...localOnly].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );

          if (typeof window !== "undefined") {
            try {
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(combined));
            } catch (e) {}
          }

          return combined;
        }
      } catch (err) {
        console.warn("Failed to fetch orders from Supabase, using local store:", err);
      }
    }
  }

  return localList.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

/**
 * Search an order by Order ID, Tracking Number, or Customer Email.
 * Used by the Customer Track Order page.
 */
export async function getOrderByIdOrTracking(query: string): Promise<Order | null> {
  const clean = query.trim().toUpperCase();
  if (!clean) return null;

  // 1. Check local cache
  const localList = getLocalOrders();
  const localMatch = localList.find(
    (o) =>
      o.id.toUpperCase() === clean ||
      o.tracking_number.toUpperCase() === clean ||
      o.customer_email.toUpperCase() === clean
  );
  if (localMatch) return localMatch;

  // 2. Query Supabase if connected
  if (isSupabaseConfigured()) {
    const supabase = createBrowserClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .or(`id.ilike.%${clean}%,tracking_number.ilike.%${clean}%,customer_email.ilike.%${clean}%`)
          .limit(1)
          .maybeSingle();

        if (!error && data) {
          return {
            id: data.id,
            tracking_number: data.tracking_number,
            customer_name: data.customer_name,
            customer_email: data.customer_email,
            customer_phone: data.customer_phone,
            shipping_address: (data.shipping_address as unknown as ShippingAddress) || {
              fullName: data.customer_name,
              email: data.customer_email,
              phone: data.customer_phone,
              street: "",
              city: "",
              state: "",
              zip: "",
              country: "United States",
            },
            items: (data.items as unknown as OrderItem[]) || [],
            subtotal: Number(data.subtotal || 0),
            shipping_fee: Number(data.shipping_fee || 0),
            total: Number(data.total || 0),
            payment_method: (data.payment_method as PaymentMethod) || "cod",
            payment_status: (data.payment_status as PaymentStatus) || "pending",
            order_status: (data.order_status as OrderStatus) || "processing",
            notes: data.notes || "",
            created_at: data.created_at,
            carrier: "FedEx Express",
            estimated_delivery: "Expected in 2-3 business days",
          };
        }
      } catch (err) {
        console.warn("Error querying order from Supabase:", err);
      }
    }
  }

  return null;
}

/**
 * Update an order's status and optional notes.
 * Reflects immediately across customer tracking and admin views.
 */
export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  paymentStatusUpdate?: PaymentStatus
): Promise<boolean> {
  const currentList = getLocalOrders();
  const updated = currentList.map((o) => {
    if (o.id.toUpperCase() === orderId.toUpperCase()) {
      return {
        ...o,
        order_status: newStatus,
        payment_status: paymentStatusUpdate || (newStatus === "delivered" && o.payment_method === "cod" ? "paid" : o.payment_status),
      };
    }
    return o;
  });
  saveLocalOrders(updated);

  if (isSupabaseConfigured()) {
    const supabase = createBrowserClient();
    if (supabase) {
      try {
        const updatePayload: any = { order_status: newStatus };
        if (paymentStatusUpdate) {
          updatePayload.payment_status = paymentStatusUpdate;
        } else if (newStatus === "delivered") {
          updatePayload.payment_status = "paid";
        }
        await supabase.from("orders").update(updatePayload).eq("id", orderId);
      } catch (err) {
        console.warn("Failed to update order in Supabase:", err);
      }
    }
  }

  return true;
}

/**
 * Delete an order (Admin control).
 */
export async function deleteOrder(orderId: string): Promise<boolean> {
  const currentList = getLocalOrders();
  const updated = currentList.filter((o) => o.id.toUpperCase() !== orderId.toUpperCase());
  saveLocalOrders(updated);

  if (isSupabaseConfigured()) {
    const supabase = createBrowserClient();
    if (supabase) {
      try {
        await supabase.from("orders").delete().eq("id", orderId);
      } catch (err) {
        console.warn("Failed to delete order from Supabase:", err);
      }
    }
  }

  return true;
}

/**
 * Real-time subscription to orders.
 */
export function subscribeToOrders(onUpdate: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handleLocal = () => onUpdate();
  const handleStorage = (e: StorageEvent) => {
    if (e.key === LOCAL_STORAGE_KEY) {
      onUpdate();
    }
  };

  window.addEventListener(UPDATE_EVENT_KEY, handleLocal);
  window.addEventListener("storage", handleStorage);

  let channel: any = null;
  if (isSupabaseConfigured()) {
    try {
      const supabase = createBrowserClient();
      if (supabase) {
        channel = supabase
          .channel("realtime-orders")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "orders" },
            () => onUpdate()
          )
          .subscribe();
      }
    } catch (e) {}
  }

  return () => {
    window.removeEventListener(UPDATE_EVENT_KEY, handleLocal);
    window.removeEventListener("storage", handleStorage);
    if (channel && isSupabaseConfigured()) {
      try {
        const supabase = createBrowserClient();
        if (supabase) supabase.removeChannel(channel);
      } catch (e) {}
    }
  };
}
