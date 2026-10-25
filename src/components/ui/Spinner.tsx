'use client'

import { Spin } from 'antd'
import { cn } from '@helpers/cn'

export type SpinnerProps = { size?: 'sm' | 'md' | 'lg'; className?: string; label?: string }

/** antd's `Spin`. Decorative unless a `label` is given; a busy button announces itself via `aria-busy`. */
export const Spinner = ({ size = 'md', className, label }: SpinnerProps) => (
  <span role={label ? 'status' : undefined} aria-label={label} aria-hidden={label ? undefined : true} className={cn('inline-flex', className)}>
    <Spin size={size === 'sm' ? 'small' : size === 'lg' ? 'large' : 'default'} />
  </span>
)
