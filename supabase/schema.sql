-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- Profiles (creator info, singleton table)
-- ==========================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL DEFAULT '親子小日子',
  bio text DEFAULT '分享親子生活 × 溫暖插畫 × 精選好物 🌿',
  avatar_url text,
  instagram_url text,
  threads_url text,
  youtube_url text,
  line_url text,
  brand_color text NOT NULL DEFAULT '#E8610A',
  dark_mode_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ==========================================
-- Categories
-- ==========================================
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  color text DEFAULT '#E8610A',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ==========================================
-- Links (Linktree-style buttons)
-- ==========================================
CREATE TABLE IF NOT EXISTS links (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  url text NOT NULL,
  thumbnail_url text,
  button_text text NOT NULL DEFAULT '前往',
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  is_pinned boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  click_count integer NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ==========================================
-- Products (Group Buy)
-- ==========================================
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  thumbnail_url text,
  url text NOT NULL,
  button_text text NOT NULL DEFAULT '前往團購',
  price text,
  original_price text,
  start_date timestamptz,
  end_date timestamptz,
  deadline timestamptz,
  is_pinned boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  click_count integer NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  tags text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ==========================================
-- Videos
-- ==========================================
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  thumbnail_url text,
  video_url text NOT NULL,
  platform text NOT NULL DEFAULT 'youtube' CHECK (platform IN ('youtube', 'instagram', 'tiktok')),
  is_pinned boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  click_count integer NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ==========================================
-- Banners (Carousel)
-- ==========================================
CREATE TABLE IF NOT EXISTS banners (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text,
  description text,
  image_url text NOT NULL,
  link_url text,
  button_text text,
  is_published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ==========================================
-- Email Subscribers
-- ==========================================
CREATE TABLE IF NOT EXISTS email_subscribers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text NOT NULL UNIQUE,
  name text,
  subscribed_at timestamptz NOT NULL DEFAULT now()
);

-- ==========================================
-- Click Analytics
-- ==========================================
CREATE TABLE IF NOT EXISTS click_analytics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_type text NOT NULL CHECK (item_type IN ('link', 'product', 'video')),
  item_id uuid NOT NULL,
  clicked_at timestamptz NOT NULL DEFAULT now(),
  user_agent text,
  referrer text
);

-- ==========================================
-- Indexes
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_links_published ON links(is_published, sort_order);
CREATE INDEX IF NOT EXISTS idx_links_pinned ON links(is_pinned) WHERE is_pinned = true;
CREATE INDEX IF NOT EXISTS idx_products_published ON products(is_published, sort_order);
CREATE INDEX IF NOT EXISTS idx_products_deadline ON products(deadline) WHERE deadline IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_videos_published ON videos(is_published, sort_order);
CREATE INDEX IF NOT EXISTS idx_banners_published ON banners(is_published, sort_order);
CREATE INDEX IF NOT EXISTS idx_analytics_item ON click_analytics(item_type, item_id);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON click_analytics(clicked_at);

-- ==========================================
-- Update trigger for updated_at
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_links
  BEFORE UPDATE ON links FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_products
  BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_videos
  BEFORE UPDATE ON videos FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_banners
  BEFORE UPDATE ON banners FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ==========================================
-- Row Level Security
-- ==========================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE click_analytics ENABLE ROW LEVEL SECURITY;

-- Public read policies (frontend)
CREATE POLICY "Public read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public read published links" ON links FOR SELECT USING (is_published = true);
CREATE POLICY "Public read published products" ON products FOR SELECT USING (is_published = true);
CREATE POLICY "Public read published videos" ON videos FOR SELECT USING (is_published = true);
CREATE POLICY "Public read published banners" ON banners FOR SELECT USING (is_published = true);
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);

-- Insert analytics (public can log clicks)
CREATE POLICY "Public insert analytics" ON click_analytics FOR INSERT WITH CHECK (true);

-- Insert subscribers (public can subscribe)
CREATE POLICY "Public insert subscribers" ON email_subscribers FOR INSERT WITH CHECK (true);

-- Admin full access via service role (bypasses RLS)

-- ==========================================
-- Click count increment function
-- ==========================================
CREATE OR REPLACE FUNCTION increment_click_count(p_type text, p_id uuid)
RETURNS void AS $$
BEGIN
  IF p_type = 'link' THEN
    UPDATE links SET click_count = click_count + 1 WHERE id = p_id;
  ELSIF p_type = 'product' THEN
    UPDATE products SET click_count = click_count + 1 WHERE id = p_id;
  ELSIF p_type = 'video' THEN
    UPDATE videos SET click_count = click_count + 1 WHERE id = p_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION increment_click_count TO anon, authenticated;

-- ==========================================
-- Seed: Default profile
-- ==========================================
INSERT INTO profiles (name, bio, brand_color)
VALUES ('親子小日子', '分享親子生活 × 溫暖插畫 × 精選好物 🌿', '#E8610A')
ON CONFLICT DO NOTHING;

-- Seed: Default categories
INSERT INTO categories (name, slug, color) VALUES
  ('親子共玩', 'play', '#7FB5A2'),
  ('團購好物', 'groupbuy', '#E8610A'),
  ('影音短片', 'video', '#F4C5BB'),
  ('品牌合作', 'collab', '#D4EAE4'),
  ('插畫作品', 'illustration', '#EDD5B8')
ON CONFLICT (slug) DO NOTHING;

-- ==========================================
-- Storage bucket (run in Supabase dashboard)
-- ==========================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);
-- CREATE POLICY "Public read media" ON storage.objects FOR SELECT USING (bucket_id = 'media');
-- CREATE POLICY "Authenticated upload media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media');
