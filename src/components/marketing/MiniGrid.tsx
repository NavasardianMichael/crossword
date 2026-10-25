import { ArrowDown, ArrowRight } from 'lucide-react'
import { cn } from '@helpers/cn'

/**
 * A tiny decorative grid for the format cards: a classic crossing, or a scanword corner with
 * clue cells and arrows. Purely illustrative, so hidden from assistive tech.
 */
const CLASSIC = ['.L....', 'LLLLL.', '.L..L.', '.LLLLL', '.L..L.', '....L.']
const SCANWORD = ['CCCC', 'CLLL', 'CLBL', 'CLLL']

export const MiniGrid = ({ format, className }: { format: 'classic' | 'scanword'; className?: string }) => {
  const rows = format === 'classic' ? CLASSIC : SCANWORD
  return (
    <div aria-hidden className={cn('grid gap-1', className)} style={{ gridTemplateColumns: `repeat(${rows[0]!.length}, 1fr)` }}>
      {rows.flatMap((row, r) =>
        [...row].map((kind, c) => (
          <span
            key={`${r}-${c}`}
            className={cn(
              'relative aspect-square rounded-[22%]',
              kind === 'L' && 'border-2 border-ink-900 bg-white shadow-[0_2px_0_0_var(--color-ink-300)]',
              kind === 'L' && (r + c) % 5 === 0 && 'bg-sun-300',
              kind === 'C' && 'border-2 border-teal-600 bg-teal-100',
              kind === 'B' && 'bg-coral-100'
            )}
          >
            {kind === 'C' && r === 0 && c > 0 && <ArrowDown className='absolute inset-x-0 -bottom-1.5 mx-auto size-3 text-teal-700' />}
            {kind === 'C' && c === 0 && r > 0 && <ArrowRight className='absolute inset-y-0 -inset-e-1.5 my-auto size-3 text-teal-700' />}
          </span>
        ))
      )}
    </div>
  )
}
