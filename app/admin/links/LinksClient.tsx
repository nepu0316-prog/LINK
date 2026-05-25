'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, Pin, Link2, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import { Modal } from '@/components/ui/Modal'
import { Toggle } from '@/components/ui/Toggle'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'
import type { Link } from '@/lib/types'

type Props = { initialLinks: Link[] }
type FormData = Omit<Link, 'id' | 'click_count' | 'created_at' | 'updated_at' | 'category_id'>

const emptyForm: FormData = {
  title: '',
  description: '',
  url: '',
  thumbnail_url: null,
  button_text: '前往',
  is_pinned: false,
  is_published: true,
  sort_order: 0,
}

export function LinksClient({ initialLinks }: Props) {
  const [links, setLinks] = useState(initialLinks)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  function openCreate() { setForm(emptyForm); setEditingId(null); setModalOpen(true) }
  function openEdit(l: Link) {
    setForm({ title: l.title, description: l.description || '', url: l.url, thumbnail_url: l.thumbnail_url, button_text: l.button_text, is_pinned: l.is_pinned, is_published: l.is_published, sort_order: l.sort_order })
    setEditingId(l.id)
    setModalOpen(true)
  }

  async function handleSave() {
    if (!form.title || !form.url) { toast.error('標題和連結為必填'); return }
    setSaving(true)
    const payload = { ...form, description: form.description || null }
    try {
      if (editingId) {
        const { data, error } = await supabase.from('links').update(payload).eq('id', editingId).select().single()
        if (error) throw error
        setLinks(prev => prev.map(l => l.id === editingId ? data : l))
        toast.success('連結已更新！')
      } else {
        const { data, error } = await supabase.from('links').insert(payload).select().single()
        if (error) throw error
        setLinks(prev => [data, ...prev])
        toast.success('連結已新增！')
      }
      setModalOpen(false)
    } catch { toast.error('儲存失敗') } finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm('確定要刪除嗎？')) return
    const { error } = await supabase.from('links').delete().eq('id', id)
    if (error) { toast.error('刪除失敗'); return }
    setLinks(prev => prev.filter(l => l.id !== id))
    toast.success('已刪除')
  }

  async function toggleField(id: string, field: 'is_published' | 'is_pinned', value: boolean) {
    const { data, error } = await supabase.from('links').update({ [field]: value }).eq('id', id).select().single()
    if (error) { toast.error('更新失敗'); return }
    setLinks(prev => prev.map(l => l.id === id ? data : l))
  }

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-warm-800 dark:text-cream-100">連結管理</h1>
            <p className="text-sm text-warm-400 mt-0.5">{links.length} 個連結</p>
          </div>
          <button onClick={openCreate} className="btn-primary"><Plus className="w-4 h-4" /> 新增連結</button>
        </div>

        {links.length === 0 ? (
          <div className="card-soft py-16 flex flex-col items-center text-warm-300">
            <Link2 className="w-12 h-12 mb-3 opacity-30" />
            <p className="font-medium">還沒有連結</p>
            <button onClick={openCreate} className="mt-4 btn-primary">新增第一個連結</button>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {links.map((l, i) => (
                <motion.div key={l.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ delay: i * 0.03 }} className="card-soft p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-cream-100 dark:bg-warm-700">
                    {l.thumbnail_url ? <Image src={l.thumbnail_url} alt={l.title} width={48} height={48} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl bg-coral-gradient">🔗</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-warm-800 dark:text-cream-100 truncate flex items-center gap-1.5">
                      {l.title}
                      {l.is_pinned && <Pin className="w-3 h-3 text-coral-400 fill-coral-400" />}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-warm-300 truncate max-w-[160px]">{l.url}</span>
                      <span className="text-xs text-warm-400 flex items-center gap-0.5"><TrendingUp className="w-3 h-3" />{l.click_count}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Toggle checked={l.is_published} onChange={val => toggleField(l.id, 'is_published', val)} size="sm" />
                    <button onClick={() => toggleField(l.id, 'is_pinned', !l.is_pinned)} className={`p-1.5 rounded-lg transition-colors ${l.is_pinned ? 'text-coral-400 bg-coral-50' : 'text-warm-300 hover:text-coral-400'}`}><Pin className={`w-4 h-4 ${l.is_pinned ? 'fill-coral-400' : ''}`} /></button>
                    <button onClick={() => openEdit(l)} className="p-1.5 rounded-lg text-warm-300 hover:text-sage-500 hover:bg-sage-50 transition-colors"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(l.id)} className="p-1.5 rounded-lg text-warm-300 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? '編輯連結' : '新增連結'} size="lg">
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div>
            <label className="block text-xs font-medium text-warm-600 dark:text-warm-400 mb-1.5">封面圖片（可選）</label>
            <ImageUpload value={form.thumbnail_url} onChange={url => setForm(f => ({ ...f, thumbnail_url: url }))} folder="links" />
          </div>
          <div>
            <label className="block text-xs font-medium text-warm-600 dark:text-warm-400 mb-1.5">標題 *</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="連結名稱" className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-medium text-warm-600 dark:text-warm-400 mb-1.5">描述（可選）</label>
            <input value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="簡短說明" className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-medium text-warm-600 dark:text-warm-400 mb-1.5">連結網址 *</label>
            <input value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://" type="url" className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-medium text-warm-600 dark:text-warm-400 mb-1.5">按鈕文字</label>
            <input value={form.button_text} onChange={e => setForm(f => ({ ...f, button_text: e.target.value }))} placeholder="前往" className="input-field" />
          </div>
          <div className="flex items-center gap-6 pt-2 border-t border-cream-200 dark:border-warm-700">
            <Toggle checked={form.is_published} onChange={v => setForm(f => ({ ...f, is_published: v }))} label="上架" />
            <Toggle checked={form.is_pinned} onChange={v => setForm(f => ({ ...f, is_pinned: v }))} label="置頂" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="flex-1 btn-secondary">取消</button>
            <button onClick={handleSave} disabled={saving} className="flex-1 btn-primary">{saving ? '儲存中…' : (editingId ? '儲存修改' : '新增連結')}</button>
          </div>
        </div>
      </Modal>
    </>
  )
}
