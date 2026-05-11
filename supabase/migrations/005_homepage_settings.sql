-- HOMEPAGE SETTINGS
CREATE TABLE homepage_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hero_series_label TEXT NOT NULL DEFAULT '— Colección 2026',
  hero_title TEXT NOT NULL DEFAULT 'CULTURA\nURBANA\nPREMIUM',
  hero_description TEXT NOT NULL DEFAULT 'Sneakers, streetwear y accesorios auténticos. Drops limitados, cultura sin límites.',
  hero_primary_cta_label TEXT NOT NULL DEFAULT 'Explorar Drops',
  hero_primary_cta_link TEXT NOT NULL DEFAULT '/drops',
  hero_secondary_cta_label TEXT NOT NULL DEFAULT 'Ver tienda',
  hero_secondary_cta_link TEXT NOT NULL DEFAULT '/tienda',
  categories_section_label TEXT NOT NULL DEFAULT '— Categorías',
  categories_section_title TEXT NOT NULL DEFAULT 'Explora por categoría',
  brands_section_label TEXT NOT NULL DEFAULT '— Marcas',
  brands_section_title TEXT NOT NULL DEFAULT 'Marcas exclusivas',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE homepage_settings ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('admin', 'staff')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE POLICY "homepage_settings_public_read" ON homepage_settings FOR SELECT USING (true);
CREATE POLICY "homepage_settings_admin_all" ON homepage_settings FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

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
) VALUES (
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
);
