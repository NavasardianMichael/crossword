import type { ReactNode } from 'react'
import { cn } from '@helpers/cn'

export type PageHeaderProps = {
  title: ReactNode
  subtitle?: ReactNode
  eyebrow?: ReactNode
  actions?: ReactNode
  className?: string
}

/** The page's single `<h1>`, with an optional row of actions. */
export const PageHeader = ({ title, subtitle, eyebrow, actions, className }: PageHeaderProps) => (
  <header className={cn('container-page flex flex-col gap-4 pt-10 pb-6 sm:pt-14', className)}>
    {eyebrow && <p className='eyebrow'>{eyebrow}</p>}
    <h1 className='text-h1 font-extrabold text-ink-900'>{title}</h1>
    {subtitle && <p className='max-w-3xl text-body text-ink-700 sm:text-h3 sm:font-normal'>{subtitle}</p>}
    {actions && <div className='flex flex-wrap gap-3'>{actions}</div>}
  </header>
)
