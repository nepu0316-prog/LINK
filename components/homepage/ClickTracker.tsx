'use client'

import { useCallback } from 'react'

type Props = {
  itemType: 'link' | 'product' | 'video'
  itemId: string
  children: React.ReactNode
}

export function ClickTracker({ itemType, itemId, children }: Props) {
  const track = useCallback(() => {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        item_type: itemType,
        item_id: itemId,
        referrer: document.referrer,
        user_agent: navigator.userAgent,
      }),
    }).catch(() => {})
  }, [itemType, itemId])

  return (
    <div onClick={track} className="contents">
      {children}
    </div>
  )
}
