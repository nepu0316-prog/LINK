'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, Pin, Video as VideoIcon } from 'lucide-react'
import Image from 'next/image'
import { Modal } from '@/components/ui/Modal'
import { Toggle } from '@/components/ui/Toggle'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { createClient } from '@/lib/supabase'

import toast from 'react-hot-toast'
import type { Video } from '@/lib/types'

type Props = { initialVideos: Video[] }
type VideoFormData = Omit<Video, 'id' | 'click_count' | 'created_at' | 'updated_at'> & { category?: string }

const emptyForm: VideoFormData = {
  title: '',
  description: '',
  thumbnail_url: null,
  video_url: '',
  platform: 'instagram',
  is_pinned: false,
  is_published: true,
  sort_order: 0,
  category: '',

export function VideosClient({ initialVideos }: Props) {
  const [videos, setVideos] = useState(initialVideos)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<VideoFormData>(emptyForm)
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  async function fetchIGoembed(url: string) {
    try {
      const res = await fetch(`https://graph.facebook.com/v18.0/instagram_oembed?url=${encodeURIComponent(url)}&omitscript=true`)
      const data = await res.json()
      if (data.thumbnail_url) {
        setForm(f => ({ ...f, thumbnail_url: data.thumbnail_url, title: f.title || data.title || '' }))
      }
    } catch {}
  }

  async function fetchIGoembed(url: string) {
    try {
      const res = await fetch(`https://graph.facebook.com/v18.0/instagram_oembed?url=${encodeURIComponent(url)}&omitscript=true`)
      const data = await res.json()
      if (data.thumbnail_url) {
        setForm(f => ({ ...f, thumbnail_url: data.thumbnail_url, title: f.title || data.title || '' }))
      }
    } catch {}
  }

  async function fetchIGoembed(url: string) {
    try {
      const res = await fetch(`https://graph.facebook.com/v18.0/instagram_oembed?url=${encodeURIComponent(url)}&omitscript=true`)
      const data = await res.json()
      if (data.thumbnail_url) setForm(f => ({ ...f, thumbnail_url: data.thumbnail_url, title: f.title || data.title || '' }))
    } catch {}
  }

  function openCreate() { setForm(emptyForm); setEditingId(null); setModalOpen(true) }
  function openEdit(v: Video) {
    setForm({ title: v.title, description: v.description || '', thumbnail_url: v.thumbnail_url, video_url: v.video_url, platform: v.platform, is_pinned: v.is_pinned, is_published: v.is_published, sort_order: v.sort_order })
    setEditingId(v.id)
    setModalOpen(true)
  }

  async function handleSave() {
    if (!form.title || !form.video_url) { toast.error('標題和影片連結為必填'); return }
    setSaving(true)
    const autoThumb = !form.thumbnail_url && form.platform === 'youtube' ? getYouTubeThumbnail(form.video_url) : form.thumbnail_url
    const payload = { ...form, thumbnail_url: autoThumb, description: form.description || null }
    try {
      if (editingId) {
        const { data, error } = await supabase.from('videos').update(payload).eq('id', editingId).select().single()
        if (error) throw error
        setVideos(prev => prev.map(v => v.id === editingId ? data : v))
        toast.success('影片已更新！')
      } else {
        const { data, error } = await supabase.from('videos').insert(payload).select().single()
        if (error) throw error
        setVideos(prev => [data, ...prev])
        toast.success('影片已新增！')
      }
      setModalOpen(false)
    } catch { toast.error('儲存失敗') } finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm('確定要刪除嗎？')) return
    const { error } = await supabase.from('videos').delete().eq('id', id)
    if (error) { toast.error('刪除失敗'); return }
    setVideos(prev => prev.filter(v => v.id !== id))
    toast.success('已刪除')
  }

  async function toggleField(id: string, field: 'is_published' | 'is_pinned', value: boolean) {
    const { data, error } = await supabase.from('videos').update({ [field]: value }).eq('id', id).select().single()
    if (error) { toast.error('更新失敗'); return }
    setVideos(prev => prev.map(v => v.id === id ? data : v))
  }

  const platformLabel = { youtube: 'YouTube', instagram: 'Reels', tiktok: 'TikTok' }

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-warm-800 dark:text-cream-100">影音管理</h1>
            <p className="text-sm text-warm-400 mt-0.5">{videos.length} 部影片</p>
          </div>
          <button onClick={openCreate} className="btn-primary"><Plus className="w-4 h-4" /> 新增影片</button>
        </div>

        {videos.length === 0 ? (
          <div className="card-soft py-16 flex flex-col items-center text-warm-300">
            <VideoIcon className="w-12 h-12 mb-3 opacity-30" />
            <p className="font-medium">還沒有影片</p>
            <button onClick={openCreate} className="mt-4 btn-primary">新增第一部影片</button>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {videos.map((v, i) => {
                const thumb = v.thumbnail_url || (v.platform === 'youtube' ? getYouTubeThumbnail(v.video_url) : null)
                return (
                  <motion.div key={v.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ delay: i * 0.03 }} className="card-soft p-4 flex items-center gap-4">
                    <div className="w-20 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-cream-100 dark:bg-warm-700">
                      {thumb ? <Image src={thumb} alt={v.title} width={80} height={48} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl">🎬</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-warm-800 dark:text-cream-100 truncate flex items-center gap-1.5">
                        {v.title}
                        {v.is_pinned && <Pin className="w-3 h-3 text-coral-400 fill-coral-400" />}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`badge text-[10px] ${v.platform === 'youtube' ? 'bg-red-50 text-red-500 dark:bg-red-900/20' : v.platform === 'instagram' ? 'bg-pink-50 text-pink-500 dark:bg-pink-900/20' : 'bg-gray-100 text-gray-500 dark:bg-gray-800'}`}>{platformLabel[v.platform]}</span>
                        <span className="text-xs text-warm-300 truncate max-w-[160px]">{v.video_url}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Toggle checked={v.is_published} onChange={val => toggleField(v.id, 'is_published', val)} size="sm" />
                      <button onClick={() => toggleField(v.id, 'is_pinned', !v.is_pinned)} className={`p-1.5 rounded-lg transition-colors ${v.is_pinned ? 'text-coral-400 bg-coral-50 dark:bg-coral-900/20' : 'text-warm-300 hover:text-coral-400'}`}><Pin className={`w-4 h-4 ${v.is_pinned ? 'fill-coral-400' : ''}`} /></button>
                      <button onClick={() => openEdit(v)} className="p-1.5 rounded-lg text-warm-300 hover:text-sage-500 hover:bg-sage-50 transition-colors"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(v.id)} className="p-1.5 rounded-lg text-warm-300 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? '編輯影片' : '新增影片'} size="lg">
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div>
            <label className="block text-xs font-medium text-warm-600 dark:text-warm-400 mb-1.5">影片連結 *</label>
            <input value={form.video_url} onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))} placeholder="Instagram Reels 網址" type="url" className="input-field" />
            
          </div>
          <div>
            <label className="block text-xs font-medium text-warm-600 dark:text-warm-400 mb-1.5">平台</label>
            <select value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value as Video['platform'] }))} className="input-field">
              <option value="youtube">YouTube</option>
              <option value="instagram">Instagram / Reels</option>
              <option value="tiktok">TikTok</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-warm-600 dark:text-warm-400 mb-1.5">標題 *</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="影片標題" className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-medium text-warm-600 dark:text-warm-400 mb-1.5">描述（可選）</label>
            <textarea value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="input-field resize-none" />
          </div>
            <div>
              <label className="block text-xs font-medium text-warm-600 dark:text-warm-400 mb-1.5">分類</label>
              <select value={form.category || ''} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input-field">
                <option value="">不分類</option>
                <option value="感官盆">感官盆</option>
                <option value="磁力片">磁力片</option>
                <option value="生活用品">生活用品</option>
                <option value="益智玩具">益智玩具</option>
                <option value="戶外探索">戶外探索</option>
                <option value="手作DIY">手作DIY</option>
                <option value="繪本故事">繪本故事</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-warm-600 dark:text-warm-400 mb-1.5">自訂縮圖（可選，YouTube 會自動帶入）</label>
            <ImageUpload value={form.thumbnail_url} onChange={url => setForm(f => ({ ...f, thumbnail_url: url }))} folder="videos" />
          </div>
          <div className="flex items-center gap-6 pt-2 border-t border-cream-200 dark:border-warm-700">
            <Toggle checked={form.is_published} onChange={v => setForm(f => ({ ...f, is_published: v }))} label="上架" />
            <Toggle checked={form.is_pinned} onChange={v => setForm(f => ({ ...f, is_pinned: v }))} label="置頂" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="flex-1 btn-secondary">取消</button>
            <button onClick={handleSave} disabled={saving} className="flex-1 btn-primary">{saving ? '儲存中…' : (editingId ? '儲存修改' : '新增影片')}</button>
          </div>
        </div>
      </Modal>
    </>
  )
}
