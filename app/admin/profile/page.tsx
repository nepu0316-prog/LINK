'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Loader2, User } from 'lucide-react'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { Toggle } from '@/components/ui/Toggle'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'
import type { Profile } from '@/lib/types'

const defaultProfile: Partial<Profile> = {
  name: '',
  bio: '',
  avatar_url: null,
  instagram_url: '',
  threads_url: '',
  youtube_url: '',
  line_url: '',
  brand_color: '#E8610A',
  dark_mode_enabled: true,
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Partial<Profile>>(defaultProfile)
  const [profileId, setProfileId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('profiles').select('*').limit(1).single()
      if (data) {
        setProfile(data)
        setProfileId(data.id)
      }
      setLoading(false)
    }
    load()
  }, [])

  async function handleSave() {
    if (!profile.name) { toast.error('名稱為必填'); return }
    setSaving(true)
    try {
      const payload = {
        name: profile.name,
        bio: profile.bio || null,
        avatar_url: profile.avatar_url || null,
        instagram_url: profile.instagram_url || null,
        threads_url: profile.threads_url || null,
        youtube_url: profile.youtube_url || null,
        line_url: profile.line_url || null,
        brand_color: profile.brand_color || '#E8610A',
        dark_mode_enabled: profile.dark_mode_enabled ?? true,
      }
      if (profileId) {
        const { error } = await supabase.from('profiles').update(payload).eq('id', profileId)
        if (error) throw error
      } else {
        const { data, error } = await supabase.from('profiles').insert(payload).select().single()
        if (error) throw error
        setProfileId(data.id)
      }
      toast.success('個人資料已儲存！')
    } catch { toast.error('儲存失敗') } finally { setSaving(false) }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-coral-400" />
    </div>
  )

  const f = (key: keyof Profile) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setProfile(p => ({ ...p, [key]: e.target.value }))

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-warm-800 dark:text-cream-100">個人設定</h1>
          <p className="text-sm text-warm-400 mt-0.5">管理你的公開頁面資訊</p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card-soft p-6 space-y-5">
        {/* Avatar */}
        <div>
          <label className="block text-xs font-medium text-warm-600 dark:text-warm-400 mb-1.5">個人頭像</label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-cream-100 dark:bg-warm-700 flex-shrink-0">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl">🌿</div>
              )}
            </div>
            <div className="flex-1">
              <ImageUpload value={profile.avatar_url || null} onChange={url => setProfile(p => ({ ...p, avatar_url: url }))} folder="avatars" />
            </div>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-xs font-medium text-warm-600 dark:text-warm-400 mb-1.5">名稱 *</label>
          <input value={profile.name || ''} onChange={f('name')} placeholder="你的名字" className="input-field" />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-xs font-medium text-warm-600 dark:text-warm-400 mb-1.5">自我介紹</label>
          <textarea value={profile.bio || ''} onChange={f('bio')} rows={3} placeholder="分享你的故事…" className="input-field resize-none" />
        </div>

        {/* Social */}
        <div>
          <p className="text-xs font-semibold text-warm-600 dark:text-warm-400 mb-3">社群連結</p>
          <div className="space-y-2.5">
            {[
              { key: 'instagram_url', label: 'Instagram', placeholder: 'https://instagram.com/...' },
              { key: 'threads_url', label: 'Threads', placeholder: 'https://threads.net/...' },
              { key: 'youtube_url', label: 'YouTube', placeholder: 'https://youtube.com/...' },
              { key: 'line_url', label: 'LINE 官方帳號', placeholder: 'https://line.me/...' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-xs text-warm-500 dark:text-warm-400 mb-1">{label}</label>
                <input
                  value={(profile as Record<string, unknown>)[key] as string || ''}
                  onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))}
                  placeholder={placeholder}
                  type="url"
                  className="input-field"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Brand color */}
        <div>
          <label className="block text-xs font-medium text-warm-600 dark:text-warm-400 mb-1.5">品牌主色</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={profile.brand_color || '#E8610A'}
              onChange={e => setProfile(p => ({ ...p, brand_color: e.target.value }))}
              className="w-12 h-10 rounded-xl border border-cream-300 cursor-pointer"
            />
            <input
              value={profile.brand_color || ''}
              onChange={e => setProfile(p => ({ ...p, brand_color: e.target.value }))}
              placeholder="#E8610A"
              className="input-field flex-1"
            />
            {/* Presets */}
            <div className="flex gap-1.5">
              {['#E8610A', '#7FB5A2', '#F4C5BB', '#D4B5A3', '#A8D5CA'].map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setProfile(p => ({ ...p, brand_color: c }))}
                  className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110"
                  style={{ background: c, borderColor: profile.brand_color === c ? c : 'transparent' }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Dark mode */}
        <div className="flex items-center justify-between py-2 border-t border-cream-200 dark:border-warm-700">
          <div>
            <p className="text-sm font-medium text-warm-700 dark:text-warm-200">深色模式切換</p>
            <p className="text-xs text-warm-400">讓訪客可以切換深色/淺色模式</p>
          </div>
          <Toggle checked={profile.dark_mode_enabled ?? true} onChange={v => setProfile(p => ({ ...p, dark_mode_enabled: v }))} />
        </div>

        <button onClick={handleSave} disabled={saving} className="w-full btn-primary py-3">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? '儲存中…' : '儲存設定'}
        </button>
      </motion.div>
    </div>
  )
}
