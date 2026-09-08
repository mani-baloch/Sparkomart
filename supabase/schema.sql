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

-- ==============================================================================
-- 8. Seed Initial Categories Data
-- ==============================================================================
INSERT INTO public.categories (id, title, description, image, cta, href)
VALUES 
    ('electronics', 'Electronics', 'Latest gadgets, smartphones, laptops, tablets, and electronic accessories for tech enthusiasts.', '/images/electronics.jpg', 'Shop Now →', '#electronics'),
    ('clothing-fashion', 'Clothing & Fashion', 'Trendy clothing, shoes, accessories, and fashion items for men, women, and children.', '/images/clothing-store.jpg', 'Shop Now →', '#clothing'),
    ('home-kitchen', 'Home & Kitchen', 'Everything for your home including furniture, kitchen appliances, decor, and housewares.', '/images/home-kitchen.jpg', 'Shop Now →', '#home-kitchen'),
    ('sports-outdoors', 'Sports & Outdoors', 'Sports equipment, outdoor gear, fitness accessories, and adventure essentials for active lifestyles.', '/images/sports-outdoors.jpg', 'Shop Now →', '#sports-outdoors')
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
