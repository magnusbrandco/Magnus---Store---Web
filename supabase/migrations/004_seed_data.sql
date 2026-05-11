-- BRANDS
INSERT INTO brands (name, slug, is_featured, sort_order) VALUES
  ('Supreme', 'supreme', true, 1),
  ('Palace', 'palace', true, 2),
  ('Stüssy', 'stussy', true, 3),
  ('Off-White', 'off-white', true, 4),
  ('Carhartt WIP', 'carhartt-wip', true, 5);

-- CATEGORIES
INSERT INTO categories (name, slug, sort_order) VALUES
  ('Sneakers', 'sneakers', 1),
  ('Hoodies', 'hoodies', 2),
  ('Camisetas', 'camisetas', 3),
  ('Accesorios', 'accesorios', 4),
  ('Chaquetas', 'chaquetas', 5),
  ('Pantalones', 'pantalones', 6);

-- HOMEPAGE SETTINGS
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
VALUES (
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

-- COUPONS
INSERT INTO coupons (code, type, value, min_order, max_uses) VALUES
  ('MNS10', 'percentage', 10, 100000, 100),
  ('FIRST15', 'percentage', 15, 50000, 50);
