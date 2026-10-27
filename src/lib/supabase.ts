import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qgkefplidtrgafpinmcc.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Nomes oficiais das tabelas com o prefixo 'commercer_' conforme solicitado pelo Chefe:
 */
export const TABLES = {
  TENANTS: 'commercer_tenants',
  CATEGORIES: 'commercer_categories',
  PRODUCTS: 'commercer_products',
  ORDERS: 'commercer_orders',
  CUSTOMERS: 'commercer_customers',
  TRANSACTIONS: 'commercer_transactions',
  SETTINGS: 'commercer_settings'
} as const;

/**
 * Script SQL para criar ou atualizar as tabelas no Supabase caso necessário
 */
export const SQL_SCHEMA_REFERENCE = `
-- 1. Tenants (Lojas Multi-Tenant)
CREATE TABLE IF NOT EXISTS commercer_tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  segment TEXT NOT NULL DEFAULT 'geral',
  slogan TEXT,
  description TEXT,
  logo_url TEXT,
  banner_url TEXT,
  whatsapp TEXT,
  email TEXT,
  phone TEXT,
  address_street TEXT,
  address_number TEXT,
  address_neighborhood TEXT,
  address_city TEXT,
  address_state TEXT,
  address_zip TEXT,
  primary_color TEXT DEFAULT '#c6892e',
  secondary_color TEXT DEFAULT '#1e293b',
  accent_color TEXT DEFAULT '#f59e0b',
  delivery_fee NUMERIC DEFAULT 10.00,
  free_shipping_threshold NUMERIC DEFAULT 150.00,
  delivery_estimate TEXT DEFAULT '30 a 60 min',
  allows_pickup BOOLEAN DEFAULT true,
  pickup_instructions TEXT,
  pix_key TEXT,
  pix_type TEXT DEFAULT 'chave',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Categorias
CREATE TABLE IF NOT EXISTS commercer_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES commercer_tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  icon TEXT,
  display_order INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Produtos & Variações
CREATE TABLE IF NOT EXISTS commercer_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES commercer_tenants(id) ON DELETE CASCADE,
  category_id UUID REFERENCES commercer_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  base_price NUMERIC NOT NULL DEFAULT 0.00,
  cost_price NUMERIC DEFAULT 0.00,
  promo_price NUMERIC,
  images JSONB DEFAULT '[]'::jsonb,
  stock_qty INT DEFAULT 0,
  track_stock BOOLEAN DEFAULT true,
  sku TEXT,
  barcode TEXT,
  badge TEXT,
  variations JSONB DEFAULT '[]'::jsonb,
  tags JSONB DEFAULT '[]'::jsonb,
  active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Pedidos & Vendas
CREATE TABLE IF NOT EXISTS commercer_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES commercer_tenants(id) ON DELETE CASCADE,
  order_number BIGSERIAL,
  customer_name TEXT NOT NULL,
  customer_whatsapp TEXT NOT NULL,
  customer_document TEXT,
  customer_address TEXT,
  delivery_type TEXT DEFAULT 'delivery',
  delivery_fee NUMERIC DEFAULT 0.00,
  subtotal NUMERIC NOT NULL DEFAULT 0.00,
  discount NUMERIC DEFAULT 0.00,
  total NUMERIC NOT NULL DEFAULT 0.00,
  payment_method TEXT NOT NULL,
  payment_status TEXT DEFAULT 'pendente',
  order_status TEXT DEFAULT 'novo',
  notes TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Clientes
CREATE TABLE IF NOT EXISTS commercer_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES commercer_tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT,
  document TEXT,
  address TEXT,
  total_spent NUMERIC DEFAULT 0.00,
  total_orders INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Transações Financeiras (Fluxo de Caixa, Contas a Pagar/Receber)
CREATE TABLE IF NOT EXISTS commercer_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES commercer_tenants(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'entrada' | 'saida'
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0.00,
  payment_method TEXT,
  account TEXT DEFAULT 'Caixa Balcão',
  due_date DATE NOT NULL,
  payment_date DATE,
  status TEXT DEFAULT 'pago',
  related_order_id UUID REFERENCES commercer_orders(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
`;
