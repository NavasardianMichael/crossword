'use client'

import { useRef } from 'react'
import { Delete, Repeat } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { usePlayStore } from '@store/puzzle/play/store'
import { displayCell, OPEN_LOCALES } from '@constants/alphabet'
import { KEYBOARD_ROWS } from '@constants/keyboards'
import { cn } from '@helpers/cn'

/**
 * The language's own keyboard, for touch screens: focusing a grid cell never opens the OS
 * keyboard, which would cover half the grid and might not even have the right alphabet.
 *
 * Keys are buttons that keep focus where it is (`preventDefault` on pointer down), at least
 * 44 px tall. Letters share the row evenly and may narrow (12 keys still fit a 320 px phone);
 * Erase and Direction keep a fixed minimum, and a row longer than `MAX_ROW_KEYS` is split in
 * two rather than scrolled. Armenian `ու` is one key, because it is one cell; `և` sits where
 * the Armenian layout's `7` key types it.
 */
const MAX_ROW_KEYS = 12

const fitRows = (rows: readonly (readonly string[])[]): string[][] =>
  rows.flatMap((row) => {
    if (row.length <= MAX_ROW_KEYS) return [[...row]]
    const half = Math.ceil(row.length / 2)
    return [row.slice(0, half), row.slice(half)]
  })

export const OnScreenKeyboard = ({ className }: { className?: string }) => {
  const t = useTranslations('Play')
  const puzzle = usePlayStore.use.puzzle()
  const type = usePlayStore.use.type()
  const erase = usePlayStore.use.erase()
  const toggleDirection = usePlayStore.use.toggleDirection()
  const busy = useRef(false)
  const commit = (text: string) => {
    const value = text.normalize('NFC').replace(/\s+/g, '')
    if (!value || busy.current) return
    busy.current = true
    for (const char of value) type(char)
    queueMicrotask(() => {
      busy.current = false
    })
  }

  if (!puzzle) return null
  const rows = fitRows(KEYBOARD_ROWS[puzzle.locale])
  const keyClass =
    'flex h-11 min-w-0 flex-1 items-center justify-center rounded-[10px] border-2 border-ink-900 bg-white font-display text-body font-bold text-ink-900 shadow-[0_3px_0_0_var(--color-ink-300)] active:translate-y-[2px] active:bg-sun-200 active:shadow-none sm:h-12 sm:text-h3'

  return (
    <div
      role='group'
      aria-label={t('keyboard')}
      lang={puzzle.locale}
      dir='ltr'
      className={cn('flex flex-col gap-1.5 rounded-t-panel border-t-2 border-ink-900 bg-cream-200 px-1.5 pt-2 pb-[max(0.5rem,var(--safe-bottom))]', className)}
    >
      {OPEN_LOCALES.has(puzzle.locale) && (
        <input
          lang={puzzle.locale}
          dir='auto'
          aria-label={t('ime')}
          placeholder={t('ime')}
          autoCapitalize='off'
          autoCorrect='off'
          spellCheck={false}
          className='mx-1 h-11 rounded-[10px] border-2 border-ink-900 bg-white px-3 font-display text-body font-bold text-ink-900 outline-none focus:bg-sun-100'
          onCompositionEnd={(event) => {
            commit(event.data)
            event.currentTarget.value = ''
          }}
          onInput={(event) => {
            const native = event.nativeEvent
            if (!(native instanceof InputEvent) || native.isComposing || native.inputType === 'insertCompositionText') return
            commit(event.currentTarget.value)
            event.currentTarget.value = ''
          }}
        />
      )}
      {rows.map((row, index) => (
        <div key={index} className='flex gap-1'>
          {index === rows.length - 1 && (
            <button
              type='button'
              aria-label={t('toggleDirection')}
              onPointerDown={(event) => event.preventDefault()}
              onClick={toggleDirection}
              className={cn(keyClass, 'min-w-10 flex-[1.5] bg-teal-100')}
            >
              <Repeat aria-hidden className='size-5' />
            </button>
          )}
          {row.map((token) => (
            <button
              key={token}
              type='button'
              onPointerDown={(event) => event.preventDefault()}
              onClick={() => type(token)}
              className={cn(keyClass, token.length > 1 && 'text-body-sm sm:text-body')}
            >
              {displayCell(token, puzzle.locale)}
            </button>
          ))}
          {index === rows.length - 1 && (
            <button
              type='button'
              aria-label={t('erase')}
              onPointerDown={(event) => event.preventDefault()}
              onClick={erase}
              className={cn(keyClass, 'min-w-10 flex-[1.5] bg-coral-100')}
            >
              <Delete aria-hidden className='size-5 rtl:-scale-x-100' />
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
