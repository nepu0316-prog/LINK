import { createServerSupabaseClient } from '@/lib/supabase-server'
import { ProductsClient } from './ProductsClient'
import type { Product } from '@/lib/types'

export default async function ProductsPage() {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('products')
    .select('*')
    .order('sort_order')
    .order('created_at', { ascending: false })

  return <ProductsClient initialProducts={(data || []) as Product[]} />
}
