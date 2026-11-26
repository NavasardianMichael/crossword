'use client'

import { useEffect, useState } from 'react'
import { Flame } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { STORAGE_KEYS } from '@constants/app'
import { loadProgress } from '@helpers/offline/db'

/**
 * Days in a row this device solved the daily crossword. A solved daily is found in the board's
 * saved progress; the days found are kept in localStorage, since the page only lists the last
 * week. A streak still counts until today ends, so an unsolved today does not break it yet.
 */
type Props = { today: string; dailies: { id: string; date: string }[] }

const DAY_MS = 24 * 60 * 60 * 1000
const KEPT_DAYS = 400

const readSolved = (): string[] => {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEYS.dailySolved) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter((day): day is string => typeof day === 'string') : []
  } catch {
    return []
  }
}

const writeSolved = (days: string[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.dailySolved, JSON.stringify(days.slice(-KEPT_DAYS)))
  } catch {
    // Private mode or storage full: the streak just is not remembered.
  }
}

const dayBefore = (day: string) => new Date(new Date(`${day}T00:00:00Z`).getTime() - DAY_MS).toISOString().slice(0, 10)

export const streakLength = (solved: ReadonlySet<string>, today: string): number => {
  let day = solved.has(today) ? today : dayBefore(today)
  let length = 0
  while (solved.has(day)) {
    length++
    day = dayBefore(day)
  }
  return length
}

export const DailyStreak = ({ today, dailies }: Props) => {
  const t = useTranslations('Daily')
  const [streak, setStreak] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const solved = new Set(readSolved())
      for (const { id, date } of dailies) {
        if ((await loadProgress(id))?.status === 'solved') solved.add(date)
      }
      if (cancelled) return
      writeSolved([...solved].sort())
      setStreak(streakLength(solved, today))
    })()
    return () => {
      cancelled = true
    }
  }, [today, dailies])

  if (streak === null) return null
  return (
    <p className='inline-flex items-center gap-2 rounded-full border-2 border-ink-900 bg-sun-200 px-4 py-1.5 font-display font-bold text-ink-900'>
      <Flame aria-hidden className='size-5 text-coral-600' />
      {t('streak', { count: streak })}
    </p>
  )
}
