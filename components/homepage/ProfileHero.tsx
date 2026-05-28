'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import type { Profile, Banner } from '@/lib/types'
import { SocialLinks } from './SocialLinks'

type Props = {
  profile: Profile
  coverBanner?: Banner | null
}

export function ProfileHero({ profile, coverBanner }: Props) {
  const hasCover = !!coverBanner?.image_url

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {/* ── Banner 封面：直式（Portrait 3:4） ── */}
      {hasCover && (
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: '3/4' }}>
          {coverBanner!.link_url ? (
            <a href={coverBanner!.link_url} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
              <Image
                src={coverBanner!.image_url}
                alt={coverBanner!.title || ''}
                fill
                className="object-cover object-center"
                priority
              />
            </a>
          ) : (
            <Image
              src={coverBanner!.image_url}
              alt={coverBanner!.title || ''}
              fill
              className="object-cover object-center"
              priority
            />
          )}
          {/* 底部漸層 fade → 銜接頭像 */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent from-50% to-gray-50" />
        </div>
      )}

      {/* ── Profile Block ── */}
      <div className={`flex flex-col items-center text-center px-4 pb-4 ${hasCover ? '-mt-16' : 'pt-10'}`}>
        {/* Avatar（白底讓頭像從封面浮出） */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="relative mb-3"
        >
          <div className="p-1.5 bg-white rounded-full shadow-card">
            <div
              className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden ring-4"
              style={{ '--tw-ring-color': profile.brand_color } as React.CSSProperties}
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
                  style={{ background: `linear-gradient(135deg, ${profile.brand_color}30, ${profile.brand_color}60)` }}
                >
                  🌿
                </div>
              )}
            </div>
          </div>
          {/* Online dot */}
          <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm" />
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl md:text-3xl font-bold text-warm-800 dark:text-cream-100 font-display"
        >
          {profile.name}
        </motion.h1>

        {/* Bio */}
        {profile.bio && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-2 text-sm text-warm-500 dark:text-warm-300 max-w-xs leading-relaxed"
          >
            {profile.bio.split('\n').map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}
          </motion.p>
        )}

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-4"
        >
          <div className="flex items-center gap-2">
            <SocialLinks profile={profile} />
            <a
              href="https://duliduli-website.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-2xl bg-warm-600 hover:bg-warm-700 flex items-center justify-center text-white shadow-soft transition-all duration-200 hover:scale-110 hover:-translate-y-0.5"
              aria-label="官網"
            >
              🌐
            </a>
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-5 flex items-center gap-3 w-full max-w-sm"
        >
          <span className="flex-1 h-px bg-gradient-to-r from-transparent via-warm-200 to-transparent" />
          <span className="text-base" style={{ color: profile.brand_color }}>✿</span>
          <span className="flex-1 h-px bg-gradient-to-r from-transparent via-warm-200 to-transparent" />
        </motion.div>
      </div>
    </motion.section>
  )
}
