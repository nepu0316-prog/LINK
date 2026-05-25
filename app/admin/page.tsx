import { createServerSupabaseClient } from '@/lib/supabase-server'
import { ShoppingBag, Video, Link2, Image as ImageIcon, Users, TrendingUp, Eye } from 'lucide-react'
import Link from 'next/link'

async function getStats() {
  const supabase = await createServerSupabaseClient()
  const [products, videos, links, banners, subscribers, analytics] = await Promise.all([
    supabase.from('products').select('id, is_published', { count: 'exact' }),
    supabase.from('videos').select('id, is_published', { count: 'exact' }),
    supabase.from('links').select('id, is_published', { count: 'exact' }),
    supabase.from('banners').select('id', { count: 'exact' }),
    supabase.from('email_subscribers').select('id', { count: 'exact' }),
    supabase.from('click_analytics').select('id', { count: 'exact' }),
  ])

  return {
    products: products.count || 0,
    publishedProducts: (products.data || []).filter(p => p.is_published).length,
    videos: videos.count || 0,
    publishedVideos: (videos.data || []).filter(v => v.is_published).length,
    links: links.count || 0,
    publishedLinks: (links.data || []).filter(l => l.is_published).length,
    banners: banners.count || 0,
    subscribers: subscribers.count || 0,
    totalClicks: analytics.count || 0,
  }
}

async function getRecentActivity() {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('click_analytics')
    .select('*')
    .order('clicked_at', { ascending: false })
    .limit(5)
  return data || []
}

const statCards = [
  { key: 'products', label: '團購商品', icon: ShoppingBag, color: 'bg-coral-100 dark:bg-coral-900/30 text-coral-500', href: '/admin/products' },
  { key: 'videos', label: '影音', icon: Video, color: 'bg-sage-100 dark:bg-sage-900/30 text-sage-500', href: '/admin/videos' },
  { key: 'links', label: '連結', icon: Link2, color: 'bg-cream-200 dark:bg-warm-700 text-warm-500', href: '/admin/links' },
  { key: 'subscribers', label: '電子報訂閱', icon: Users, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-500', href: '#' },
] as const

export default async function AdminDashboard() {
  const stats = await getStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-warm-800 dark:text-cream-100">儀表板</h1>
          <p className="text-sm text-warm-400 mt-1">歡迎回來！這是你的內容總覽 🌿</p>
        </div>
        <Link href="/" target="_blank" className="btn-secondary text-xs gap-1.5 py-2">
          <Eye className="w-3.5 h-3.5" /> 預覽網站
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map(({ key, label, icon: Icon, color, href }) => (
          <Link
            key={key}
            href={href}
            className="card-soft p-4 hover:shadow-hover transition-all group"
          >
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-warm-800 dark:text-cream-100">
              {stats[key]}
            </p>
            <p className="text-xs text-warm-400 mt-0.5">{label}</p>
          </Link>
        ))}
      </div>

      {/* Total clicks */}
      <div className="card-soft p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-amber-500" />
        </div>
        <div>
          <p className="text-3xl font-bold text-warm-800 dark:text-cream-100">{stats.totalClicks.toLocaleString()}</p>
          <p className="text-sm text-warm-400">總點擊次數</p>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-sm font-semibold text-warm-600 dark:text-warm-300 mb-3">快速新增</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { href: '/admin/products', label: '新增團購', emoji: '🛍️', color: 'hover:border-coral-300' },
            { href: '/admin/videos', label: '新增影音', emoji: '🎬', color: 'hover:border-sage-300' },
            { href: '/admin/links', label: '新增連結', emoji: '🔗', color: 'hover:border-warm-300' },
            { href: '/admin/banners', label: '新增Banner', emoji: '🖼️', color: 'hover:border-purple-300' },
          ].map(({ href, label, emoji, color }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 p-3 rounded-2xl border-2 border-cream-200 dark:border-warm-600 ${color} bg-white dark:bg-warm-800 transition-all text-sm font-medium text-warm-700 dark:text-warm-200 hover:shadow-soft`}
            >
              <span className="text-xl">{emoji}</span>
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Published summary */}
      <div className="card-soft p-5">
        <h2 className="text-sm font-semibold text-warm-600 dark:text-warm-300 mb-4">已上架內容</h2>
        <div className="space-y-3">
          {[
            { label: '團購商品', published: stats.publishedProducts, total: stats.products, color: 'bg-coral-400' },
            { label: '影音', published: stats.publishedVideos, total: stats.videos, color: 'bg-sage-400' },
            { label: '連結', published: stats.publishedLinks, total: stats.links, color: 'bg-warm-400' },
          ].map(({ label, published, total, color }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="text-xs text-warm-500 dark:text-warm-400 w-16">{label}</span>
              <div className="flex-1 h-2 bg-cream-200 dark:bg-warm-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${color} rounded-full transition-all duration-700`}
                  style={{ width: total > 0 ? `${(published / total) * 100}%` : '0%' }}
                />
              </div>
              <span className="text-xs text-warm-400 w-12 text-right">{published}/{total}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
