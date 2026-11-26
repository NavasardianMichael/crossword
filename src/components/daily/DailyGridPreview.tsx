import type { CSSProperties } from 'react'
import type { DailyView } from '@api/puzzles/types'
import { getDirection } from '@i18n/config'
import type { Locale } from '@constants/puzzle'

/**
 * Today's grid as it starts: numbers and white cells, no letters. Server-rendered, so the page
 * shows the puzzle before any script runs; the board itself opens on its own page.
 */
type Props = { today: NonNullable<DailyView['today']>; locale: Locale; label: string }

export const DailyGridPreview = ({ today, locale, label }: Props) => (
  <div
    role='img'
    aria-label={label}
    dir={getDirection(locale)}
    className='@container mx-auto w-full max-w-md'
    style={{ aspectRatio: `${today.width} / ${today.height}` } as CSSProperties}
  >
    <div className='grid h-full gap-[0.6cqi]' style={{ gridTemplateColumns: `repeat(${today.width}, minmax(0, 1fr))` }}>
      {today.cells.map((cell, index) =>
        cell.k === 'L' ? (
          <span
            key={index}
            className='relative rounded-[14%] border-[0.3cqi] border-ink-900 bg-white'
            style={{ fontSize: `calc(100cqi / ${today.width} * 0.3)` }}
          >
            {cell.n !== undefined && <span className='absolute inset-s-[8%] top-[2%] leading-none font-bold text-ink-700'>{cell.n}</span>}
          </span>
        ) : (
          <span key={index} aria-hidden />
        )
      )}
    </div>
  </div>
)
