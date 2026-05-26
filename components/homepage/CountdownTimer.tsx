'use client'

import { useEffect, useState } from 'react'
import { getTimeRemaining } from '@/lib/utils'

type Props = { deadline: string }

export function CountdownTimer({ deadline }: Props) {
  const [remaining, setRemaining] = useState(getTimeRemaining(deadline))

  useEffect(() => {
    const timer = setInterval(() => {
      const r = getTimeRemaining(deadline)
      setRemaining(r)
      if (!r) clearInterval(timer)
    }, 1000)
    return () => clearInterval(timer)
  }, [deadline])

  if (!remaining) {
    return (
      <span className="text-white text-xs">
        已結束
      </span>
    )
  }

  const units = [
    { label: '天', value: remaining.days },
    { label: '時', value: remaining.hours },
    { label: '分', value: remaining.minutes },
    { label: '秒', value: remaining.seconds },
  ]

  

  return (
    <div className={`flex items-center gap-1 text-xs font-medium ${isUrgent ? 'text-coral-500' : 'text-warm-500 dark:text-warm-300'}`}>
      
      <span>倒數</span>
      {units.filter(u => u.value > 0 || (u.label === '分' || u.label === '秒')).slice(0, 3).map(({ label, value }) => (
        <span key={label} className={`inline-flex items-center gap-0.5 ${isUrgent ? 'bg-white/20 text-white' : 'bg-white/20 text-white'} px-1.5 py-0.5 rounded`}>
          <span className="tabular-nums font-bold">{String(value).padStart(2, '0')}</span>
          <span className="opacity-70">{label}</span>
        </span>
      ))}
    </div>
  )
}
