-- Fix homepage_settings policies and shared admin RLS policies

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('admin', 'staff')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

ALTER TABLE IF EXISTS brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS drops ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS homepage_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "brands_admin_all" ON brands;
CREATE POLICY "brands_admin_all" ON brands
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "categories_admin_all" ON categories;
CREATE POLICY "categories_admin_all" ON categories
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "drops_admin_all" ON drops;
CREATE POLICY "drops_admin_all" ON drops
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "orders_admin_all" ON orders;
CREATE POLICY "orders_admin_all" ON orders
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "reviews_admin" ON reviews;
CREATE POLICY "reviews_admin" ON reviews
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "homepage_settings_admin_all" ON homepage_settings;
CREATE POLICY "homepage_settings_admin_all" ON homepage_settings
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "homepage_settings_public_read" ON homepage_settings;
CREATE POLICY "homepage_settings_public_read" ON homepage_settings
  FOR SELECT USING (true);

INSERT INTO homepage_settings (
  hero_series_label,
  hero_title,
  hero_description,
  hero_primary_cta_label,
  hero_primary_cta_link,
  hero_secondary_cta_label,
  hero_secondary_cta_link,
  categories_section_label,
  categories_section_title,
  brands_section_label,
  brands_section_title
)
SELECT
  '— Colección 2026',
  'CULTURA\nURBANA\nPREMIUM',
  'Sneakers, streetwear y accesorios auténticos. Drops limitados, cultura sin límites.',
  'Explorar Drops',
  '/drops',
  'Ver tienda',
  '/tienda',
  '— Categorías',
  'Explora por categoría',
  '— Marcas',
  'Marcas exclusivas'
WHERE NOT EXISTS (SELECT 1 FROM homepage_settings);
