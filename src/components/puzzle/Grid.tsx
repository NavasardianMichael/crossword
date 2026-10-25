'use client'

import { type CSSProperties, useEffect, useRef } from 'react'
import { ArrowDown, ArrowRight, CornerDownRight, CornerRightDown } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { usePlayStore } from '@store/puzzle/play/store'
import { usePuzzleKeys } from '@hooks/usePuzzleKeys'
import { displayCell } from '@constants/alphabet'
import type { Arrow, PuzzleView } from '@constants/puzzle'
import { cn } from '@helpers/cn'
import { hasMark, MARK_LOCKED, MARK_REVEALED, MARK_WRONG } from '@helpers/puzzle/check'
import { activeWord } from '@helpers/puzzle/cursor'
import { cellPosition } from '@helpers/puzzle/model'

/**
 * The board, as an ARIA grid: one tab stop (roving tabindex on the cursor's cell), arrow keys
 * inside, every cell labelled with its position, its words and its state.
 *
 * Cells are tiles on the paper — rounded, inked, with a sticker edge — sized by the container
 * (`cqi` units), so the same markup fits a phone, a tablet and a desktop without measuring.
 * A cell's state never rests on colour alone: wrong letters are struck through, revealed ones
 * carry a corner flag, the cursor has a thick ring.
 */
export const ARROW_ICONS: Record<Arrow, typeof ArrowRight> = {
  right: ArrowRight,
  down: ArrowDown,
  downRight: CornerDownRight,
  rightDown: CornerRightDown,
}

/** Where each arrow sits on the clue cell's edge: right-pointing on the end edge, down-pointing on the bottom. */
export const ARROW_POSITION: Record<Arrow, string> = {
  right: 'inset-e-0 top-1/2 -translate-y-1/2 translate-x-1/2 rtl:-translate-x-1/2',
  rightDown: 'inset-e-0 top-1/2 -translate-y-1/2 translate-x-1/2 rtl:-translate-x-1/2',
  down: 'bottom-0 inset-s-1/2 translate-y-1/2 -translate-x-1/2 rtl:translate-x-1/2',
  downRight: 'bottom-0 inset-s-1/2 translate-y-1/2 -translate-x-1/2 rtl:translate-x-1/2',
}

/** Scanword filler tiles: pastel stickers, so empty space reads as decoration, not a hole. */
const STICKERS = [
  'bg-coral-100 [background-image:radial-gradient(var(--color-coral-200)_25%,transparent_26%)] [background-size:40%_40%]',
  'bg-teal-100 [background-image:radial-gradient(var(--color-teal-200)_25%,transparent_26%)] [background-size:50%_50%]',
  'bg-sun-100 [background-image:linear-gradient(45deg,var(--color-sun-200)_25%,transparent_25%,transparent_75%,var(--color-sun-200)_75%)] [background-size:50%_50%]',
  'bg-lavender-100 [background-image:radial-gradient(var(--color-lavender-200)_30%,transparent_31%)] [background-size:33%_33%]',
  'bg-mint-100 [background-image:linear-gradient(0deg,var(--color-mint-200)_20%,transparent_20%)] [background-size:100%_33%]',
  'bg-sky-100 [background-image:linear-gradient(90deg,var(--color-sky-200)_20%,transparent_20%)] [background-size:33%_100%]',
]

type GridProps = { className?: string; focusOnOpen?: boolean }

export const Grid = ({ className, focusOnOpen = false }: GridProps) => {
  const t = useTranslations('Play')
  const puzzle = usePlayStore.use.puzzle()
  const model = usePlayStore.use.model()
  const entries = usePlayStore.use.entries()
  const marks = usePlayStore.use.marks()
  const cursor = usePlayStore.use.cursor()
  const completedWord = usePlayStore.use.completedWord()
  const select = usePlayStore.use.select()
  const selectWord = usePlayStore.use.selectWord()
  const onKeyDown = usePuzzleKeys()
  const gridRef = useRef<HTMLDivElement>(null)

  // Focus follows the cursor — but only while the grid has focus, so typing in the clue list
  // or a dialog is never stolen.
  useEffect(() => {
    const grid = gridRef.current
    if (!grid || !grid.contains(document.activeElement)) return
    grid.querySelector<HTMLElement>(`[data-cell="${cursor.cell}"]`)?.focus({ preventScroll: true })
  }, [cursor.cell])

  // With a physical keyboard, a new puzzle is ready to type into at once.
  const puzzleId = puzzle?.id
  useEffect(() => {
    if (!focusOnOpen || !puzzleId) return
    gridRef.current?.querySelector<HTMLElement>('[role="gridcell"][tabindex="0"]')?.focus({ preventScroll: true })
  }, [focusOnOpen, puzzleId])

  if (!puzzle || !model) return null

  const word = activeWord(model, cursor)
  const wordCells = new Set(model.wordCells[word])
  const completedCells = completedWord !== null ? model.wordCells[completedWord] : undefined
  const rows = Array.from({ length: puzzle.height }, (_, row) => row)

  const labelFor = (cell: number): string => {
    const { row, col } = cellPosition(cell, puzzle.width)
    const words = [model.across[cell]!, model.down[cell]!]
      .filter((id) => id >= 0)
      .map((id) => wordLabel(t, puzzle, id, model.wordCells[id]!.indexOf(cell) + 1))
      .join('; ')
    const entry = entries[cell]
    const state = [
      hasMark(marks, cell, MARK_WRONG) && t('cell.wrong'),
      hasMark(marks, cell, MARK_REVEALED) && t('cell.revealed'),
    ]
      .filter(Boolean)
      .join(', ')
    const letter = entry ? displayCell(entry, puzzle.locale) : t('cell.empty')
    return [t('cell.position', { row, col }), words, letter, state].filter(Boolean).join('. ')
  }

  return (
    <div
      ref={gridRef}
      role='grid'
      aria-label={t('gridLabel')}
      aria-rowcount={puzzle.height}
      aria-colcount={puzzle.width}
      aria-describedby='active-clue'
      lang={puzzle.locale}
      className={cn('@container mx-auto w-full select-none', className)}
      style={{ '--cols': puzzle.width, aspectRatio: `${puzzle.width} / ${puzzle.height}` } as CSSProperties}
    >
      <div className='grid h-full gap-[0.6cqi]' style={{ gridTemplateRows: `repeat(${puzzle.height}, minmax(0, 1fr))` }}>
        {rows.map((row) => (
          <div
            key={row}
            role='row'
            aria-rowindex={row + 1}
            className='grid gap-[0.6cqi]'
            style={{ gridTemplateColumns: `repeat(${puzzle.width}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: puzzle.width }, (_, col) => {
              const cell = row * puzzle.width + col
              const view = puzzle.cells[cell]!

              if (view.k === 'B') {
                return puzzle.format === 'scanword' ? (
                  <div
                    key={col}
                    role='gridcell'
                    aria-hidden
                    className={cn('rounded-[18%] border border-line-subtle', STICKERS[(view.d ?? 0) % STICKERS.length])}
                  />
                ) : (
                  <div key={col} role='gridcell' aria-hidden />
                )
              }

              if (view.k === 'C') {
                const highlighted = view.clues.includes(word)
                return (
                  <div
                    key={col}
                    role='gridcell'
                    aria-colindex={col + 1}
                    aria-label={view.clues.map((id) => t('cell.clue', { clue: puzzle.words[id]!.clue })).join('; ')}
                    tabIndex={-1}
                    onClick={() => {
                      // A second tap on a two-clue cell switches to its other clue.
                      const next = view.clues.length > 1 && view.clues[0] === word ? view.clues[1]! : view.clues[0]!
                      selectWord(next)
                    }}
                    onKeyDown={onKeyDown}
                    className={cn(
                      'relative flex cursor-pointer flex-col overflow-visible rounded-[14%] border-[0.35cqi] text-center leading-[1.05] font-bold transition-colors',
                      highlighted ? 'border-teal-700 bg-teal-200' : 'border-teal-600/60 bg-teal-100 hover:bg-teal-200/70'
                    )}
                    style={{ fontSize: 'calc(100cqi / var(--cols) * 0.15)' }}
                  >
                    {view.clues.map((id, index) => {
                      const clueWord = puzzle.words[id]!
                      const Icon = ARROW_ICONS[clueWord.arrow!]
                      return (
                        <span
                          key={id}
                          className={cn(
                            'relative flex flex-1 items-center justify-center px-[6%] wrap-break-word hyphens-auto text-ink-900',
                            index > 0 && 'border-t border-teal-600/40'
                          )}
                        >
                          <span className='line-clamp-3'>{clueWord.clue}</span>
                          <Icon
                            aria-hidden
                            className={cn('absolute z-10 size-[0.75em] min-h-2 min-w-2 text-teal-700', ARROW_POSITION[clueWord.arrow!])}
                            strokeWidth={3.5}
                          />
                        </span>
                      )
                    })}
                  </div>
                )
              }

              const entry = entries[cell]
              const isCursor = cell === cursor.cell
              const inWord = wordCells.has(cell)
              const wrong = hasMark(marks, cell, MARK_WRONG)
              const revealed = hasMark(marks, cell, MARK_REVEALED)
              const locked = hasMark(marks, cell, MARK_LOCKED)
              const waveIndex = completedCells?.indexOf(cell) ?? -1

              return (
                <div
                  key={col}
                  role='gridcell'
                  aria-colindex={col + 1}
                  aria-selected={isCursor}
                  aria-label={labelFor(cell)}
                  data-cell={cell}
                  tabIndex={isCursor ? 0 : -1}
                  onClick={() => select(cell)}
                  onKeyDown={onKeyDown}
                  className={cn(
                    'relative flex cursor-pointer items-center justify-center rounded-[16%] border-[0.35cqi] border-ink-900 font-display font-bold text-ink-900 shadow-[0_0.4cqi_0_0_var(--color-ink-300)] outline-none transition-colors duration-150',
                    !inWord && !wrong && (locked && !revealed ? 'bg-mint-100' : 'bg-white'),
                    inWord && !isCursor && 'bg-sun-200',
                    isCursor && 'z-10 bg-sun-400 ring-[0.8cqi] ring-ink-900 ring-offset-0',
                    wrong && !isCursor && 'bg-rose-100',
                    wrong && 'cell-strike',
                    revealed && 'cell-flag text-lavender-700',
                    'focus-visible:ring-[0.8cqi] focus-visible:ring-sky-500'
                  )}
                  style={{ fontSize: 'calc(100cqi / var(--cols) * 0.52)' }}
                >
                  {puzzle.format === 'classic' && view.n !== undefined && (
                    <span
                      aria-hidden
                      className='absolute inset-s-[8%] top-[4%] leading-none font-sans font-bold text-ink-700'
                      style={{ fontSize: 'calc(100cqi / var(--cols) * 0.22)' }}
                    >
                      {view.n}
                    </span>
                  )}
                  {entry && (
                    <span
                      key={entry}
                      aria-hidden
                      className={cn('leading-none', waveIndex >= 0 ? 'animate-wave' : 'animate-pop')}
                      style={waveIndex >= 0 ? { animationDelay: `${waveIndex * 45}ms` } : undefined}
                    >
                      {displayCell(entry, puzzle.locale)}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

type Translate = ReturnType<typeof useTranslations<'Play'>>

/** "12 across, letter 2 of 7" for a classic word; "across, letter 2 of 7" for a scanword one. */
export const wordLabel = (t: Translate, puzzle: PuzzleView, wordId: number, letter?: number): string => {
  const word = puzzle.words[wordId]!
  const name = word.number !== undefined ? t('wordNumbered', { number: word.number, dir: word.dir }) : t('wordDirection', { dir: word.dir })
  return letter === undefined
    ? t('wordLength', { name, length: word.length })
    : t('wordLetter', { name, letter, length: word.length })
}
