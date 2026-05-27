'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { ExternalLink, Tag } from 'lucide-react'
import type { Product } from '@/lib/types'
import { CountdownTimer } from './CountdownTimer'
import { isExpired } from '@/lib/utils'

type Props = {
  product: Product
  onClickTrack?: (id: string) => void
  index?: number
}

export function ProductCard({ product, onClickTrack, index = 0 }: Props) {
  const expired = isExpired(product.deadline)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className={`card-soft overflow-hidden flex flex-col ${expired ? 'opacity-70' : ''}`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-square bg-cream-100 dark:bg-warm-700">
        {product.thumbnail_url ? (
          <Image
            src={product.thumbnail_url}
            alt={product.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-coral-50 to-cream-200">
            🛍️
          </div>
        )}
        {(() => {
          const now = new Date()
          const started = !(product as any).start_date || new Date((product as any).start_date) <= now
          const notEnded = !product.deadline || new Date(product.deadline) > now
          return started && notEnded ? (
            <span className="absolute top-2 left-2 badge bg-black/40 backdrop-blur-sm text-white text-[10px]">現正開團中</span>
          ) : null
        })()}
        {expired && (
          <div className="absolute inset-0 bg-warm-800/50 flex items-center justify-center">
            <span className="text-white font-black text-lg">開團結束</span>
          </div>
        )}
        {product.deadline && !expired && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-sm px-3 py-2">
            <CountdownTimer deadline={product.deadline} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-warm-800 dark:text-cream-100 text-sm leading-snug line-clamp-2">
          {product.title}
        </h3>

        {product.description && (
          <p className="text-xs text-warm-500 dark:text-warm-300 mt-0.5 line-clamp-2 leading-snug">
            {product.description}
          </p>
        )}

        {/* Price */}
        {product.price && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-coral-500 font-bold text-sm">{product.price}</span>
            {product.original_price && (
              <span className="text-warm-300 dark:text-warm-500 text-xs line-through">{product.original_price}</span>
            )}
          </div>
        )}

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {product.tags.slice(0, 3).map(tag => (
              <span key={tag} className="badge bg-cream-200 dark:bg-warm-700 text-warm-500 dark:text-warm-300 text-[10px]">
                <Tag className="w-2.5 h-2.5 mr-0.5" />{tag}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        {!expired && (
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onClickTrack?.(product.id)}
            className="mt-auto w-full btn-primary text-xs py-3 text-center flex items-center justify-center gap-1.5 mt-8"
            style={{ display: 'flex' }}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            {product.button_text}
          </a>
        )}
      </div>
    </motion.div>
  )
}
