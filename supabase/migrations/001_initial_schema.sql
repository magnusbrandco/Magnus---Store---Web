-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- PROFILES
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT UNIQUE NOT NULL,
  full_name     TEXT,
  phone         TEXT,
  avatar_url    TEXT,
  role          TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'staff')),
  is_subscribed BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ADDRESSES
CREATE TABLE addresses (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES profiles(id) ON DELETE CASCADE,
  label         TEXT DEFAULT 'Casa',
  full_name     TEXT NOT NULL,
  phone         TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city          TEXT NOT NULL,
  department    TEXT NOT NULL,
  postal_code   TEXT,
  is_default    BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- BRANDS
CREATE TABLE brands (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT UNIQUE NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  logo_url    TEXT,
  cover_url   TEXT,
  description TEXT,
  is_featured BOOLEAN DEFAULT false,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- CATEGORIES
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url   TEXT,
  parent_id   UUID REFERENCES categories(id),
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- PRODUCTS
CREATE TABLE products (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  description   TEXT,
  brand_id      UUID REFERENCES brands(id),
  category_id   UUID REFERENCES categories(id),
  base_price    NUMERIC(12,0) NOT NULL,
  compare_price NUMERIC(12,0),
  images        JSONB NOT NULL DEFAULT '[]',
  tags          TEXT[] DEFAULT '{}',
  is_active     BOOLEAN DEFAULT true,
  is_featured   BOOLEAN DEFAULT false,
  is_drop       BOOLEAN DEFAULT false,
  metadata      JSONB DEFAULT '{}',
  search_vector TSVECTOR,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX products_search_idx ON products USING GIN(search_vector);
CREATE INDEX products_slug_idx ON products(slug);
CREATE INDEX products_brand_idx ON products(brand_id);
CREATE INDEX products_category_idx ON products(category_id);
CREATE INDEX products_active_idx ON products(is_active) WHERE is_active = true;

CREATE OR REPLACE FUNCTION update_product_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('spanish',
    COALESCE(NEW.name, '') || ' ' ||
    COALESCE(NEW.description, '') || ' ' ||
    COALESCE(array_to_string(NEW.tags, ' '), '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER product_search_vector_update
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_product_search_vector();

-- PRODUCT VARIANTS
CREATE TABLE product_variants (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID REFERENCES products(id) ON DELETE CASCADE,
  sku         TEXT UNIQUE,
  size        TEXT,
  color       TEXT,
  color_hex   TEXT,
  stock       INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  price       NUMERIC(12,0),
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX variants_product_idx ON product_variants(product_id);
CREATE INDEX variants_sku_idx ON product_variants(sku);

-- DROPS
CREATE TABLE drops (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  description   TEXT,
  cover_url     TEXT,
  drop_date     TIMESTAMPTZ NOT NULL,
  is_active     BOOLEAN DEFAULT false,
  is_published  BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE drop_products (
  drop_id    UUID REFERENCES drops(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  PRIMARY KEY (drop_id, product_id)
);

CREATE TABLE drop_subscribers (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  drop_id    UUID REFERENCES drops(id) ON DELETE CASCADE,
  email      TEXT NOT NULL,
  user_id    UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(drop_id, email)
);

-- CARTS
CREATE TABLE carts (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id),
  UNIQUE(session_id)
);

CREATE TABLE cart_items (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id    UUID REFERENCES carts(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id),
  product_id UUID REFERENCES products(id),
  quantity   INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  price      NUMERIC(12,0) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ORDERS
CREATE TABLE orders (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number     TEXT UNIQUE NOT NULL DEFAULT ('MNS-' || upper(substring(gen_random_uuid()::text, 1, 8))),
  user_id          UUID REFERENCES profiles(id),
  status           TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending', 'payment_pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  payment_status   TEXT NOT NULL DEFAULT 'pending'
                   CHECK (payment_status IN ('pending', 'approved', 'declined', 'voided', 'error')),
  payment_method   TEXT,
  wompi_tx_id      TEXT,
  subtotal         NUMERIC(12,0) NOT NULL,
  discount         NUMERIC(12,0) DEFAULT 0,
  shipping_cost    NUMERIC(12,0) DEFAULT 0,
  total            NUMERIC(12,0) NOT NULL,
  coupon_code      TEXT,
  shipping_address JSONB NOT NULL,
  notes            TEXT,
  metadata         JSONB DEFAULT '{}',
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id     UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id   UUID REFERENCES products(id),
  variant_id   UUID REFERENCES product_variants(id),
  product_name TEXT NOT NULL,
  variant_info JSONB,
  quantity     INT NOT NULL,
  unit_price   NUMERIC(12,0) NOT NULL,
  total_price  NUMERIC(12,0) NOT NULL
);

CREATE TABLE order_events (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id   UUID REFERENCES orders(id) ON DELETE CASCADE,
  event      TEXT NOT NULL,
  data       JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX orders_user_idx ON orders(user_id);
CREATE INDEX orders_status_idx ON orders(status);
CREATE INDEX orders_number_idx ON orders(order_number);

-- WISHLIST
CREATE TABLE wishlists (
  user_id    UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, product_id)
);

-- REVIEWS
CREATE TABLE reviews (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES profiles(id) ON DELETE CASCADE,
  order_id   UUID REFERENCES orders(id),
  rating     INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title      TEXT,
  body       TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_visible  BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, user_id)
);

-- COUPONS
CREATE TABLE coupons (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code            TEXT UNIQUE NOT NULL,
  type            TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value           NUMERIC(12,2) NOT NULL,
  min_order       NUMERIC(12,0) DEFAULT 0,
  max_uses        INT,
  uses_count      INT DEFAULT 0,
  is_active       BOOLEAN DEFAULT true,
  expires_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- NEWSLETTER
CREATE TABLE newsletter_subscribers (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email      TEXT UNIQUE NOT NULL,
  is_active  BOOLEAN DEFAULT true,
  source     TEXT DEFAULT 'website',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
