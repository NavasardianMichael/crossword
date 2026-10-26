import type { ReactNode } from 'react'
import { cn } from '@helpers/cn'

export type SectionProps = {
  id?: string
  eyebrow?: ReactNode
  title?: ReactNode
  subtitle?: ReactNode
  /** Heading level: page sections are h2, the page title itself is `PageHeader`'s h1. */
  as?: 'h2' | 'h3'
  align?: 'start' | 'center'
  className?: string
  children?: ReactNode
}

/** A titled block of a page, on the shared container width. */
export const Section = ({ id, eyebrow, title, subtitle, as: Heading = 'h2', align = 'start', className, children }: SectionProps) => (
  <section id={id} aria-labelledby={title && id ? `${id}-title` : undefined} className={cn('container-page py-12 sm:py-16', className)}>
    {(title || eyebrow) && (
      <header className={cn('mb-8 flex flex-col gap-3', align === 'center' && 'items-center text-center')}>
        {eyebrow && <p className='eyebrow'>{eyebrow}</p>}
        {title && (
          <Heading id={id ? `${id}-title` : undefined} className='text-h2 font-extrabold text-ink-900'>
            {title}
          </Heading>
        )}
        {subtitle && <p className={cn('max-w-2xl text-ink-700', align === 'center' && 'mx-auto')}>{subtitle}</p>}
      </header>
    )}
    {children}
  </section>
)
