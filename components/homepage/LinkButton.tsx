'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { ExternalLink, ChevronRight } from 'lucide-react'
import type { Link } from '@/lib/types'

type Props = {
  link: Link
  onClickTrack?: (id: string) => void
  index?: number
}

export function LinkButton({ link, onClickTrack, index = 0 }: Props) {
  return (
    <motion.a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => onClickTrack?.(link.id)}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-3 w-full p-3.5 rounded-2xl bg-white dark:bg-warm-800
                 border border-cream-200 dark:border-warm-600
                 shadow-soft hover:shadow-card transition-all duration-200 group"
    >
      {/* Thumbnail */}
      <div className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-cream-100 dark:bg-warm-700">
        {link.thumbnail_url ? (
          <Image
            src={link.thumbnail_url}
            alt={link.title}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xl bg-coral-gradient">
            🔗
          </div>
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-warm-800 dark:text-cream-100 truncate">
          {link.title}
          {link.is_pinned && <span className="ml-1.5 text-coral-400 text-xs">✨</span>}
        </p>
        {link.description && (
          <p className="text-xs text-warm-400 dark:text-warm-400 mt-0.5 truncate">
            {link.description}
          </p>
        )}
      </div>

      {/* Arrow */}
      <div className="flex-shrink-0 flex items-center gap-1 text-coral-400 group-hover:text-coral-500">
        <span className="text-xs font-medium hidden sm:block">{link.button_text}</span>
        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      </div>
    </motion.a>
  )
}
