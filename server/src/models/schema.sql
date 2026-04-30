CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mobile VARCHAR(15) UNIQUE NOT NULL,
  pin_hash VARCHAR(255),
  name VARCHAR(100),
  email VARCHAR(150),
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  mode VARCHAR(20) DEFAULT 'individual',
  is_active BOOLEAN DEFAULT true,
  fcm_token TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS otp_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mobile VARCHAR(15) NOT NULL,
  otp_hash VARCHAR(255) NOT NULL,
  purpose VARCHAR(30) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  shop_name VARCHAR(150) NOT NULL,
  description TEXT,
  logo_url TEXT,
  address TEXT,
  city VARCHAR(100),
  pincode VARCHAR(10),
  gst_number VARCHAR(20),
  commission_pct NUMERIC(5,2) DEFAULT 8.00,
  bank_account_name VARCHAR(100),
  bank_account_number VARCHAR(30),
  bank_ifsc VARCHAR(15),
  razorpay_contact_id VARCHAR(100),
  razorpay_fund_account_id VARCHAR(100),
  rating NUMERIC(3,2) DEFAULT 0.00,
  total_orders INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  image_url TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  description TEXT,
  images JSONB DEFAULT '[]',
  price NUMERIC(10,2) NOT NULL,
  mrp NUMERIC(10,2) NOT NULL,
  unit VARCHAR(50),
  stock INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  label VARCHAR(50),
  line1 TEXT NOT NULL,
  line2 TEXT,
  city VARCHAR(100),
  pincode VARCHAR(10),
  lat NUMERIC(10,7),
  lng NUMERIC(10,7),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  type VARCHAR(30) NOT NULL,
  code VARCHAR(30) UNIQUE,
  discount_pct NUMERIC(5,2),
  discount_flat NUMERIC(10,2),
  min_order_value NUMERIC(10,2) DEFAULT 0,
  max_discount NUMERIC(10,2),
  applies_to VARCHAR(20) DEFAULT 'all',
  reference_id UUID,
  valid_from TIMESTAMPTZ,
  valid_to TIMESTAMPTZ,
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(20) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id),
  address_id UUID REFERENCES addresses(id),
  status VARCHAR(30) DEFAULT 'pending',
  subtotal NUMERIC(10,2) NOT NULL,
  delivery_fee NUMERIC(10,2) DEFAULT 0,
  discount_amount NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  offer_id UUID REFERENCES offers(id),
  razorpay_order_id VARCHAR(100),
  razorpay_payment_id VARCHAR(100),
  payment_status VARCHAR(20) DEFAULT 'pending',
  payment_method VARCHAR(30),
  is_hotel_order BOOLEAN DEFAULT false,
  gst_invoice_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  vendor_id UUID REFERENCES vendors(id),
  name VARCHAR(200) NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vendor_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES vendors(id),
  order_id UUID REFERENCES orders(id),
  gross_amount NUMERIC(10,2) NOT NULL,
  commission_pct NUMERIC(5,2) NOT NULL,
  commission_amount NUMERIC(10,2) NOT NULL,
  net_amount NUMERIC(10,2) NOT NULL,
  razorpay_payout_id VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200),
  image_url TEXT NOT NULL,
  link_type VARCHAR(30),
  link_id UUID,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_vendor ON products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_vendor ON order_items(vendor_id);
CREATE INDEX IF NOT EXISTS idx_otp_mobile ON otp_logs(mobile);
CREATE INDEX IF NOT EXISTS idx_otp_expires ON otp_logs(expires_at);
CREATE INDEX IF NOT EXISTS idx_vendors_active ON vendors(is_active, is_approved);

INSERT INTO users (mobile, name, role, pin_hash)
VALUES ('9999999999', 'Super Admin', 'admin', '$2b$10$placeholder_replace_with_real_hash')
ON CONFLICT (mobile) DO NOTHING;

INSERT INTO categories (name, slug, sort_order) VALUES
  ('Dairy', 'dairy', 1),
  ('Vegetables', 'vegetables', 2),
  ('Fruits', 'fruits', 3),
  ('Oils & Ghee', 'oils-ghee', 4),
  ('Grains & Rice', 'grains-rice', 5),
  ('Eggs', 'eggs', 6),
  ('Spices', 'spices', 7),
  ('Hygiene', 'hygiene', 8)
ON CONFLICT (slug) DO NOTHING;
