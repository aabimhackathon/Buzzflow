import { createClient } from '@supabase/supabase-js';

// Secure Supabase Configuration from Environment Variables
const metaEnv = (import.meta as unknown as { env: Record<string, string> }).env || {};
export const SUPABASE_URL = metaEnv.VITE_SUPABASE_URL || 'https://iaypgepkmphoozrtmqbt.supabase.co';
export const SUPABASE_ANON_KEY = metaEnv.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlheXBnZXBrbXBob296cnRtcWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1NDQxMzksImV4cCI6MjEwMDEyMDEzOX0.tGUBgdo5IPWOgt17wiJOdCKXT09HLgh4OeGyKPAVhmw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * SQL DDL Schema string for initializing Supabase tables.
 * Users can view/copy this or use it to execute via Supabase SQL Editor.
 */
export const SUPABASE_SCHEMA_SQL = `-- Complete ICAI Accounting, Inventory, Security PIN & Fiscal Archive Schema
-- Execute this SQL in Supabase SQL Editor (https://supabase.com/dashboard/project/iaypgepkmphoozrtmqbt/sql)

-- 1. Companies Table with 5-Digit Security PIN & Financial Year Rules
CREATE TABLE IF NOT EXISTS public.companies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  legal_name TEXT,
  fy_start DATE NOT NULL,
  fy_end DATE NOT NULL,
  gstin TEXT,
  currency TEXT DEFAULT 'INR',
  currency_symbol TEXT DEFAULT '₹',
  address TEXT,
  city TEXT,
  state TEXT,
  pin_code TEXT,
  phone TEXT,
  email TEXT,
  industry TEXT,
  pin_code_security TEXT NOT NULL DEFAULT '12345',
  last_pin_changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  pin_changed_quarters JSONB DEFAULT '{"q1": true, "q2": true, "q3": false, "q4": false}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Ledgers / Chart of Accounts Table
CREATE TABLE IF NOT EXISTS public.ledgers (
  id TEXT PRIMARY KEY,
  company_id TEXT REFERENCES public.companies(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  group_id TEXT NOT NULL,
  group_name TEXT NOT NULL,
  category TEXT NOT NULL,
  nature TEXT NOT NULL,
  opening_balance NUMERIC DEFAULT 0,
  current_balance NUMERIC DEFAULT 0,
  gstin TEXT,
  email TEXT,
  phone TEXT,
  is_system BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Vouchers Table (Journal, Ledger Entries, Day Book)
CREATE TABLE IF NOT EXISTS public.vouchers (
  id TEXT PRIMARY KEY,
  company_id TEXT REFERENCES public.companies(id) ON DELETE CASCADE,
  voucher_no TEXT NOT NULL,
  voucher_type TEXT NOT NULL,
  date DATE NOT NULL,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  narration TEXT,
  status TEXT DEFAULT 'posted',
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Inventory Items Table (Stock Management linked with Accounting)
CREATE TABLE IF NOT EXISTS public.inventory_items (
  id TEXT PRIMARY KEY,
  company_id TEXT REFERENCES public.companies(id) ON DELETE CASCADE,
  item_code TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  unit TEXT NOT NULL DEFAULT 'Pcs',
  hsn_code TEXT,
  gst_rate NUMERIC DEFAULT 18,
  cost_price NUMERIC DEFAULT 0,
  selling_price NUMERIC DEFAULT 0,
  current_stock NUMERIC DEFAULT 0,
  reorder_level NUMERIC DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Invoices / Flexible Billing Table
CREATE TABLE IF NOT EXISTS public.invoices (
  id TEXT PRIMARY KEY,
  company_id TEXT REFERENCES public.companies(id) ON DELETE CASCADE,
  invoice_no TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_gstin TEXT,
  customer_address TEXT,
  invoice_date DATE NOT NULL,
  due_date DATE,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC DEFAULT 0,
  tax_amount NUMERIC DEFAULT 0,
  discount_amount NUMERIC DEFAULT 0,
  total_amount NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'unpaid',
  voucher_id TEXT,
  terms TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Fiscal Archives Table (For Year-End Rollover & Historical Records)
CREATE TABLE IF NOT EXISTS public.fiscal_archives (
  id TEXT PRIMARY KEY,
  company_id TEXT REFERENCES public.companies(id) ON DELETE CASCADE,
  financial_year TEXT NOT NULL,
  archived_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  opening_balances JSONB NOT NULL DEFAULT '{}'::jsonb,
  closing_balances JSONB NOT NULL DEFAULT '{}'::jsonb,
  vouchers_snapshot JSONB NOT NULL DEFAULT '[]'::jsonb,
  profit_loss_summary JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Enable RLS & Policies
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ledgers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fiscal_archives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select companies" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Allow public insert companies" ON public.companies FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update companies" ON public.companies FOR UPDATE USING (true);

CREATE POLICY "Allow public select ledgers" ON public.ledgers FOR SELECT USING (true);
CREATE POLICY "Allow public insert ledgers" ON public.ledgers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update ledgers" ON public.ledgers FOR UPDATE USING (true);

CREATE POLICY "Allow public select vouchers" ON public.vouchers FOR SELECT USING (true);
CREATE POLICY "Allow public insert vouchers" ON public.vouchers FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select inventory" ON public.inventory_items FOR SELECT USING (true);
CREATE POLICY "Allow public insert inventory" ON public.inventory_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update inventory" ON public.inventory_items FOR UPDATE USING (true);

CREATE POLICY "Allow public select invoices" ON public.invoices FOR SELECT USING (true);
CREATE POLICY "Allow public insert invoices" ON public.invoices FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select archives" ON public.fiscal_archives FOR SELECT USING (true);
CREATE POLICY "Allow public insert archives" ON public.fiscal_archives FOR INSERT WITH CHECK (true);
`;
