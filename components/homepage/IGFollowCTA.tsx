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
      className="mt-8 relative"
    >
      {/* 透明延伸光暈（卡片外發光，延伸到背景） */}
      <div
        className="absolute -inset-3 rounded-3xl blur-2xl opacity-40"
        style={{
          background: 'linear-gradient(135deg, #f9ce34 0%, #ee2a7b 50%, #6228d7 100%)',
        }}
      />

      {/* 主卡片：透明玻璃感 */}
      <div
        className="relative rounded-3xl p-5 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(249,206,52,0.12) 0%, rgba(238,42,123,0.10) 50%, rgba(98,40,215,0.10) 100%)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(238,42,123,0.2)',
        }}
      >
        {/* 細緻裝飾光圈（更透明） */}
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-pink-300/10 blur-xl" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-yellow-300/10 blur-xl" />

        {/* 內容 */}
        <div className="relative flex items-center gap-4">
          {/* IG Icon */}
          <div
            className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center shadow-md"
            style={{
              background: 'linear-gradient(135deg, #f9ce34, #ee2a7b, #6228d7)',
            }}
          >
            <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </div>

          {/* 文字 */}
          <div className="flex-1">
            <p className="font-bold text-base text-warm-800 leading-tight">追蹤我的 Instagram</p>
            <p className="text-sm text-warm-500 mt-0.5">每天分享親子生活 × 第一手開團資訊 ✨</p>
            {handle && (
              <p className="text-xs text-warm-400 mt-0.5">@{handle}</p>
            )}
          </div>
        </div>

        {/* 立即追蹤按鈕 */}
        <motion.a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-bold text-sm transition-all"
          style={{
            background: 'linear-gradient(135deg, #f9ce34, #ee2a7b, #6228d7)',
            color: 'white',
            boxShadow: '0 4px 15px rgba(238,42,123,0.3)',
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          立即追蹤
        </motion.a>
      </div>
    </motion.section>
  )
}
