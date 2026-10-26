import type { ReactNode } from 'react'
import { cn } from '@helpers/cn'

/** Long-form copy (rules, legal) at a readable measure. */
export const Prose = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div
    className={cn(
      'container-page flex max-w-3xl flex-col gap-4 pb-16 text-ink-700',
      '[&_h2]:mt-6 [&_h2]:font-display [&_h2]:text-h3 [&_h2]:font-bold [&_h2]:text-ink-900',
      '[&_strong]:text-ink-900 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2',
      className
    )}
  >
    {children}
  </div>
)
