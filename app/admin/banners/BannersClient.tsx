'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { Modal } from '@/components/ui/Modal'
import { Toggle } from '@/components/ui/Toggle'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'
import type { Banner } from '@/lib/types'

type Props = { initialBanners: Banner[] }
type FormData = Omit<Banner, 'id' | 'created_at' | 'updated_at'>

const emptyForm: FormData = {
  title: '',
  description: '',
  image_url: '',
  link_url: '',
  button_text: '',
  is_published: true,
  sort_order: 0,
}

export function BannersClient({ initialBanners }: Props) {
  const [banners, setBanners] = useState(initialBanners)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  function openCreate() { setForm(emptyForm); setEditingId(null); setModalOpen(true) }
  function openEdit(b: Banner) {
    setForm({ title: b.title || '', description: b.description || '', image_url: b.image_url, link_url: b.link_url || '', button_text: b.button_text || '', is_published: b.is_published, sort_order: b.sort_order })
    setEditingId(b.id)
    setModalOpen(true)
  }

  async function handleSave() {
    if (!form.image_url) { toast.error('請上傳 Banner 圖片'); return }
    setSaving(true)
    const payload = { ...form, title: form.title || null, description: form.description || null, link_url: form.link_url || null, button_text: form.button_text || null }
    try {
      if (editingId) {
        const { data, error } = await supabase.from('banners').update(payload).eq('id', editingId).select().single()
        if (error) throw error
        setBanners(prev => prev.map(b => b.id === editingId ? data : b))
        toast.success('Banner 已更新！')
      } else {
        const { data, error } = await supabase.from('banners').insert(payload).select().single()
        if (error) throw error
        setBanners(prev => [data, ...prev])
        toast.success('Banner 已新增！')
      }
      setModalOpen(false)
    } catch { toast.error('儲存失敗') } finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm('確定要刪除嗎？')) return
    const { error } = await supabase.from('banners').delete().eq('id', id)
    if (error) { toast.error('刪除失敗'); return }
    setBanners(prev => prev.filter(b => b.id !== id))
    toast.success('已刪除')
  }

  async function togglePublished(id: string, value: boolean) {
    const { data, error } = await supabase.from('banners').update({ is_published: value }).eq('id', id).select().single()
    if (error) { toast.error('更新失敗'); return }
    setBanners(prev => prev.map(b => b.id === id ? data : b))
  }

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-warm-800 dark:text-cream-100">Banner 管理</h1>
            <p className="text-sm text-warm-400 mt-0.5">{banners.length} 個 Banner · 首頁輪播</p>
          </div>
          <button onClick={openCreate} className="btn-primary"><Plus className="w-4 h-4" /> 新增 Banner</button>
        </div>

        {banners.length === 0 ? (
          <div className="card-soft py-16 flex flex-col items-center text-warm-300">
            <ImageIcon className="w-12 h-12 mb-3 opacity-30" />
            <p className="font-medium">還沒有 Banner</p>
            <button onClick={openCreate} className="mt-4 btn-primary">新增第一個 Banner</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AnimatePresence>
              {banners.map((b, i) => (
                <motion.div key={b.id} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.05 }} className="card-soft overflow-hidden">
                  <div className="relative aspect-[2/1]">
                    <Image src={b.image_url} alt={b.title || 'Banner'} fill className="object-cover" />
                    {!b.is_published && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><span className="badge bg-white text-warm-600">已隱藏</span></div>}
                  </div>
                  <div className="p-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-warm-800 dark:text-cream-100 truncate">{b.title || '無標題'}</p>
                      {b.link_url && <p className="text-xs text-warm-400 truncate">{b.link_url}</p>}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Toggle checked={b.is_published} onChange={val => togglePublished(b.id, val)} size="sm" />
                      <button onClick={() => openEdit(b)} className="p-1.5 rounded-lg text-warm-300 hover:text-sage-500 hover:bg-sage-50 transition-colors"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(b.id)} className="p-1.5 rounded-lg text-warm-300 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? '編輯 Banner' : '新增 Banner'}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-warm-600 dark:text-warm-400 mb-1.5">Banner 圖片 *</label>
            <ImageUpload value={form.image_url || null} onChange={url => setForm(f => ({ ...f, image_url: url || '' }))} folder="banners" />
          </div>
          <div>
            <label className="block text-xs font-medium text-warm-600 dark:text-warm-400 mb-1.5">標題（可選）</label>
            <input value={form.title || ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Banner 標題" className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-medium text-warm-600 dark:text-warm-400 mb-1.5">說明文字（可選）</label>
            <input value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="簡短說明" className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-medium text-warm-600 dark:text-warm-400 mb-1.5">點擊連結（可選）</label>
            <input value={form.link_url || ''} onChange={e => setForm(f => ({ ...f, link_url: e.target.value }))} placeholder="https://" type="url" className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-medium text-warm-600 dark:text-warm-400 mb-1.5">按鈕文字（可選）</label>
            <input value={form.button_text || ''} onChange={e => setForm(f => ({ ...f, button_text: e.target.value }))} placeholder="了解更多" className="input-field" />
          </div>
          <div className="flex items-center gap-4 pt-2 border-t border-cream-200 dark:border-warm-700">
            <Toggle checked={form.is_published} onChange={v => setForm(f => ({ ...f, is_published: v }))} label="顯示" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="flex-1 btn-secondary">取消</button>
            <button onClick={handleSave} disabled={saving} className="flex-1 btn-primary">{saving ? '儲存中…' : (editingId ? '儲存修改' : '新增 Banner')}</button>
          </div>
        </div>
      </Modal>
    </>
  )
}
