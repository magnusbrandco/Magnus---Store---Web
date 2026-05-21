-- Add editable product detail fields for product pages
ALTER TABLE products
  ADD COLUMN details TEXT,
  ADD COLUMN shipping_returns TEXT;

CREATE OR REPLACE FUNCTION update_product_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('spanish',
    COALESCE(NEW.name, '') || ' ' ||
    COALESCE(NEW.description, '') || ' ' ||
    COALESCE(NEW.details, '') || ' ' ||
    COALESCE(NEW.shipping_returns, '') || ' ' ||
    COALESCE(array_to_string(NEW.tags, ' '), '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
