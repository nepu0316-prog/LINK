'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import type { Banner } from '@/lib/types'

type Props = { banners: Banner[] }

export function BannerCarousel({ banners }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSelect)
    const timer = setInterval(() => emblaApi.scrollNext(), 5000)
    return () => {
      emblaApi.off('select', onSelect)
      clearInterval(timer)
    }
  }, [emblaApi, onSelect])

  if (!banners.length) return null

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative w-full"
    >
      <div className="embla rounded-3xl overflow-hidden shadow-card" ref={emblaRef}>
        <div className="embla__container">
          {banners.map((banner) => (
            <div key={banner.id} className="embla__slide relative aspect-[2/1] md:aspect-[3/1]">
              <Image
                src={banner.image_url}
                alt={banner.title || ''}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              {(banner.title || banner.button_text) && (
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  {banner.title && (
                    <p className="font-bold text-lg leading-tight drop-shadow">{banner.title}</p>
                  )}
                  {banner.description && (
                    <p className="text-sm mt-1 opacity-90 drop-shadow">{banner.description}</p>
                  )}
                  {banner.link_url && banner.button_text && (
                    <Link
                      href={banner.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex mt-3 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm
                                 border border-white/40 text-white text-sm font-medium
                                 hover:bg-white/30 transition-colors"
                    >
                      {banner.button_text}
                    </Link>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {banners.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === selectedIndex
                  ? 'w-6 bg-coral-400'
                  : 'w-1.5 bg-cream-300'
              }`}
            />
          ))}
        </div>
      )}
    </motion.section>
  )
}
