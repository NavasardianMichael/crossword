'use client'

import { Clock } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { elapsedOf, usePlayStore } from '@store/puzzle/play/store'
import { useNow } from '@hooks/useNow'
import { cn } from '@helpers/cn'

export const formatDuration = (ms: number): string => {
  const total = Math.floor(ms / 1000)
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = total % 60
  const pad = (value: number) => String(value).padStart(2, '0')
  return hours ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${minutes}:${pad(seconds)}`
}

/** The play clock. Paused while the tab is hidden; not a live region — it would talk every second. */
export const Timer = ({ className }: { className?: string }) => {
  const t = useTranslations('Play')
  const elapsedMs = usePlayStore.use.elapsedMs()
  const resumedAt = usePlayStore.use.resumedAt()
  const now = useNow(resumedAt !== null)
  const value = formatDuration(elapsedOf({ elapsedMs, resumedAt }, now))

  return (
    <span
      className={cn('inline-flex h-11 items-center gap-1.5 rounded-full bg-white px-3 font-display font-bold text-ink-900 tabular', className)}
      aria-label={t('time', { time: value })}
    >
      <Clock aria-hidden className='size-4 text-teal-700' />
      {value}
    </span>
  )
}
