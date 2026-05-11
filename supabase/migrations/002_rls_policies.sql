ALTER TABLE profiles                ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses               ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items              ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items             ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists               ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE drop_subscribers        ENABLE ROW LEVEL SECURITY;

ALTER TABLE products                ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants        ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories              ENABLE ROW LEVEL SECURITY;
ALTER TABLE drops                   ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('admin', 'staff')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE POLICY "profiles_own" ON profiles
  FOR ALL USING (auth.uid() = id);
CREATE POLICY "profiles_admin" ON profiles
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "addresses_own" ON addresses
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "products_public_read" ON products
  FOR SELECT USING (is_active = true);
CREATE POLICY "products_admin_all" ON products
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "variants_public_read" ON product_variants
  FOR SELECT USING (is_active = true);
CREATE POLICY "variants_admin_all" ON product_variants
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "brands_public_read" ON brands FOR SELECT USING (true);
CREATE POLICY "brands_admin_all" ON brands FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "categories_public_read" ON categories FOR SELECT USING (true);
CREATE POLICY "categories_admin_all" ON categories FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "drops_public_read" ON drops
  FOR SELECT USING (is_published = true);
CREATE POLICY "drops_admin_all" ON drops FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "carts_own" ON carts
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "cart_items_own" ON cart_items
  FOR ALL USING (
    cart_id IN (SELECT id FROM carts WHERE user_id = auth.uid())
  );

CREATE POLICY "orders_own" ON orders
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "orders_admin_all" ON orders FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "order_items_own" ON order_items
  FOR SELECT USING (
    order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
  );

CREATE POLICY "wishlist_own" ON wishlists
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "reviews_public_read" ON reviews
  FOR SELECT USING (is_visible = true);
CREATE POLICY "reviews_own" ON reviews
  FOR INSERT USING (auth.uid() = user_id);
CREATE POLICY "reviews_admin" ON reviews FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "drop_subs_own" ON drop_subscribers
  FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);
