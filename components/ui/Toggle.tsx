'use client'

type Props = {
  checked: boolean
  onChange: (val: boolean) => void
  label?: string
  size?: 'sm' | 'md'
}

export function Toggle({ checked, onChange, label, size = 'md' }: Props) {
  const s = size === 'sm'
    ? { track: 'w-8 h-4', thumb: 'w-3 h-3', translate: 'translate-x-4' }
    : { track: 'w-10 h-5', thumb: 'w-4 h-4', translate: 'translate-x-5' }

  return (
    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex flex-shrink-0 ${s.track} rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2
          ${checked ? 'bg-coral-400' : 'bg-cream-300 dark:bg-warm-600'}`}
      >
        <span
          className={`${s.thumb} bg-white rounded-full shadow-sm absolute top-0.5 left-0.5 transition-transform duration-200
            ${checked ? s.translate : 'translate-x-0'}`}
        />
      </button>
      {label && <span className="text-sm text-warm-700 dark:text-warm-200">{label}</span>}
    </label>
  )
}
