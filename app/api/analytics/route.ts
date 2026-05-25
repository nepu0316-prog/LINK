import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  try {
    const { item_type, item_id, referrer, user_agent } = await req.json()

    if (!item_type || !item_id) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    await Promise.all([
      supabase.from('click_analytics').insert({
        item_type,
        item_id,
        referrer: referrer || null,
        user_agent: user_agent?.slice(0, 256) || null,
      }),
      supabase.rpc('increment_click_count', { p_type: item_type, p_id: item_id }),
    ])

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

