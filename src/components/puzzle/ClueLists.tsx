'use client'

import { useEffect, useRef } from 'react'
import { Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { usePlayStore } from '@store/puzzle/play/store'
import type { Direction } from '@constants/puzzle'
import { cn } from '@helpers/cn'
import { isWordFull } from '@helpers/puzzle/check'
import { activeWord } from '@helpers/puzzle/cursor'

/**
 * Every clue as a list of buttons, Across and Down — the classic layout's main reading, and
 * for scanwords the accessible alternative to clues printed in cells. The active clue is
 * `aria-current` and scrolled into view; finished words are ticked (not only greyed).
 */
type ClueListsProps = {
  className?: string
  /** One column per direction side by side, or stacked. */
  layout?: 'columns' | 'stacked'
  /** Only one direction (the desktop three-column board renders one list on each side). */
  only?: Direction
  /** Called after a clue is chosen — the clue sheet closes itself. */
  onChoose?: () => void
}

export const ClueLists = ({ className, layout = 'stacked', only, onChoose }: ClueListsProps) => {
  const t = useTranslations('Play')
  const puzzle = usePlayStore.use.puzzle()
  const model = usePlayStore.use.model()
  const entries = usePlayStore.use.entries()
  const cursor = usePlayStore.use.cursor()
  const selectWord = usePlayStore.use.selectWord()
  const listRef = useRef<HTMLDivElement>(null)

  const current = model ? activeWord(model, cursor) : -1

  useEffect(() => {
    listRef.current?.querySelector('[aria-current="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [current])

  if (!puzzle || !model) return null

  const directions: Direction[] = only ? [only] : ['across', 'down']

  return (
    <div ref={listRef} className={cn(layout === 'columns' ? 'grid gap-6 sm:grid-cols-2' : 'flex flex-col gap-6', className)}>
      {directions.map((dir) => (
        <section key={dir} aria-labelledby={`clues-${dir}`}>
          <h2 id={`clues-${dir}`} className='mb-2 font-display text-h3 font-bold text-ink-900'>
            {t(dir === 'across' ? 'across' : 'down')}
          </h2>
          <ol className='flex flex-col gap-1' lang={puzzle.locale}>
            {puzzle.words.map((word, id) => {
              if (word.dir !== dir) return null
              const active = id === current
              const done = isWordFull(entries, model.wordCells[id]!)
              return (
                <li key={id}>
                  <button
                    type='button'
                    aria-current={active ? 'true' : undefined}
                    onClick={() => {
                      selectWord(id)
                      onChoose?.()
                      document.querySelector<HTMLElement>('[role="grid"] [tabindex="0"]')?.focus({ preventScroll: true })
                    }}
                    className={cn(
                      'flex min-h-11 w-full items-start gap-2.5 rounded-control border-2 px-3 py-2 text-start transition-colors',
                      active ? 'border-ink-900 bg-sun-200' : 'border-transparent hover:bg-cream-200',
                      done && !active && 'text-ink-500'
                    )}
                  >
                    {word.number !== undefined && (
                      <span className='min-w-6 font-display font-bold text-coral-700 tabular'>{word.number}</span>
                    )}
                    <span className='flex-1'>
                      {word.clue}
                      <span className='ms-1.5 text-caption whitespace-nowrap text-ink-500'>({word.length})</span>
                    </span>
                    {done && <Check aria-label={t('filled')} className='mt-1 size-4 shrink-0 text-mint-600' />}
                  </button>
                </li>
              )
            })}
          </ol>
        </section>
      ))}
    </div>
  )
}
