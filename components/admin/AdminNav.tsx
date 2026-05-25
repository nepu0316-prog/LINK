'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, ShoppingBag, Video, Link2,
  Image as ImageIcon, User, LogOut, Menu, X, ExternalLink
} from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin', label: '總覽', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: '團購商品', icon: ShoppingBag },
  { href: '/admin/videos', label: '影音管理', icon: Video },
  { href: '/admin/links', label: '連結管理', icon: Link2 },
  { href: '/admin/banners', label: 'Banner', icon: ImageIcon },
  { href: '/admin/profile', label: '個人設定', icon: User },
]

export function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  function isActive(item: typeof navItems[0]) {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="px-6 py-5 border-b border-cream-200 dark:border-warm-700">
        <Link href="/" className="flex items-center gap-2 group" target="_blank">
          <span className="text-2xl">🌿</span>
          <div>
            <p className="font-bold text-warm-800 dark:text-cream-100 text-sm">親子小日子</p>
            <p className="text-[10px] text-warm-400 flex items-center gap-1">
              管理後台 <ExternalLink className="w-2.5 h-2.5" />
            </p>
          </div>
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-coral-100 dark:bg-coral-900/30 text-coral-600 dark:text-coral-300'
                  : 'text-warm-600 dark:text-warm-300 hover:bg-cream-100 dark:hover:bg-warm-700'
              )}
            >
              <item.icon className={cn('w-4 h-4', active ? 'text-coral-500' : 'text-warm-400')} />
              {item.label}
              {active && (
                <motion.div
                  layoutId="active-nav"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-coral-400"
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-4 border-t border-cream-200 dark:border-warm-700 pt-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                     text-warm-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500
                     transition-colors"
        >
          <LogOut className="w-4 h-4" />
          登出
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-white dark:bg-warm-800 border-r border-cream-200 dark:border-warm-700 h-screen sticky top-0">
        <NavContent />
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-warm-800 border-b border-cream-200 dark:border-warm-700 px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" target="_blank">
          <span className="text-xl">🌿</span>
          <span className="font-bold text-warm-800 dark:text-cream-100 text-sm">管理後台</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl hover:bg-cream-100 dark:hover:bg-warm-700 transition-colors"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="md:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="md:hidden fixed top-0 left-0 bottom-0 z-50 w-64 bg-white dark:bg-warm-800 flex flex-col shadow-xl"
            >
              <NavContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
