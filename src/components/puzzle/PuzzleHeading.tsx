'use client'

import { useTranslations } from 'next-intl'
import type { PuzzleView } from '@constants/puzzle'
import { TOPIC_STYLES } from '@constants/topicStyles'
import { cn } from '@helpers/cn'

/** "Crossword" with its topic and difficulty as stickers — the page's one `<h1>`. */
export const PuzzleHeading = ({ puzzle }: { puzzle: PuzzleView }) => {
  const t = useTranslations()
  const topic = puzzle.topic === 'any' ? null : TOPIC_STYLES[puzzle.topic]

  return (
    <div className='flex min-w-0 flex-wrap items-center gap-2'>
      <h1 className='text-h3 font-extrabold text-ink-900'>{t(`Formats.${puzzle.format}.name`)}</h1>
      <span className={cn('rounded-full border-2 px-2.5 py-0.5 text-caption font-bold sm:px-3 sm:text-body-sm', topic ? topic.chip : 'border-line-strong bg-white')}>
        {t(puzzle.topic === 'any' ? 'Topics.any' : `Topics.${puzzle.topic}.name`)}
      </span>
      <span className='rounded-full border-2 border-line-strong bg-white px-2.5 py-0.5 text-caption font-bold sm:px-3 sm:text-body-sm'>
        {t(`Difficulty.${puzzle.difficulty}`)}
      </span>
    </div>
  )
}
