'use client'

import { motion } from 'framer-motion'

type Props = {
  instagramUrl: string
  handle?: string
}

export function IGFollowCTA({ instagramUrl, handle }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-8"
    >
      {/* 簡潔白卡，左側 IG 粉紅細邊裝飾 */}
      <div
        className="relative rounded-3xl p-5 overflow-hidden bg-white"
        style={{ borderLeft: '4px solid #ee2a7b' }}
      >
        {/* 內容 */}
        <div className="flex items-center gap-4">
          {/* IG Icon */}
          <div
            className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
            style={{
              background: 'linear-gradient(135deg, #f9ce34, #ee2a7b, #6228d7)',
            }}
          >
            <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </div>

          {/* 文字 */}
          <div className="flex-1">
            <p className="font-bold text-sm text-warm-800 leading-tight">追蹤我的 Instagram</p>
            <p className="text-xs text-warm-400 mt-0.5">每天分享親子生活 × 第一手開團資訊 ✨</p>
            {handle && (
              <p className="text-xs text-warm-300 mt-0.5">@{handle}</p>
            )}
          </div>

          {/* 追蹤按鈕 */}
          <motion.a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0 px-4 py-2 rounded-2xl text-xs font-bold text-white transition-all"
            style={{
              background: 'linear-gradient(135deg, #f9ce34, #ee2a7b, #6228d7)',
            }}
          >
            追蹤
          </motion.a>
        </div>
      </div>
    </motion.section>
  )
}
