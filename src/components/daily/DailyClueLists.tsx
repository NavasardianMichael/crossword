import { getTranslations } from 'next-intl/server'
import type { DailyAnswer, DailyClue } from '@api/puzzles/types'
import { displayCell } from '@constants/alphabet'
import type { Direction, Locale } from '@constants/puzzle'

/**
 * Numbered Across and Down clues as text — the part of the daily page crawlers read. Today's
 * carry the answer length; yesterday's (`answers`) carry the answer, printed in grid capitals.
 */
type Props = { locale: Locale } & ({ words: DailyClue[]; answers?: never } | { answers: DailyAnswer[]; words?: never })

const DIRECTIONS: Direction[] = ['across', 'down']

export const DailyClueLists = async ({ locale, words, answers }: Props) => {
  const t = await getTranslations('Daily')
  const items = words ?? answers
  return (
    <div className='grid gap-8 sm:grid-cols-2' lang={locale}>
      {DIRECTIONS.map((dir) => (
        <section key={dir} aria-label={t(dir)}>
          <h3 className='mb-3 font-display text-h3 font-extrabold text-ink-900'>{t(dir)}</h3>
          <ol className='flex flex-col gap-2'>
            {items
              .filter((word) => word.dir === dir)
              .map((word) => (
                <li key={`${dir}-${word.number}`} className='flex gap-3'>
                  <span className='w-7 shrink-0 text-end font-display font-extrabold text-teal-700'>{word.number}</span>
                  <span className='text-ink-800'>
                    {word.clue}{' '}
                    {'answer' in word ? (
                      <strong className='font-display tracking-wider text-ink-900'>
                        — {word.answer.map((cell) => displayCell(cell, locale)).join('')}
                      </strong>
                    ) : (
                      <span className='text-body-sm text-ink-500'>({word.length})</span>
                    )}
                  </span>
                </li>
              ))}
          </ol>
        </section>
      ))}
    </div>
  )
}
