import { createServerSupabaseClient } from '@/lib/supabase-server'
import { LinksClient } from './LinksClient'
import type { Link } from '@/lib/types'

export default async function LinksPage() {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('links')
    .select('*')
    .order('sort_order')
    .order('created_at', { ascending: false })

  return <LinksClient initialLinks={(data || []) as Link[]} />
}
