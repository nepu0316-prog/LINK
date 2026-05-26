export type Category = {
  id: string
  name: string
  slug: string
  color: string | null
  created_at: string
}

export type Profile = {
  id: string
  name: string
  bio: string | null
  avatar_url: string | null
  instagram_url: string | null
  threads_url: string | null
  youtube_url: string | null
  line_url: string | null
  brand_color: string
  dark_mode_enabled: boolean
  created_at: string
  updated_at: string
}

export type Link = {
  id: string
  title: string
  description: string | null
  url: string
  thumbnail_url: string | null
  button_text: string
  category_id: string | null
  is_pinned: boolean
  is_published: boolean
  click_count: number
  sort_order: number
  created_at: string
  updated_at: string
}

export type Product = {
  id: string
  title: string
  description: string | null
  thumbnail_url: string | null
  url: string
  button_text: string
  price: string | null
  original_price: string | null
  start_date: string | null
  start_date: string | null
  deadline: string | null
  is_pinned: boolean
  is_published: boolean
  click_count: number
  sort_order: number
  tags: string[] | null
  created_at: string
  updated_at: string
}

export type Video = {
  id: string
  title: string
  description: string | null
  thumbnail_url: string | null
  video_url: string
  platform: 'youtube' | 'instagram' | 'tiktok'
  is_pinned: boolean
  is_published: boolean
  click_count: number
  sort_order: number
  category?: string
  created_at: string
  updated_at: string
}

export type Banner = {
  id: string
  title: string | null
  description: string | null
  image_url: string
  link_url: string | null
  button_text: string | null
  is_published: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export type EmailSubscriber = {
  id: string
  email: string
  name: string | null
  subscribed_at: string
}

export type Stats = {
  total_links: number
  total_products: number
  total_videos: number
  total_subscribers: number
  total_clicks: number
  published_products: number
}
