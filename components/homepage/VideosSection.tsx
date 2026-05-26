'use client'

import { useState } from 'react'
import { VideoCard } from './VideoCard'
import type { Video } from '@/lib/types'

const CATEGORIES = ['全部', '感官盆', '磁力片', '生活用品', '益智玩具']

export function VideosSection({ videos }: { videos: Video[] }) {
  const [active, setActive] = useState('全部')
  const filtered = active === '全部' ? videos : videos.filter(v => (v as any).category === active)

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${active === cat ? 'bg-coral-400 text-white' : 'bg-cream-100 dark:bg-warm-700 text-warm-600 dark:text-warm-300'}`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {filtered.map((video, i) => (
          <VideoCard key={video.id} video={video} index={i} />
        ))}
      </div>
    </div>
  )
}
