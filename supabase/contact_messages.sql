-- ==============================================================================
-- SparkoMart: Contact Messages Table & Security Policies
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. Create table for storing contact form submissions
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT DEFAULT '',
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unread', -- 'unread' | 'read' | 'replied'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create indexes for quick filtering & sorting
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- 4. Allow any website visitor to submit a contact form message
DROP POLICY IF EXISTS "Public Insert Contact Messages" ON public.contact_messages;
CREATE POLICY "Public Insert Contact Messages"
ON public.contact_messages FOR INSERT
TO public
WITH CHECK (true);

-- 5. Allow reading contact messages (for Admin panel)
DROP POLICY IF EXISTS "Public Read Contact Messages" ON public.contact_messages;
CREATE POLICY "Public Read Contact Messages"
ON public.contact_messages FOR SELECT
TO public
USING (true);

-- 6. Allow updating status (e.g. marking as read/replied)
DROP POLICY IF EXISTS "Public Update Contact Messages" ON public.contact_messages;
CREATE POLICY "Public Update Contact Messages"
ON public.contact_messages FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- 7. Allow deleting messages
DROP POLICY IF EXISTS "Public Delete Contact Messages" ON public.contact_messages;
CREATE POLICY "Public Delete Contact Messages"
ON public.contact_messages FOR DELETE
TO public
USING (true);
