-- Add hero highlight color for homepage settings
ALTER TABLE homepage_settings
ADD COLUMN hero_highlight_color TEXT NOT NULL DEFAULT '#05C7F2';
