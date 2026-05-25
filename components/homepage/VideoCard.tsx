'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Play } from 'lucide-react'
import type { Video } from '@/lib/types'
import { getYouTubeThumbnail } from '@/lib/utils'

type Props = {
  video: Video
  onClickTrack?: (id: string) => void
  index?: number
}

const platformIcon = {
  youtube: { emoji: '▶', label: 'YouTube', color: 'bg-red-500' },
  instagram: { emoji: '📸', label: 'Reels', color: 'bg-gradient-to-br from-purple-500 to-pink-400' },
  tiktok: { emoji: '🎵', label: 'TikTok', color: 'bg-black' },
}

export function VideoCard({ video, onClickTrack, index = 0 }: Props) {
  const thumb = video.thumbnail_url || (video.platform === 'youtube' ? getYouTubeThumbnail(video.video_url) : null)
  const platform = platformIcon[video.platform]

  return (
    <motion.a
      href={video.video_url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => onClickTrack?.(video.id)}
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ scale: 1.02 }}
      className="flex-shrink-0 w-44 md:w-52 group cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-cream-200 dark:bg-warm-700 shadow-card">
        {thumb ? (
          <Image src={thumb} alt={video.title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl bg-gradient-to-br from-sage-50 to-sage-100">
            🎬
          </div>
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            whileHover={{ scale: 1.15 }}
            className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md"
          >
            <Play className="w-4 h-4 text-warm-700 fill-warm-700 ml-0.5" />
          </motion.div>
        </div>
        {/* Platform badge */}
        <span className={`absolute top-2 right-2 badge ${platform.color} text-white text-[10px]`}>
          {platform.label}
        </span>
        {video.is_pinned && (
          <span className="absolute top-2 left-2 badge bg-coral-400 text-white text-[10px]">
            ⭐
          </span>
        )}
      </div>
      {/* Title */}
      <p className="mt-2 text-xs font-medium text-warm-700 dark:text-cream-200 line-clamp-2 leading-snug">
        {video.title}
      </p>
    </motion.a>
  )
}
