import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/supabase-server'
import { ShoppingBag, Video, Link2, Users, TrendingUp, Eye, MousePointerClick } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

async function getStats() {
  const supabase = await createServerSupabaseClient()
  const [products, videos, links, subscribers] = await Promise.all([
    supabase.from('products').select('id, is_published', { count: 'exact' }),
    supabase.from('videos').select('id, is_published', { count: 'exact' }),
    supabase.from('links').select('id, is_published', { count: 'exact' }),
    supabase.from('email_subscribers').select('id', { count: 'exact' }),
  ])

  return {
    products: products.count || 0,
    publishedProducts: (products.data || []).filter(p => p.is_published).length,
    videos: videos.count || 0,
    publishedVideos: (videos.data || []).filter(v => v.is_published).length,
    links: links.count || 0,
    publishedLinks: (links.data || []).filter(l => l.is_published).length,
    subscribers: subscribers.count || 0,
  }
}

// 使用 service role 讀取 click_analytics（anon key 無 SELECT 權限）
async function getClickStats() {
  const supabase = await createAdminSupabaseClient()

  // 取全部點擊紀錄（item_id + item_type）
  const { data: clicks } = await supabase
    .from('click_analytics')
    .select('item_id, item_type')

  if (!clicks || clicks.length === 0) return { products: [], links: [], total: 0 }

  // 各分類統計 map
  const productMap: Record<string, number> = {}
  const linkMap: Record<string, number> = {}

  for (const row of clicks) {
    if (row.item_type === 'product') {
      productMap[row.item_id] = (productMap[row.item_id] || 0) + 1
    } else if (row.item_type === 'link') {
      linkMap[row.item_id] = (linkMap[row.item_id] || 0) + 1
    }
  }

  // 取商品資訊
  const productIds = Object.keys(productMap)
  const linkIds = Object.keys(linkMap)

  const [productsRes, linksRes] = await Promise.all([
    productIds.length > 0
      ? supabase.from('products').select('id, title, thumbnail_url').in('id', productIds)
      : { data: [] },
    linkIds.length > 0
      ? supabase.from('links').select('id, title').in('id', linkIds)
      : { data: [] },
  ])

  const productStats = (productsRes.data || [])
    .map(p => ({ ...p, clicks: productMap[p.id] || 0 }))
    .sort((a, b) => b.clicks - a.clicks)

  const linkStats = (linksRes.data || [])
    .map(l => ({ ...l, clicks: linkMap[l.id] || 0 }))
    .sort((a, b) => b.clicks - a.clicks)

  return {
    products: productStats,
    links: linkStats,
    total: clicks.length,
  }
}

const statCards = [
  { key: 'products', label: '團購商品', icon: ShoppingBag, color: 'bg-coral-100 dark:bg-coral-900/30 text-coral-500', href: '/admin/products' },
  { key: 'videos', label: '影音', icon: Video, color: 'bg-sage-100 dark:bg-sage-900/30 text-sage-500', href: '/admin/videos' },
  { key: 'links', label: '連結', icon: Link2, color: 'bg-cream-200 dark:bg-warm-700 text-warm-500', href: '/admin/links' },
  { key: 'subscribers', label: '電子報訂閱', icon: Users, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-500', href: '#' },
] as const

// 共用排行列表
function ClickRankList({
  items,
  maxClicks,
  emptyLabel,
}: {
  items: { id: string; title: string; clicks: number; thumbnail_url?: string | null }[]
  maxClicks: number
  emptyLabel: string
}) {
  if (items.length === 0) {
    return (
      <div className="text-center py-6">
        <MousePointerClick className="w-8 h-8 text-warm-200 mx-auto mb-2" />
        <p className="text-xs text-warm-400">{emptyLabel}</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={item.id} className="flex items-center gap-3">
          {/* 排名 */}
          <span
            className="flex-shrink-0 w-5 text-center text-xs font-bold tabular-nums"
            style={{ color: i === 0 ? '#E8610A' : i === 1 ? '#8A7050' : i === 2 ? '#9CA3AF' : '#C4B0A0' }}
          >
            {i + 1}
          </span>

          {/* 縮圖（商品才有） */}
          {'thumbnail_url' in item && (
            <div className="flex-shrink-0 w-8 h-8 rounded-lg overflow-hidden bg-cream-100 dark:bg-warm-700">
              {item.thumbnail_url ? (
                <Image src={item.thumbnail_url} alt={item.title} width={32} height={32} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm">🛍️</div>
              )}
            </div>
          )}

          {/* 名稱 + 進度條 */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-warm-700 dark:text-warm-200 truncate">{item.title}</p>
            <div className="mt-1 h-1.5 bg-cream-200 dark:bg-warm-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${maxClicks > 0 ? (item.clicks / maxClicks) * 100 : 0}%`,
                  background: i === 0 ? '#E8610A' : '#A8B888',
                }}
              />
            </div>
          </div>

          {/* 點擊數 */}
          <span className="flex-shrink-0 text-sm font-bold text-warm-700 dark:text-warm-200 tabular-nums">
            {item.clicks.toLocaleString()}
          </span>
          <span className="flex-shrink-0 text-xs text-warm-400">次</span>
        </div>
      ))}
    </div>
  )
}

export default async function AdminDashboard() {
  const [stats, clickStats] = await Promise.all([getStats(), getClickStats()])
  const maxProductClicks = clickStats.products[0]?.clicks || 1
  const maxLinkClicks = clickStats.links[0]?.clicks || 1

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
          <Link key={key} href={href} className="card-soft p-4 hover:shadow-hover transition-all group">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-warm-800 dark:text-cream-100">{stats[key]}</p>
            <p className="text-xs text-warm-400 mt-0.5">{label}</p>
          </Link>
        ))}
      </div>

      {/* ── 點擊統計（商品 + 連結並排） ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 商品點擊排行 */}
        <div className="card-soft p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-warm-700 dark:text-warm-200">商品點擊排行</h2>
                <p className="text-xs text-warm-400">
                  共 {clickStats.products.reduce((s, p) => s + p.clicks, 0).toLocaleString()} 次
                </p>
              </div>
            </div>
            <Link href="/admin/products" className="text-xs text-warm-400 hover:text-warm-600 transition-colors">
              管理 →
            </Link>
          </div>
          <ClickRankList
            items={clickStats.products}
            maxClicks={maxProductClicks}
            emptyLabel="尚無商品點擊紀錄"
          />
        </div>

        {/* 連結點擊排行 */}
        <div className="card-soft p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-sage-100 dark:bg-sage-900/30 flex items-center justify-center">
                <Link2 className="w-4 h-4 text-sage-500" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-warm-700 dark:text-warm-200">連結點擊排行</h2>
                <p className="text-xs text-warm-400">
                  共 {clickStats.links.reduce((s, l) => s + l.clicks, 0).toLocaleString()} 次
                </p>
              </div>
            </div>
            <Link href="/admin/links" className="text-xs text-warm-400 hover:text-warm-600 transition-colors">
              管理 →
            </Link>
          </div>
          <ClickRankList
            items={clickStats.links}
            maxClicks={maxLinkClicks}
            emptyLabel="尚無連結點擊紀錄"
          />
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
