'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, Pin, Eye, EyeOff, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import { Modal } from '@/components/ui/Modal'
import { Toggle } from '@/components/ui/Toggle'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'
import type { Product } from '@/lib/types'

type Props = { initialProducts: Product[] }

type FormData = Omit<Product, 'id' | 'click_count' | 'created_at' | 'updated_at'>

const emptyForm: FormData = {
  title: '',
  description: '',
  thumbnail_url: null,
  url: '',
  button_text: '前往團購',
  price: '',
  original_price: '',
  start_date: null,
  deadline: null,
  is_pinned: false,
  is_published: true,
  sort_order: 0,
  tags: [],
}

export function ProductsClient({ initialProducts }: Props) {
  const [products, setProducts] = useState(initialProducts)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [tagInput, setTagInput] = useState('')

  const supabase = createClient()

  function openCreate() {
    setForm(emptyForm)
    setEditingId(null)
    setTagInput('')
    setModalOpen(true)
  }

  function openEdit(product: Product) {
    setForm({
      title: product.title,
      description: product.description || '',
      thumbnail_url: product.thumbnail_url,
      url: product.url,
      button_text: product.button_text,
      price: product.price || '',
      original_price: product.original_price || '',
      start_date: (product as any).start_date || null,
      deadline: product.deadline,
      is_pinned: product.is_pinned,
      is_published: product.is_published,
      sort_order: product.sort_order,
      tags: product.tags || [],
    })
    setEditingId(product.id)
    setTagInput('')
    setModalOpen(true)
  }

  async function handleSave() {
    if (!form.title || !form.url) {
      toast.error('標題和連結為必填')
      return
    }
    setSaving(true)
    const payload = {
      ...form,
      description: form.description || null,
      price: form.price || null,
      original_price: form.original_price || null,
    }
    try {
      if (editingId) {
        const { data, error } = await supabase.from('products').update(payload).eq('id', editingId).select().single()
        if (error) throw error
        setProducts(prev => prev.map(p => p.id === editingId ? data : p))
        toast.success('商品已更新！')
      } else {
        const { data, error } = await supabase.from('products').insert(payload).select().single()
        if (error) throw error
        setProducts(prev => [data, ...prev])
        toast.success('商品已新增！')
      }
      setModalOpen(false)
    } catch (e) {
      toast.error('儲存失敗')
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('確定要刪除這個商品嗎？')) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) { toast.error('刪除失敗'); return }
    setProducts(prev => prev.filter(p => p.id !== id))
    toast.success('已刪除')
  }

  async function toggleField(id: string, field: 'is_published' | 'is_pinned', value: boolean) {
    const { data, error } = await supabase.from('products').update({ [field]: value }).eq('id', id).select().single()
    if (error) { toast.error('更新失敗'); return }
    setProducts(prev => prev.map(p => p.id === id ? data : p))
  }

  function addTag() {
    const t = tagInput.trim()
    if (t && !(form.tags || []).includes(t)) {
      setForm(f => ({ ...f, tags: [...(f.tags || []), t] }))
    }
    setTagInput('')
  }

  return (
    <>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-warm-800 dark:text-cream-100">團購商品</h1>
            <p className="text-sm text-warm-400 mt-0.5">{products.length} 個商品</p>
          </div>
          <button onClick={openCreate} className="btn-primary">
            <Plus className="w-4 h-4" /> 新增商品
          </button>
        </div>

        {/* Table */}
        {products.length === 0 ? (
          <div className="card-soft py-16 flex flex-col items-center text-warm-300">
            <ShoppingBag className="w-12 h-12 mb-3 opacity-30" />
            <p className="font-medium">還沒有商品</p>
            <button onClick={openCreate} className="mt-4 btn-primary">新增第一個商品</button>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {products.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.03 }}
                  className="card-soft p-4 flex items-center gap-4"
                >
                  {/* Thumb */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-cream-100 dark:bg-warm-700">
                    {p.thumbnail_url ? (
                      <Image src={p.thumbnail_url} alt={p.title} width={56} height={56} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">🛍️</div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-warm-800 dark:text-cream-100 truncate flex items-center gap-1.5">
                      {p.title}
                      {p.is_pinned && <Pin className="w-3 h-3 text-coral-400 fill-coral-400" />}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {p.price && <span className="text-xs text-coral-500 font-medium">{p.price}</span>}
                      {p.deadline && <span className="text-xs text-warm-400">{new Date(p.deadline) > new Date() ? '🕐 倒數中' : '已截止'}</span>}
                      <span className="text-xs text-warm-300 truncate max-w-[120px]">{p.url}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Toggle
                      checked={p.is_published}
                      onChange={v => toggleField(p.id, 'is_published', v)}
                      size="sm"
                    />
                    <button
                      onClick={() => toggleField(p.id, 'is_pinned', !p.is_pinned)}
                      className={`p-1.5 rounded-lg transition-colors ${p.is_pinned ? 'text-coral-400 bg-coral-50 dark:bg-coral-900/20' : 'text-warm-300 hover:text-coral-400 hover:bg-coral-50'}`}
                    >
                      <Pin className={`w-4 h-4 ${p.is_pinned ? 'fill-coral-400' : ''}`} />
                    </button>
                    <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-warm-300 hover:text-sage-500 hover:bg-sage-50 dark:hover:bg-sage-900/20 transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg text-warm-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? '編輯商品' : '新增商品'}
        size="lg"
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Image */}
          <div>
            <label className="block text-xs font-medium text-warm-600 dark:text-warm-400 mb-1.5">封面圖片</label>
            <ImageUpload value={form.thumbnail_url} onChange={url => setForm(f => ({ ...f, thumbnail_url: url }))} folder="products" />
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-warm-600 dark:text-warm-400 mb-1.5">標題 *</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="商品名稱" className="input-field" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-warm-600 dark:text-warm-400 mb-1.5">描述</label>
            <textarea value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="商品介紹" rows={3} className="input-field resize-none" />
          </div>

          {/* URL */}
          <div>
            <label className="block text-xs font-medium text-warm-600 dark:text-warm-400 mb-1.5">連結網址 *</label>
            <input value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://" type="url" className="input-field" />
          </div>

          {/* Button text */}
          <div>
            <label className="block text-xs font-medium text-warm-600 dark:text-warm-400 mb-1.5">按鈕文字</label>
            <input value={form.button_text} onChange={e => setForm(f => ({ ...f, button_text: e.target.value }))} placeholder="前往團購" className="input-field" />
          </div>

          {/* Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-warm-600 dark:text-warm-400 mb-1.5">團購價</label>
              <input value={form.price || ''} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="$399" className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-warm-600 dark:text-warm-400 mb-1.5">原價（可選）</label>
              <input value={form.original_price || ''} onChange={e => setForm(f => ({ ...f, original_price: e.target.value }))} placeholder="$599" className="input-field" />
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-xs font-medium text-warm-600 dark:text-warm-400 mb-1.5">截止日期（可選）</label>
            <input
              type="datetime-local"
              value={form.deadline ? new Date(form.deadline).toISOString().slice(0, 16) : ''}
              onChange={e => setForm(f => ({ ...f, deadline: e.target.value ? new Date(e.target.value).toISOString() : null }))}
              className="input-field"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-medium text-warm-600 dark:text-warm-400 mb-1.5">標籤</label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {(form.tags || []).map(tag => (
                <span key={tag} className="badge bg-cream-200 dark:bg-warm-700 text-warm-600 dark:text-warm-300 gap-1">
                  {tag}
                  <button type="button" onClick={() => setForm(f => ({ ...f, tags: (f.tags || []).filter(t => t !== tag) }))} className="text-warm-400 hover:text-red-400">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="新增標籤後按 Enter" className="input-field flex-1" />
              <button type="button" onClick={addTag} className="btn-secondary px-3 py-2 text-xs">新增</button>
            </div>
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-6 pt-2 border-t border-cream-200 dark:border-warm-700">
            <Toggle checked={form.is_published} onChange={v => setForm(f => ({ ...f, is_published: v }))} label="上架" />
            <Toggle checked={form.is_pinned} onChange={v => setForm(f => ({ ...f, is_pinned: v }))} label="置頂" />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="flex-1 btn-secondary">取消</button>
            <button onClick={handleSave} disabled={saving} className="flex-1 btn-primary">
              {saving ? '儲存中…' : (editingId ? '儲存修改' : '新增商品')}
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
