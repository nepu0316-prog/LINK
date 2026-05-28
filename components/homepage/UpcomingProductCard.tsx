'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { CalendarDays } from 'lucide-react'
import type { Product } from '@/lib/types'

type Props = {
  product: Product
  index?: number
}

function getDaysUntil(dateStr: string) {
  const now = new Date()
  const target = new Date(dateStr)
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export function UpcomingProductCard({ product, index = 0 }: Props) {
  const startDate = (product as { start_date?: string | null }).start_date
  const daysLeft = startDate ? getDaysUntil(startDate) : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      className="card-soft overflow-hidden relative"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] bg-cream-100 dark:bg-warm-700">
        {product.thumbnail_url ? (
          <Image
            src={product.thumbnail_url}
            alt={product.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-sage-50 to-sage-100">
            🛍️
          </div>
        )}
        {/* Coming soon overlay */}
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-xs font-bold text-warm-700 shadow-sm">
            📅 即將開團
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5">
        <h3 className="font-bold text-warm-800 dark:text-cream-100 text-sm leading-snug line-clamp-2">
          {product.title}
        </h3>

        {product.description && (
          <p className="text-xs text-warm-400 dark:text-warm-400 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Date badge */}
        {startDate && (
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-sage-600 dark:text-sage-300 font-medium">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>
              {daysLeft !== null && daysLeft > 0
                ? `還有 ${daysLeft} 天開團`
                : `${new Date(startDate).getMonth() + 1}/${new Date(startDate).getDate()} 開團`}
            </span>
          </div>
        )}

        {/* Price preview */}
        {product.price && (
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-xs text-warm-400 line-through">{product.original_price}</span>
            <span className="text-xs font-bold text-coral-500">{product.price}</span>
          </div>
        )}

        {/* Notify button */}
        <div className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl
          bg-sage-50 dark:bg-sage-900/20 border border-sage-200 dark:border-sage-700
          text-sage-600 dark:text-sage-400 text-xs font-medium">
          🔔 開團時通知我
        </div>
      </div>
    </motion.div>
  )
}
