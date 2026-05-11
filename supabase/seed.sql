-- ============================================
-- SEED DATA: Magnus Store

-- BRANDS
INSERT INTO brands (id, name, slug, is_featured, sort_order)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Supreme', 'supreme', true, 1),
  ('a0000000-0000-0000-0000-000000000002', 'Palace', 'palace', true, 2),
  ('a0000000-0000-0000-0000-000000000003', 'Stüssy', 'stussy', true, 3),
  ('a0000000-0000-0000-0000-000000000004', 'Off-White', 'off-white', true, 4),
  ('a0000000-0000-0000-0000-000000000005', 'Carhartt WIP', 'carhartt-wip', true, 5)
ON CONFLICT (id) DO NOTHING;

-- CATEGORIES
INSERT INTO categories (id, name, slug, sort_order)
VALUES
  ('b0000000-0000-0000-0000-000000000001', 'Sneakers', 'sneakers', 1),
  ('b0000000-0000-0000-0000-000000000002', 'Hoodies', 'hoodies', 2),
  ('b0000000-0000-0000-0000-000000000003', 'Camisetas', 'camisetas', 3),
  ('b0000000-0000-0000-0000-000000000004', 'Accesorios', 'accesorios', 4),
  ('b0000000-0000-0000-0000-000000000005', 'Chaquetas', 'chaquetas', 5),
  ('b0000000-0000-0000-0000-000000000006', 'Pantalones', 'pantalones', 6)
ON CONFLICT (id) DO NOTHING;

-- HOMEPAGE SETTINGS
INSERT INTO homepage_settings (
  id,
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
  'd0000000-0000-0000-0000-000000000001',
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
)
ON CONFLICT (id) DO NOTHING;

-- PRODUCTS
INSERT INTO products (id, name, slug, description, brand_id, category_id, base_price, compare_price, images, tags, is_featured, is_drop)
VALUES
  ('c0000000-0000-0000-0000-000000000001', 'Box Logo Hoodie', 'box-logo-hoodie', 'Classic Supreme Box Logo hoodie in heavyweight cotton.', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 450000, 550000, '["/images/products/supreme-box-logo-1.jpg", "/images/products/supreme-box-logo-2.jpg"]', '{"hoodie", "box-logo", "classic"}', true, false),
  ('c0000000-0000-0000-0000-000000000002', 'Palace Tri-Ferg Tee', 'palace-tri-ferg-tee', 'Iconic Palace Tri-Ferg t-shirt. 100% cotton.', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000003', 180000, null, '["/images/products/palace-triferg-1.jpg"]', '{"tee", "tri-ferg", "iconic"}', true, false),
  ('c0000000-0000-0000-0000-000000000003', 'Stüssy Stock Cap', 'stussy-stock-cap', 'Classic Stüssy Stock cap in premium cotton twill.', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000004', 95000, 120000, '["/images/products/stussy-cap-1.jpg"]', '{"cap", "accessory", "classic"}', false, false),
  ('c0000000-0000-0000-0000-000000000004', 'Off-White Arrow Hoodie', 'off-white-arrow-hoodie', 'Off-White c/o Virgil Abloh Arrow hoodie in signature construction.', 'a0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000002', 680000, 850000, '["/images/products/ow-arrow-1.jpg", "/images/products/ow-arrow-2.jpg"]', '{"hoodie", "arrow", "designer"}', true, false),
  ('c0000000-0000-0000-0000-000000000005', 'Carhartt WIP Chase Sweat', 'carhartt-wip-chase-sweat', 'Carhartt WIP Chase sweatshirt. Relaxed fit, heavy fleece.', 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000002', 280000, null, '["/images/products/carhartt-chase-1.jpg"]', '{"sweat", "fleece", "classic"}', true, false)
ON CONFLICT (id) DO NOTHING;

-- PRODUCT VARIANTS
INSERT INTO product_variants (product_id, sku, size, color, color_hex, stock, price)
VALUES
  ('c0000000-0000-0000-0000-000000000001', 'SBM-BLK-M', 'M', 'Black', '#000000', 10, null),
  ('c0000000-0000-0000-0000-000000000001', 'SBM-BLK-L', 'L', 'Black', '#000000', 15, null),
  ('c0000000-0000-0000-0000-000000000001', 'SBM-BLK-XL', 'XL', 'Black', '#000000', 5, null),
  ('c0000000-0000-0000-0000-000000000001', 'SBM-RED-M', 'M', 'Red', '#ff0000', 8, 480000),
  ('c0000000-0000-0000-0000-000000000002', 'PTF-WHT-M', 'M', 'White', '#ffffff', 20, null),
  ('c0000000-0000-0000-0000-000000000002', 'PTF-WHT-L', 'L', 'White', '#ffffff', 25, null),
  ('c0000000-0000-0000-0000-000000000003', 'SSC-BLK-O', 'O/S', 'Black', '#000000', 30, null),
  ('c0000000-0000-0000-0000-000000000003', 'SSC-RED-O', 'O/S', 'Red', '#ff0000', 15, null),
  ('c0000000-0000-0000-0000-000000000004', 'OWA-BLK-M', 'M', 'Black', '#000000', 3, null),
  ('c0000000-0000-0000-0000-000000000004', 'OWA-BLK-L', 'L', 'Black', '#000000', 7, null),
  ('c0000000-0000-0000-0000-000000000005', 'CWC-BLK-M', 'M', 'Black', '#000000', 12, null),
  ('c0000000-0000-0000-0000-000000000005', 'CWC-BLK-L', 'L', 'Black', '#000000', 8, null)
ON CONFLICT (id) DO NOTHING;

-- COUPONS
INSERT INTO coupons (code, type, value, min_order, max_uses)
VALUES
  ('MNS10', 'percentage', 10, 100000, 100),
  ('FIRST15', 'percentage', 15, 50000, 50)
ON CONFLICT (code) DO NOTHING;

-- ADMIN USER (reemplazar con un usuario real de auth.users)
-- INSERT INTO profiles (id, email, full_name, role)
-- VALUES ('REPLACE-WITH-REAL-UUID', 'admin@magnusstore.co', 'Admin Magnus', 'admin');
