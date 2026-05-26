'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error('登入失敗：' + error.message)
      setLoading(false)
    } else {
      toast.success('登入成功！')
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-warm-gradient flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-dots opacity-40" />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="text-5xl mb-3 inline-block"
          >
            🌿
          </motion.div>
          <h1 className="text-2xl font-bold text-warm-800 font-display">嘟力日記</h1>
          <p className="text-sm text-warm-500 mt-1">管理後台登入</p>
        </div>

        <div className="card-soft p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-warm-600 mb-1.5">電子郵件</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-300" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="input-field pl-9"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-warm-600 mb-1.5">密碼</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-300" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input-field pl-9 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-300 hover:text-warm-500"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary py-3">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? '登入中…' : '登入'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
