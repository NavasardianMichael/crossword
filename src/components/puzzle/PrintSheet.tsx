'use client'

import { type CSSProperties, useEffect, useState } from 'react'
import { createPortal, flushSync } from 'react-dom'
import { useTranslations } from 'next-intl'
import { usePlayStore } from '@store/puzzle/play/store'
import { localePath } from '@i18n/pathname'
import { displayCell } from '@constants/alphabet'
import type { Direction, PuzzleView } from '@constants/puzzle'
import { puzzlePath } from '@constants/routes'
import { cn } from '@helpers/cn'
import { absoluteUrl } from '@helpers/url'
import { ARROW_ICONS, ARROW_POSITION } from './Grid'

/**
 * The puzzle on paper: an ink-only sheet, portalled to `<body>` while the browser prints —
 * globals.css §12 hides everything else on paper, and the sheet on screen. A scanword keeps its
 * clues in the cells; a crossword gets its numbered lists under the grid. Optionally the
 * player's letters, and an answer key on a page of its own.
 *
 * It mounts only between `beforeprint` and `afterprint`, so the board doesn't render a second
 * grid on every keystroke. Ctrl+P prints it too, with the options last chosen.
 */
export type PrintOptions = { letters: boolean; answers: boolean }

export const BLANK_PRINT: PrintOptions = { letters: false, answers: false }

export const PrintSheet = ({ options }: { options: PrintOptions }) => {
  const t = useTranslations()
  const puzzle = usePlayStore.use.puzzle()
  const entries = usePlayStore.use.entries()
  const [printing, setPrinting] = useState(false)

  useEffect(() => {
    // Rendered synchronously: the browser lays the page out for paper right after this event.
    const before = () => flushSync(() => setPrinting(true))
    const after = () => setPrinting(false)
    window.addEventListener('beforeprint', before)
    window.addEventListener('afterprint', after)
    return () => {
      window.removeEventListener('beforeprint', before)
      window.removeEventListener('afterprint', after)
    }
  }, [])

  if (!printing || !puzzle) return null

  const ratio = puzzle.width / puzzle.height
  // A scanword fills the page; a crossword leaves room for its clue lists.
  const width =
    puzzle.format === 'scanword' ? `min(100%, ${230 * ratio}mm)` : `min(100%, 125mm, ${150 * ratio}mm)`
  const url = absoluteUrl(localePath(puzzle.locale, puzzlePath(puzzle.id)))

  return createPortal(
    <div className='print-sheet text-ink-900'>
      <header className='mb-[4mm] flex items-baseline gap-[3mm] border-b-[0.4mm] border-ink-900 pb-[2mm]'>
        <span className='font-display text-[16pt] font-extrabold'>{t(`Formats.${puzzle.format}.name`)}</span>
        <span className='text-[10pt]'>
          {t(puzzle.topic === 'any' ? 'Topics.any' : `Topics.${puzzle.topic}.name`)} · {t(`Difficulty.${puzzle.difficulty}`)}
        </span>
        <span className='ms-auto font-display text-[10pt] font-bold'>{t('Common.appName')}</span>
      </header>
      <PrintGrid puzzle={puzzle} width={width} letters={options.letters ? entries : undefined} />
      {puzzle.format === 'classic' && <PrintClues puzzle={puzzle} />}
      <p className='mt-[4mm] text-[8pt] text-ink-700'>{t('Play.print.playOnline', { url })}</p>
      {options.answers && (
        <section className='break-before-page'>
          <h2 className='mb-[4mm] font-display text-[14pt] font-bold'>{t('Play.print.answersTitle')}</h2>
          <PrintGrid puzzle={puzzle} width={`min(100%, 120mm, ${170 * ratio}mm)`} letters={puzzle.solution} answerKey />
        </section>
      )}
    </div>,
    document.body
  )
}

type PrintGridProps = {
  puzzle: PuzzleView
  /** A CSS width; cells, letters and clues scale with it. */
  width: string
  letters?: string[]
  /** The solved grid: clue cells stay shaded but empty, so the key fits on half a page. */
  answerKey?: boolean
}

const PrintGrid = ({ puzzle, width, letters, answerKey = false }: PrintGridProps) => (
  <div lang={puzzle.locale} className='@container mx-auto break-inside-avoid' style={{ '--cols': puzzle.width, width } as CSSProperties}>
    <div
      className='grid'
      style={{
        aspectRatio: `${puzzle.width} / ${puzzle.height}`,
        gridTemplateColumns: `repeat(${puzzle.width}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${puzzle.height}, minmax(0, 1fr))`,
      }}
    >
      {puzzle.cells.map((view, cell) => {
        if (view.k === 'B') return <div key={cell} className={cn(puzzle.format === 'scanword' && 'print-cell print-filler')} />

        if (view.k === 'C') {
          return (
            <div
              key={cell}
              className='print-cell print-shade relative flex flex-col text-center leading-[1.05] font-bold'
              style={{ fontSize: 'calc(100cqi / var(--cols) * 0.13)' }}
            >
              {!answerKey &&
                view.clues.map((id, index) => {
                  const word = puzzle.words[id]!
                  const Icon = ARROW_ICONS[word.arrow!]
                  return (
                    <span
                      key={id}
                      className={cn(
                        'relative flex flex-1 items-center justify-center px-[9%] hyphens-auto',
                        index > 0 && 'border-t-[0.2mm] border-ink-900'
                      )}
                    >
                      {/* `anywhere`, not `break-word`: a long word with no hyphenation dictionary
                          (Armenian) must still break rather than spill into the next cell. */}
                      <span className='min-w-0 wrap-anywhere'>{word.clue}</span>
                      <Icon aria-hidden className={cn('absolute z-10 size-[1.5em]', ARROW_POSITION[word.arrow!])} strokeWidth={3} />
                    </span>
                  )
                })}
            </div>
          )
        }

        const letter = letters?.[cell]
        return (
          <div
            key={cell}
            className='print-cell relative flex items-center justify-center font-display font-bold'
            style={{ fontSize: 'calc(100cqi / var(--cols) * 0.5)' }}
          >
            {puzzle.format === 'classic' && view.n !== undefined && (
              <span
                className='absolute inset-s-[6%] top-[3%] leading-none font-sans'
                style={{ fontSize: 'calc(100cqi / var(--cols) * 0.24)' }}
              >
                {view.n}
              </span>
            )}
            {letter && <span className='leading-none'>{displayCell(letter, puzzle.locale)}</span>}
          </div>
        )
      })}
    </div>
  </div>
)

const PrintClues = ({ puzzle }: { puzzle: PuzzleView }) => {
  const t = useTranslations('Play')
  return (
    <div className='mt-[5mm] columns-2 gap-[8mm] text-[9pt] leading-snug'>
      {(['across', 'down'] as Direction[]).map((dir) => (
        <section key={dir} className='mb-[3mm]'>
          <h2 className='mb-[1mm] font-display text-[11pt] font-bold break-after-avoid'>{t(dir)}</h2>
          <ol lang={puzzle.locale}>
            {puzzle.words
              .filter((word) => word.dir === dir)
              .map((word) => (
                <li key={word.id} className='mb-[0.8mm] flex gap-[1.5mm] break-inside-avoid'>
                  <span className='min-w-[5mm] font-bold tabular'>{word.number}</span>
                  <span>
                    {word.clue} <span className='whitespace-nowrap text-ink-700'>({word.length})</span>
                  </span>
                </li>
              ))}
          </ol>
        </section>
      ))}
    </div>
  )
}
