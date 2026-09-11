-- ==============================================================================
-- SparkoMart: Orders Table & Security Policies
-- Run this script in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. Create table for customer orders
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY, -- e.g. 'SPK-83921'
    tracking_number TEXT UNIQUE NOT NULL, -- e.g. 'FX-9283748291US'
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    shipping_address JSONB NOT NULL DEFAULT '{}'::jsonb,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    shipping_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    payment_method TEXT NOT NULL DEFAULT 'cod', -- 'cod' | 'card'
    payment_status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'paid'
    order_status TEXT NOT NULL DEFAULT 'processing', -- 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
    notes TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_order_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_tracking_number ON public.orders(tracking_number);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 4. Public Insert: Allow customers to place orders
DROP POLICY IF EXISTS "Public Insert Orders" ON public.orders;
CREATE POLICY "Public Insert Orders"
ON public.orders FOR INSERT
TO public
WITH CHECK (true);

-- 5. Public Read: Allow reading orders (for tracking and admin panel)
DROP POLICY IF EXISTS "Public Read Orders" ON public.orders;
CREATE POLICY "Public Read Orders"
ON public.orders FOR SELECT
TO public
USING (true);

-- 6. Public Update: Allow updating orders (for status changes)
DROP POLICY IF EXISTS "Public Update Orders" ON public.orders;
CREATE POLICY "Public Update Orders"
ON public.orders FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- 7. Public Delete: Allow deleting orders (for admin management)
DROP POLICY IF EXISTS "Public Delete Orders" ON public.orders;
CREATE POLICY "Public Delete Orders"
ON public.orders FOR DELETE
TO public
USING (true);
