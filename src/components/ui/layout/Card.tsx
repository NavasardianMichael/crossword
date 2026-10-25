import type { HTMLAttributes } from 'react'
import { cn } from '@helpers/cn'

export type CardProps = HTMLAttributes<HTMLDivElement> & { padded?: boolean }

export const Card = ({ padded = true, className, ...rest }: CardProps) => (
  <div className={cn('panel', padded && 'p-5 sm:p-6', className)} {...rest} />
)
