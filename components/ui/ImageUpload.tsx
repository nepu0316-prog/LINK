'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2, ImageIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'

type Props = {
  value: string | null
  onChange: (url: string | null) => void
  folder?: string
}

export function ImageUpload({ value, onChange, folder = 'uploads' }: Props) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('圖片不能超過 5MB')
      return
    }

    setUploading(true)
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error } = await supabase.storage.from('media').upload(filename, file, {
        cacheControl: '3600',
        upsert: false,
      })
      if (error) throw error

      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filename)
      onChange(publicUrl)
      toast.success('圖片上傳成功！')
    } catch (err) {
      toast.error('上傳失敗，請再試一次')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl transition-colors cursor-pointer
          ${value ? 'border-cream-300' : 'border-cream-300 hover:border-coral-300'}
          bg-cream-50 dark:bg-warm-700 dark:border-warm-600`}
      >
        {value ? (
          <div className="relative aspect-video rounded-2xl overflow-hidden">
            <Image src={value} alt="Preview" fill className="object-cover" />
            <button
              onClick={(e) => { e.stopPropagation(); onChange(null) }}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-warm-400">
            {uploading ? (
              <Loader2 className="w-8 h-8 animate-spin text-coral-400 mb-2" />
            ) : (
              <ImageIcon className="w-8 h-8 mb-2 opacity-40" />
            )}
            <p className="text-sm font-medium">{uploading ? '上傳中…' : '點擊上傳圖片'}</p>
            <p className="text-xs mt-1 opacity-60">PNG, JPG, WebP · 最大 5MB</p>
          </div>
        )}
        {!value && (
          <div className="absolute inset-0 flex items-end justify-end p-3">
            <Upload className="w-4 h-4 text-warm-300" />
          </div>
        )}
      </div>

      {/* URL input as fallback */}
      <div className="relative">
        <input
          type="url"
          value={value || ''}
          onChange={e => onChange(e.target.value || null)}
          placeholder="或直接貼上圖片網址"
          className="input-field text-xs pr-8"
        />
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  )
}
