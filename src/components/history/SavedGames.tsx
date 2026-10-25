'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, PlayCircle } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { puzzlePath } from '@constants/routes'
import { TOPIC_STYLES } from '@constants/topicStyles'
import { cn } from '@helpers/cn'
import { listSavedGames, type SavedGame } from '@helpers/offline/db'
import { formatDuration } from '@components/puzzle/Timer'
import { AppLink } from '@components/ui/bare/AppLink'

/**
 * Puzzles on this device, most recent first — they open offline. Read after mount (IndexedDB
 * does not exist on the server), so the server render shows nothing here.
 */
type SavedGamesProps = {
  limit?: number
  className?: string
  emptyText?: string
  /** A heading above the list, shown only when there is something to list (home's "Continue"). */
  title?: string
}

const progressOf = ({ puzzle, progress }: SavedGame): number => {
  const letters = puzzle.solution.filter(Boolean).length
  const filled = progress ? progress.entries.filter(Boolean).length : 0
  return letters ? Math.round((filled / letters) * 100) : 0
}

export const SavedGames = ({ limit, className, emptyText, title }: SavedGamesProps) => {
  const t = useTranslations()
  const locale = useLocale()
  const [games, setGames] = useState<SavedGame[] | null>(null)

  useEffect(() => {
    let cancelled = false
    void listSavedGames().then((list) => {
      if (!cancelled) setGames(list)
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (!games) return null
  const shown = games.filter(({ puzzle }) => puzzle.locale === locale).slice(0, limit)
  if (!shown.length) return emptyText ? <p className='text-ink-700'>{emptyText}</p> : null

  return (
    <div className={className}>
      {title && <h2 className='mb-4 text-h3 font-extrabold'>{title}</h2>}
      <ul className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
      {shown.map((game) => {
        const { puzzle, progress } = game
        const solved = progress?.status === 'solved'
        const percent = progressOf(game)
        const style = puzzle.topic === 'any' ? null : TOPIC_STYLES[puzzle.topic]
        return (
          <li key={puzzle.id}>
            <AppLink
              href={puzzlePath(puzzle.id)}
              className={cn(
                'flex items-center gap-3 rounded-panel border-2 p-4 transition-all hover:-translate-y-0.5 hover:shadow-chunky',
                style?.tile ?? 'border-line-strong bg-white'
              )}
            >
              {solved ? (
                <CheckCircle2 aria-hidden className='size-9 shrink-0 text-mint-600' />
              ) : (
                <PlayCircle aria-hidden className='size-9 shrink-0 text-coral-600' />
              )}
              <span className='min-w-0 flex-1'>
                <span className='block truncate font-display font-bold text-ink-900'>
                  {t(`Formats.${puzzle.format}.name`)} · {t(puzzle.topic === 'any' ? 'Topics.any' : `Topics.${puzzle.topic}.name`)}
                </span>
                <span className='block text-body-sm text-ink-700'>
                  {solved
                    ? t('History.solvedIn', { time: formatDuration(progress?.elapsedMs ?? 0) })
                    : t('History.progress', { percent })}
                </span>
                <span aria-hidden className='mt-2 block h-1.5 overflow-hidden rounded-full bg-white/70'>
                  <span className='block h-full rounded-full bg-coral-500' style={{ width: `${solved ? 100 : percent}%` }} />
                </span>
              </span>
            </AppLink>
          </li>
        )
      })}
      </ul>
    </div>
  )
}
