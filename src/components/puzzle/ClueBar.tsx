'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { usePlayStore } from '@store/puzzle/play/store'
import { cn } from '@helpers/cn'
import { activeWord } from '@helpers/puzzle/cursor'
import { IconButton } from '@components/ui/IconButton'
import { wordLabel } from './Grid'

/**
 * The active clue, always in full — on a phone it is the only readable copy of a scanword's
 * cell clue. Its text is the grid's `aria-describedby`, and the live region announces each new
 * word as the cursor reaches it. Tapping the clue turns the cursor; the arrows step through
 * the words.
 */
export const ClueBar = ({ className }: { className?: string }) => {
  const t = useTranslations('Play')
  const puzzle = usePlayStore.use.puzzle()
  const model = usePlayStore.use.model()
  const cursor = usePlayStore.use.cursor()
  const nextWord = usePlayStore.use.nextWord()
  const toggleDirection = usePlayStore.use.toggleDirection()

  if (!puzzle || !model) return null
  const id = activeWord(model, cursor)
  const word = puzzle.words[id]!

  return (
    <div className={cn('flex items-center gap-2 rounded-panel border-2 border-ink-900 bg-sun-100 p-1.5 shadow-chunky', className)}>
      <IconButton
        label={t('previousWord')}
        icon={<ChevronLeft aria-hidden className='size-5 rtl:-scale-x-100' />}
        onClick={() => nextWord(true)}
        tooltip={false}
        className='border-transparent bg-transparent'
      />
      <button
        type='button'
        onClick={toggleDirection}
        aria-label={t('toggleDirection')}
        className='min-w-0 flex-1 rounded-control px-2 py-1 text-start hover:bg-sun-200'
      >
        <span className='block text-caption font-bold tracking-wide text-ink-700 uppercase'>{wordLabel(t, puzzle, id)}</span>
        <span id='active-clue' aria-live='polite' lang={puzzle.locale} className='block font-display text-body leading-snug font-semibold text-ink-900 sm:text-h3'>
          {word.clue}
        </span>
      </button>
      <IconButton
        label={t('nextWord')}
        icon={<ChevronRight aria-hidden className='size-5 rtl:-scale-x-100' />}
        onClick={() => nextWord(false)}
        tooltip={false}
        className='border-transparent bg-transparent'
      />
    </div>
  )
}
