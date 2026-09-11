-- ==============================================================================
-- SparkoMart Supabase Schema & Initial Migration
-- Run this script in the Supabase SQL Editor (https://app.supabase.com)
-- ==============================================================================

-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT DEFAULT '' NOT NULL,
    image TEXT DEFAULT '' NOT NULL,
    cta TEXT DEFAULT 'Shop Now →' NOT NULL,
    href TEXT DEFAULT '' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    old_price NUMERIC(10, 2) DEFAULT NULL,
    rating NUMERIC(3, 1) NOT NULL DEFAULT 5.0,
    reviews INTEGER NOT NULL DEFAULT 0,
    badge TEXT DEFAULT NULL,
    in_stock BOOLEAN NOT NULL DEFAULT true,
    shipping TEXT NOT NULL DEFAULT 'Fast Shipping',
    image TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for Categories
DROP POLICY IF EXISTS "Public Read Categories" ON public.categories;
CREATE POLICY "Public Read Categories" 
ON public.categories FOR SELECT 
TO public 
USING (true);

DROP POLICY IF EXISTS "Public Manage Categories" ON public.categories;
CREATE POLICY "Public Manage Categories" 
ON public.categories FOR ALL 
TO public 
USING (true)
WITH CHECK (true);

-- 6. RLS Policies for Products
DROP POLICY IF EXISTS "Public Read Products" ON public.products;
CREATE POLICY "Public Read Products" 
ON public.products FOR SELECT 
TO public 
USING (true);

DROP POLICY IF EXISTS "Public Manage Products" ON public.products;
CREATE POLICY "Public Manage Products" 
ON public.products FOR ALL 
TO public 
USING (true)
WITH CHECK (true);

-- 7. Setup Storage Bucket for Product Images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for product-images bucket
DROP POLICY IF EXISTS "Public Read Images" ON storage.objects;
CREATE POLICY "Public Read Images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Public Upload Images" ON storage.objects;
CREATE POLICY "Public Upload Images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Public Manage Images" ON storage.objects;
CREATE POLICY "Public Manage Images"
ON storage.objects FOR ALL
TO public
USING (bucket_id = 'product-images')
WITH CHECK (bucket_id = 'product-images');

-- 8. Create Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Subscribe Newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Public Subscribe Newsletter"
ON public.newsletter_subscribers FOR INSERT
TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read Subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Public Read Subscribers"
ON public.newsletter_subscribers FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Public Delete Subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Public Delete Subscribers"
ON public.newsletter_subscribers FOR DELETE
TO public
USING (true);

-- 9. Create Contact Messages Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT DEFAULT '',
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unread',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Insert Contact Messages" ON public.contact_messages;
CREATE POLICY "Public Insert Contact Messages"
ON public.contact_messages FOR INSERT
TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read Contact Messages" ON public.contact_messages;
CREATE POLICY "Public Read Contact Messages"
ON public.contact_messages FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Public Update Contact Messages" ON public.contact_messages;
CREATE POLICY "Public Update Contact Messages"
ON public.contact_messages FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Public Delete Contact Messages" ON public.contact_messages;
CREATE POLICY "Public Delete Contact Messages"
ON public.contact_messages FOR DELETE
TO public
USING (true);

-- 10. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    tracking_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    shipping_address JSONB NOT NULL DEFAULT '{}'::jsonb,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    shipping_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    payment_method TEXT NOT NULL DEFAULT 'cod',
    payment_status TEXT NOT NULL DEFAULT 'pending',
    order_status TEXT NOT NULL DEFAULT 'processing',
    notes TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_order_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_tracking_number ON public.orders(tracking_number);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Insert Orders" ON public.orders;
CREATE POLICY "Public Insert Orders"
ON public.orders FOR INSERT
TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read Orders" ON public.orders;
CREATE POLICY "Public Read Orders"
ON public.orders FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Public Update Orders" ON public.orders;
CREATE POLICY "Public Update Orders"
ON public.orders FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Public Delete Orders" ON public.orders;
CREATE POLICY "Public Delete Orders"
ON public.orders FOR DELETE
TO public
USING (true);

-- ==============================================================================
-- 11. Seed Initial Categories Data
-- ==============================================================================
INSERT INTO public.categories (id, title, description, image, cta, href)
VALUES 
    ('electronics', 'Electronics', 'Latest gadgets, smartphones, laptops, tablets, and electronic accessories for tech enthusiasts.', '/images/electronics.jpg', 'Shop Now →', '/category/electronics'),
    ('clothing-fashion', 'Clothing & Fashion', 'Trendy clothing, shoes, accessories, and fashion items for men, women, and children.', '/images/clothing-store.jpg', 'Shop Now →', '/category/clothing-fashion'),
    ('home-kitchen', 'Home & Kitchen', 'Everything for your home including furniture, kitchen appliances, decor, and housewares.', '/images/home-kitchen.jpg', 'Shop Now →', '/category/home-kitchen'),
    ('sports-outdoors', 'Sports & Outdoors', 'Sports equipment, outdoor gear, fitness accessories, and adventure essentials for active lifestyles.', '/images/sports-outdoors.jpg', 'Shop Now →', '/category/sports-outdoors'),
    ('books-media', 'Books & Media', 'Bestselling novels, educational guides, journals, and literature for passionate readers.', '/images/books.jpg', 'Shop Now →', '/category/books-media'),
    ('health-beauty', 'Health & Beauty', 'Skincare essentials, cosmetics, natural wellness, and personal care routines.', '/images/beauty.jpg', 'Shop Now →', '/category/health-beauty')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    cta = EXCLUDED.cta,
    href = EXCLUDED.href;

-- ==============================================================================
-- 9. Seed Initial Products Data
-- ==============================================================================
INSERT INTO public.products (id, name, category_id, price, old_price, rating, reviews, badge, in_stock, shipping, image)
VALUES 
    ('yoga-mat-premium', 'Yoga Mat Premium', 'sports-outdoors', 49.99, 59.99, 4.9, 98, 'Sale', true, 'Fast Shipping', '/images/yoga-mat.jpg'),
    ('kitchen-knife-set-pro', 'Kitchen Knife Set Professional', 'home-kitchen', 129.99, 179.99, 4.9, 189, 'Sale', true, 'Fast Shipping', '/images/knife-set.jpg'),
    ('stainless-steel-cookware', 'Stainless Steel Cookware Set', 'home-kitchen', 149.99, 169.99, 4.8, 234, 'Sale', true, 'Fast Shipping', '/images/cookware.jpg'),
    ('wireless-bluetooth-headphones', 'Wireless Bluetooth Headphones', 'electronics', 79.99, 99.99, 4.8, 324, 'Sale', true, 'Fast Shipping', '/images/headphones.jpg')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category_id = EXCLUDED.category_id,
    price = EXCLUDED.price,
    old_price = EXCLUDED.old_price,
    rating = EXCLUDED.rating,
    reviews = EXCLUDED.reviews,
    badge = EXCLUDED.badge,
    in_stock = EXCLUDED.in_stock,
    shipping = EXCLUDED.shipping,
    image = EXCLUDED.image;
