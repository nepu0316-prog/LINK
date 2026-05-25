'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Send, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'

export function EmailSubscribe() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      })
      if (res.ok) {
        setSubscribed(true)
        toast.success('訂閱成功！歡迎加入 🌿')
      } else {
        const data = await res.json()
        toast.error(data.error || '訂閱失敗，請再試一次')
      }
    } catch {
      toast.error('訂閱失敗，請再試一次')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-cream-100 to-coral-50 dark:from-warm-800 dark:to-warm-700
                 rounded-3xl p-6 border border-cream-300 dark:border-warm-600"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-2xl bg-coral-gradient flex items-center justify-center flex-shrink-0">
          <Mail className="w-5 h-5 text-coral-500" />
        </div>
        <div>
          <h3 className="font-bold text-warm-800 dark:text-cream-100">訂閱電子報</h3>
          <p className="text-xs text-warm-500 dark:text-warm-300 mt-0.5">
            第一手收到團購資訊、親子活動推薦 🌿
          </p>
        </div>
      </div>

      {subscribed ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 text-sage-500 bg-sage-50 dark:bg-sage-900/20 rounded-2xl p-4"
        >
          <CheckCircle2 className="w-5 h-5" />
          <p className="text-sm font-medium">感謝訂閱！我會定期分享好內容給你 💌</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2.5">
          <input
            type="text"
            placeholder="你的名字（可選）"
            value={name}
            onChange={e => setName(e.target.value)}
            className="input-field"
          />
          <input
            type="email"
            placeholder="輸入電子郵件"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="input-field"
          />
          <button
            type="submit"
            disabled={loading || !email}
            className="w-full btn-primary"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {loading ? '訂閱中…' : '訂閱電子報'}
          </button>
        </form>
      )}
    </motion.section>
  )
}
