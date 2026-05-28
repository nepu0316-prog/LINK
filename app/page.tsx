import { createServerSupabaseClient } from '@/lib/supabase-server'
import { ProfileHero } from '@/components/homepage/ProfileHero'
import { ProductCard } from '@/components/homepage/ProductCard'
import { UpcomingProductCard } from '@/components/homepage/UpcomingProductCard'
import { VideosSection } from '@/components/homepage/VideosSection'
import { LinkButton } from '@/components/homepage/LinkButton'
import { IGFollowCTA } from '@/components/homepage/IGFollowCTA'
import { ClickTracker } from '@/components/homepage/ClickTracker'
import type { Profile, Product, Video, Link, Banner } from '@/lib/types'

async function getData() {
  const supabase = await createServerSupabaseClient()

  const [profileRes, bannersRes, productsRes, videosRes, linksRes] = await Promise.all([
    supabase.from('profiles').select('*').limit(1).single(),
    supabase.from('banners').select('*').eq('is_published', true).order('sort_order').limit(8),
    supabase.from('products').select('*').eq('is_published', true)
      .order('is_pinned', { ascending: false })
      .order('sort_order')
      .limit(20),
    supabase.from('videos').select('*').eq('is_published', true)
      .order('is_pinned', { ascending: false })
      .order('sort_order')
      .limit(12),
    supabase.from('links').select('*').eq('is_published', true)
      .order('is_pinned', { ascending: false })
      .order('sort_order')
      .limit(20),
  ])

  return {
    profile: profileRes.data as Profile | null,
    banners: (bannersRes.data || []) as Banner[],
    products: (productsRes.data || []) as Product[],
    videos: (videosRes.data || []) as Video[],
    links: (linksRes.data || []) as Link[],
  }
}

export default async function HomePage() {
  const { profile, banners, products, videos, links } = await getData()

  const defaultProfile: Profile = {
    id: '',
    name: '嘟力日記',
    bio: '分享親子生活 × 溫暖插畫 × 精選好物',
    avatar_url: null,
    instagram_url: null,
    threads_url: null,
    youtube_url: null,
    line_url: null,
    brand_color: '#E8610A',
    dark_mode_enabled: true,
    created_at: '',
    updated_at: '',
  }

  const activeProfile = profile || defaultProfile

  // Banner：第一張作封面，其餘忽略（只顯示一次）
  const coverBanner = banners.length > 0 ? banners[0] : null

  // 分類商品
  const now = new Date()
  const activeProducts = products.filter(p => {
    const started = !(p as { start_date?: string | null }).start_date ||
      new Date((p as { start_date?: string | null }).start_date!) <= now
    const notExpired = !p.deadline || new Date(p.deadline) > now
    return started && notExpired
  })
  const upcomingProducts = products.filter(p => {
    const startDate = (p as { start_date?: string | null }).start_date
    return startDate && new Date(startDate) > now
  })
  const expiredProducts = products.filter(p =>
    p.deadline && new Date(p.deadline) <= now
  )

  const igHandle = activeProfile.instagram_url
    ? activeProfile.instagram_url.replace(/.*instagram\.com\/@?/, '').replace(/\/$/, '')
    : undefined

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero：Banner 封面 + 頭像（無縫融合） ── */}
      <ProfileHero profile={activeProfile} coverBanner={coverBanner} />

      <div className="relative z-10 max-w-lg mx-auto px-4 pb-16">

        {/* ── 跟著嘟力玩 Reels ── */}
        {videos.length > 0 && (
          <section className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="section-title">跟著嘟力玩</h2>
            </div>
            <VideosSection videos={videos} />
          </section>
        )}

        {/* ── 現正開團 ── */}
        {activeProducts.length > 0 && (
          <section className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h2 className="section-title">開團好物</h2>
                <span className="badge bg-coral-400 text-white text-xs animate-pulse">現正開團中</span>
              </div>
              <span className="text-xs text-warm-400">{activeProducts.length} 個商品</span>
            </div>
            <div className="grid grid-cols-2 items-stretch gap-3">
              {activeProducts.map((product, i) => (
                <ClickTracker key={product.id} itemType="product" itemId={product.id}>
                  <ProductCard product={product} index={i} />
                </ClickTracker>
              ))}
            </div>
          </section>
        )}

        {/* ── 即將開團（附圖片，位於開團好物下方）── */}
        {upcomingProducts.length > 0 && (
          <section className="mt-8">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="section-title">即將開團</h2>
              <span className="badge bg-sage-200 text-sage-700 dark:bg-sage-800 dark:text-sage-200 text-xs">敬請期待</span>
            </div>
            <div className="grid grid-cols-2 items-stretch gap-3">
              {upcomingProducts.map((product, i) => (
                <UpcomingProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* ── 已結團（較低調） ── */}
        {expiredProducts.length > 0 && (
          <section className="mt-8">
            <h2 className="section-title mb-3 opacity-60">已結團</h2>
            <div className="grid grid-cols-2 items-stretch gap-3 opacity-60">
              {expiredProducts.map((product, i) => (
                <ClickTracker key={product.id} itemType="product" itemId={product.id}>
                  <ProductCard product={product} index={i} />
                </ClickTracker>
              ))}
            </div>
          </section>
        )}

        {/* ── 更多連結 ── */}
        {links.length > 0 && (
          <section className="mt-8">
            <h2 className="section-title mb-4">
              更多連結
            </h2>
            <div className="space-y-2.5">
              {links.map((link, i) => (
                <ClickTracker key={link.id} itemType="link" itemId={link.id}>
                  <LinkButton link={link} index={i} />
                </ClickTracker>
              ))}
            </div>
          </section>
        )}

        {/* ── 追蹤我的 IG ── */}
        {activeProfile.instagram_url && (
          <IGFollowCTA
            instagramUrl={activeProfile.instagram_url}
            handle={igHandle}
          />
        )}

        {/* ── 官網 & LINE ── */}
        <section className="mt-6 space-y-3">
          <a
            href="https://duliduli-website.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-4 rounded-xl
              border-2 border-warm-300 bg-transparent hover:bg-gray-100
              text-warm-800 font-bold text-base transition-all shadow-soft hover:shadow-hover"
          >
            🌐 嘟力日記官網
          </a>
          <a
            href="http://surl.li/xvljif"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-1 w-full py-4 rounded-xl
              border-2 border-warm-300 bg-transparent hover:bg-gray-100
              text-warm-800 font-bold text-base transition-all shadow-soft hover:shadow-hover"
          >
            <span className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-500">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.07 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
              </svg>
              加入 LINE 社群
            </span>
            <span className="text-xs font-normal text-warm-400">驗證密碼：0222</span>
          </a>
        </section>

        {/* ── Footer ── */}
        <footer className="mt-10 text-center text-xs text-warm-300 dark:text-warm-600">
          <p>© {new Date().getFullYear()} {activeProfile.name}</p>
          <p className="mt-1 opacity-60">Made with 🧡 Duli</p>
        </footer>
      </div>
    </div>
  )
}
