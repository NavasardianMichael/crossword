'use client'

import { useEffect, useState } from 'react'
import { PlayCircle } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { puzzlePath, ROUTES } from '@constants/routes'
import { TOPIC_STYLES } from '@constants/topicStyles'
import { cn } from '@helpers/cn'
import { listSavedGames, type SavedGame } from '@helpers/offline/db'
import { AppLink } from '@components/ui/bare/AppLink'

/**
 * Unfinished puzzles on this device, most recently played first — opening one restores the
 * letters, cursor and clock. Read after mount (IndexedDB does not exist on the server), so
 * the server render shows nothing here. Finished puzzles and ones never opened stay out.
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
  const filled = progress?.entries.filter((entry, cell) => entry && puzzle.solution[cell]).length ?? 0
  return letters ? Math.round((filled / letters) * 100) : 0
}

const unfinished = (game: SavedGame): boolean => game.progress?.status === 'playing'

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
  const pending = games.filter((game) => game.puzzle.locale === locale && unfinished(game))
  const shown = pending.slice(0, limit)
  if (!shown.length) return emptyText ? <p className='text-ink-700'>{emptyText}</p> : null

  return (
    <div className={className}>
      {title && <h2 className='mb-4 text-h3 font-extrabold'>{title}</h2>}
      <ul className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
        {shown.map((game) => {
          const { puzzle } = game
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
                <PlayCircle aria-hidden className='size-9 shrink-0 text-coral-600' />
                <span className='min-w-0 flex-1'>
                  <span className='block truncate font-display font-bold text-ink-900'>
                    {t(`Formats.${puzzle.format}.name`)} · {t(puzzle.topic === 'any' ? 'Topics.any' : `Topics.${puzzle.topic}.name`)}
                  </span>
                  <span className='block text-body-sm text-ink-700'>
                    {t('History.detail', {
                      percent,
                      difficulty: t(`Difficulty.${puzzle.difficulty}`),
                      size: `${puzzle.width}×${puzzle.height}`,
                    })}
                  </span>
                  <span aria-hidden className='mt-2 block h-1.5 overflow-hidden rounded-full bg-white/70'>
                    <span className='block h-full rounded-full bg-coral-500' style={{ width: `${percent}%` }} />
                  </span>
                </span>
              </AppLink>
            </li>
          )
        })}
      </ul>
      {limit !== undefined && pending.length > limit && (
        <p className='mt-4'>
          <AppLink href={ROUTES.history} className='font-bold text-teal-700 underline-offset-4 hover:text-coral-700 hover:underline'>
            {t('History.seeAll')}
          </AppLink>
        </p>
      )}
    </div>
  )
}
