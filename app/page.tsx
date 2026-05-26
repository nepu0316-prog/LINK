import { createServerSupabaseClient } from '@/lib/supabase-server'
import { BannerCarousel } from '@/components/homepage/BannerCarousel'
import { ProfileHero } from '@/components/homepage/ProfileHero'
import { ProductCard } from '@/components/homepage/ProductCard'
import { VideosSection } from '@/components/homepage/VideosSection'
import { LinkButton } from '@/components/homepage/LinkButton'
import { EmailSubscribe } from '@/components/homepage/EmailSubscribe'
import { ClickTracker } from '@/components/homepage/ClickTracker'
import type { Profile, Product, Video, Link, Banner } from '@/lib/types'

async function getData() {
  const supabase = await createServerSupabaseClient()

  const [profileRes, bannersRes, productsRes, videosRes, linksRes] = await Promise.all([
    supabase.from('profiles').select('*').limit(1).single(),
    supabase.from('banners').select('*').eq('is_published', true).order('sort_order').limit(8),
    supabase.from('products').select('*').eq('is_published', true).order('is_pinned', { ascending: false }).order('sort_order').limit(12),
    supabase.from('videos').select('*').eq('is_published', true).order('is_pinned', { ascending: false }).order('sort_order').limit(12),
    supabase.from('links').select('*').eq('is_published', true).order('is_pinned', { ascending: false }).order('sort_order').limit(20),
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
    bio: '分享親子生活 × 溫暖插畫 × 精選好物 ',
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

  return (
    <div className="min-h-screen bg-gray-50" style={{ backgroundSize: '24px 24px' }}>
      {/* Warm background gradient */}
      <div className="fixed inset-0 bg-gray-50 opacity-80 pointer-events-none" />
      
      {/* 浮動 Banner */}
      {banners.length > 0 && banners[0].image_url && (
        <div className="flex justify-center relative z-10">
          {banners[0].link_url ? (
            <a href={banners[0].link_url} target="_blank" rel="noopener noreferrer">
              <img src={banners[0].image_url} alt={banners[0].title || 'Banner'} className="w-1/3 object-cover h-screen opacity-100 relative z-10" />
            </a>
          ) : (
            <img src={banners[0].image_url} alt={banners[0].title || 'Banner'} className="w-1/3 object-cover h-screen opacity-100 relative z-10" />
          )}
        </div>
      )}

      <div className="relative z-10 max-w-lg mx-auto px-4 pb-16">
        {/* Profile Hero */}
        <ProfileHero profile={activeProfile} />

        {/* Banner Carousel */}
        {banners.length > 0 && (
          <div className="mt-4">
            <BannerCarousel banners={banners} />
          </div>
        )}

        {/* Group Buy Products */}
        {products.length > 0 && (() => {
          const now = new Date()
          const upcoming = products.filter(p => (p as any).start_date && new Date((p as any).start_date) > now)
          const active = products.filter(p => {
            const started = !(p as any).start_date || new Date((p as any).start_date) <= now
            const notExpired = !p.deadline || new Date(p.deadline) > now
            return started && notExpired && p.is_published
          })
          const expired = products.filter(p => p.deadline && new Date(p.deadline) <= now)
          return (
            <div className="space-y-6 mt-8">
              {upcoming.length > 0 && (
                <section>
                  <h2 className="section-title mb-3">即將開團</h2>
                  <div className="space-y-2">
                    {upcoming.map(p => {
                      const d = new Date((p as any).start_date)
                      const diff = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                      return (
                        <div key={p.id} className="flex items-center justify-between bg-white dark:bg-warm-800 rounded-xl px-4 py-3 shadow-soft">
                          <p className="font-medium text-sm text-warm-800 dark:text-cream-100">{p.title}</p>
                          <span className="badge bg-sage-100 text-sage-600 text-xs whitespace-nowrap">還有 {diff} 天</span>
                        </div>
                      )
                    })}
                  </div>
                </section>
              )}
              {active.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="section-title">現正開團</h2>
                    <span className="text-xs text-warm-400">{active.length} 個商品</span>
                  </div>
                  <div className="grid grid-cols-2 items-stretch gap-3">
                    {active.map((product, i) => (
                      <ClickTracker key={product.id} itemType="product" itemId={product.id}>
                        <ProductCard product={product} index={i} />
                      </ClickTracker>
                    ))}
                  </div>
                </section>
              )}
              {expired.length > 0 && (
                <section>
                  <h2 className="section-title mb-3">已結團</h2>
                  <div className="grid grid-cols-2 items-stretch gap-3 opacity-70">
                    {expired.map((product, i) => (
                      <ClickTracker key={product.id} itemType="product" itemId={product.id}>
                        <ProductCard product={product} index={i} />
                      </ClickTracker>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )
        })()}

        {/* Featured Videos */}
        {videos.length > 0 && (
          <section className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">跟著嘟力玩</h2>
            </div>
              <VideosSection videos={videos} />
          </section>
        )}

        {/* Links */}
        {links.length > 0 && (
          <section className="mt-8">
            <h2 className="section-title mb-4">
              <span className="text-xl">🔗</span>
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

        {/* Email Subscribe */}
        <div className="mt-8">
          
        </div>

        {/* 官網 & LINE 按鈕 */}
        <section className="mt-8 pb-4 space-y-3">
          <a href="https://duliduli-website.com" target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-warm-700 hover:bg-warm-800 text-white font-bold text-base transition-all shadow-soft">
            🌐 嘟力日記官網
          </a>
          <a href="http://surl.li/xvljif" target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-base transition-all shadow-soft">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.070 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>
            加入 LINE 社群
          </a>
          <p className="text-center text-xs text-warm-400">LINE 驗證密碼：0222</p>
        </section>
        {/* Footer */}
        <footer className="mt-10 text-center text-xs text-warm-300 dark:text-warm-600">
          <p>© {new Date().getFullYear()} {activeProfile.name}</p>
          <p className="mt-1 opacity-60">Made with 💛 for family moments</p>
        </footer>
      </div>
    </div>
  )
}
