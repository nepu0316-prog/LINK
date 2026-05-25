import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: '請輸入有效的電子郵件' }, { status: 400 })
    }

    const { error } = await supabase.from('email_subscribers').insert({
      email: email.toLowerCase().trim(),
      name: name?.trim() || null,
    })

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: '此電子郵件已訂閱' }, { status: 409 })
      }
      throw error
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: '訂閱失敗，請再試一次' }, { status: 500 })
  }
}
