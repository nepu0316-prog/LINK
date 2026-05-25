import { createServerSupabaseClient } from '@/lib/supabase-server'
import { VideosClient } from './VideosClient'
import type { Video } from '@/lib/types'

export default async function VideosPage() {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('videos')
    .select('*')
    .order('sort_order')
    .order('created_at', { ascending: false })

  return <VideosClient initialVideos={(data || []) as Video[]} />
}
