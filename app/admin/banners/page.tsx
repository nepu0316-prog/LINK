import { createServerSupabaseClient } from '@/lib/supabase-server'
import { BannersClient } from './BannersClient'
import type { Banner } from '@/lib/types'

export default async function BannersPage() {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('banners')
    .select('*')
    .order('sort_order')
    .order('created_at', { ascending: false })

  return <BannersClient initialBanners={(data || []) as Banner[]} />
}
