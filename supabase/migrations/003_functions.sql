CREATE OR REPLACE FUNCTION get_cart_totals(p_user_id UUID)
RETURNS TABLE (
  item_count INT,
  subtotal   NUMERIC,
  total      NUMERIC
) AS $$
  SELECT
    COALESCE(SUM(ci.quantity), 0)::INT as item_count,
    COALESCE(SUM(ci.quantity * ci.price), 0) as subtotal,
    COALESCE(SUM(ci.quantity * ci.price), 0) as total
  FROM carts c
  JOIN cart_items ci ON ci.cart_id = c.id
  WHERE c.user_id = p_user_id;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION validate_coupon(
  p_code TEXT,
  p_order_total NUMERIC
)
RETURNS JSONB AS $$
DECLARE
  v_coupon coupons%ROWTYPE;
  v_discount NUMERIC;
BEGIN
  SELECT * INTO v_coupon FROM coupons
  WHERE code = upper(p_code) AND is_active = true
    AND (expires_at IS NULL OR expires_at > NOW())
    AND (max_uses IS NULL OR uses_count < max_uses);

  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Cupón inválido o expirado');
  END IF;

  IF p_order_total < v_coupon.min_order THEN
    RETURN jsonb_build_object('valid', false, 'error',
      format('Mínimo de compra: $%s', v_coupon.min_order::INT));
  END IF;

  IF v_coupon.type = 'percentage' THEN
    v_discount := ROUND(p_order_total * v_coupon.value / 100);
  ELSE
    v_discount := LEAST(v_coupon.value, p_order_total);
  END IF;

  RETURN jsonb_build_object(
    'valid', true,
    'coupon_id', v_coupon.id,
    'type', v_coupon.type,
    'value', v_coupon.value,
    'discount', v_discount
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS JSONB AS $$
DECLARE
  v_stats JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_revenue', (SELECT COALESCE(SUM(total), 0) FROM orders WHERE payment_status = 'approved'),
    'orders_today',  (SELECT COUNT(*) FROM orders WHERE created_at > CURRENT_DATE),
    'new_customers', (SELECT COUNT(*) FROM profiles WHERE created_at > NOW() - INTERVAL '30 days'),
    'pending_orders',(SELECT COUNT(*) FROM orders WHERE status = 'processing'),
    'revenue_today', (SELECT COALESCE(SUM(total), 0) FROM orders
                      WHERE payment_status = 'approved' AND created_at > CURRENT_DATE),
    'top_products',  (
      SELECT jsonb_agg(t) FROM (
        SELECT p.name, SUM(oi.quantity) as units, SUM(oi.total_price) as revenue
        FROM order_items oi
        JOIN products p ON p.id = oi.product_id
        JOIN orders o ON o.id = oi.order_id
        WHERE o.payment_status = 'approved' AND o.created_at > NOW() - INTERVAL '30 days'
        GROUP BY p.id, p.name
        ORDER BY revenue DESC LIMIT 5
      ) t
    )
  ) INTO v_stats;
  RETURN v_stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at    BEFORE UPDATE ON products    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_orders_updated_at      BEFORE UPDATE ON orders      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_profiles_updated_at    BEFORE UPDATE ON profiles    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_carts_updated_at       BEFORE UPDATE ON carts       FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
