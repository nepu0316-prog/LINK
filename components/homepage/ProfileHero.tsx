'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import type { Profile } from '@/lib/types'
import { SocialLinks } from './SocialLinks'

type Props = { profile: Profile }

export function ProfileHero({ profile }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center text-center pt-8 pb-4"
    >
      {/* Avatar */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="relative mb-4"
      >
        <div
          className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden ring-4 shadow-glow"
          style={{ "--tw-ring-color": profile.brand_color } as React.CSSProperties}
        >
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.name}
              width={112}
              height={112}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-4xl"
              style={{ background: `linear-gradient(135deg, ${profile.brand_color}40, ${profile.brand_color}80)` }}
            >
              🌿
            </div>
          )}
        </div>
        {/* Decorative ring */}
        <div
          className="absolute -inset-1 rounded-full border-2 border-dashed opacity-40"
          style={{ borderColor: profile.brand_color }}
        />
        {/* Status dot */}
        <span className="absolute bottom-1 right-1 w-4 h-4 bg-sage-300 rounded-full border-2 border-white" />
      </motion.div>

      {/* Name */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl md:text-3xl font-bold text-warm-800 dark:text-cream-100 font-display"
      >
        {profile.name}
      </motion.h1>

      {/* Bio */}
      {profile.bio && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-2 text-sm text-warm-500 dark:text-warm-300 max-w-xs leading-relaxed"
        >
          {profile.bio?.split("\n").map((line, i) => <span key={i}>{line}<br /></span>)}
        </motion.p>
      )}

      {/* Social Links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-4"
      >
        <div className="flex items-center gap-2">
          <SocialLinks profile={profile} />
          <a href="https://duliduli-website.com" target="_blank" rel="noopener noreferrer"
            className="w-10 h-10 rounded-2xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center shadow-soft transition-all duration-200 hover:scale-110 hover:-translate-y-0.5"
            aria-label="官網">
            🌐
          </a>
        </div>
      </motion.div>

      {/* Decorative divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-6 flex items-center gap-3 w-full max-w-sm"
      >
        <span className="flex-1 h-px bg-gradient-to-r from-transparent via-cream-300 to-transparent" />
        <span className="text-coral-300 text-lg">✿</span>
        <span className="flex-1 h-px bg-gradient-to-r from-transparent via-cream-300 to-transparent" />
      </motion.div>
    </motion.section>
  )
}
