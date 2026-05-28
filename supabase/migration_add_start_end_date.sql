-- Migration: Add start_date and end_date to products
-- Run this if you already executed schema.sql before this update

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS start_date timestamptz,
  ADD COLUMN IF NOT EXISTS end_date timestamptz;

-- Index for upcoming products query
CREATE INDEX IF NOT EXISTS idx_products_start_date ON products(start_date) WHERE start_date IS NOT NULL;

-- Comment
COMMENT ON COLUMN products.start_date IS '開團開始日期（用於即將開團判斷）';
COMMENT ON COLUMN products.end_date   IS '開團結束日期（同 deadline，二擇一使用）';
