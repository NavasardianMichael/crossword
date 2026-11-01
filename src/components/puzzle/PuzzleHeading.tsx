'use client'

import { useTranslations } from 'next-intl'
import type { PuzzleView } from '@constants/puzzle'
import { TOPIC_STYLES } from '@constants/topicStyles'
import { cn } from '@helpers/cn'

/**
 * "Crossword" with its topic and difficulty as stickers — the page's one `<h1>`. `compact`
 * (the game bar): two short lines, the topic and difficulty under the name.
 */
export const PuzzleHeading = ({ puzzle, compact }: { puzzle: PuzzleView; compact?: boolean }) => {
  const t = useTranslations()
  const topic = puzzle.topic === 'any' ? null : TOPIC_STYLES[puzzle.topic]
  const topicName = t(puzzle.topic === 'any' ? 'Topics.any' : `Topics.${puzzle.topic}.name`)
  const difficulty = t(`Difficulty.${puzzle.difficulty}`)

  if (compact)
    return (
      <div className='min-w-0'>
        <h1 className='truncate text-body leading-tight font-extrabold text-ink-900 sm:text-h3'>{t(`Formats.${puzzle.format}.name`)}</h1>
        <p className='flex min-w-0 items-center gap-1.5 text-caption font-bold text-ink-700'>
          <span aria-hidden className={cn('size-2.5 shrink-0 rounded-full', topic ? topic.iconTone : 'bg-ink-300')} />
          <span className='truncate'>
            {topicName} · {difficulty}
          </span>
        </p>
      </div>
    )

  return (
    <div className='flex min-w-0 flex-wrap items-center gap-2'>
      <h1 className='text-h3 font-extrabold text-ink-900'>{t(`Formats.${puzzle.format}.name`)}</h1>
      <span className={cn('rounded-full border-2 px-2.5 py-0.5 text-caption font-bold sm:px-3 sm:text-body-sm', topic ? topic.chip : 'border-line-strong bg-white')}>
        {topicName}
      </span>
      <span className='rounded-full border-2 border-line-strong bg-white px-2.5 py-0.5 text-caption font-bold sm:px-3 sm:text-body-sm'>
        {difficulty}
      </span>
    </div>
  )
}
