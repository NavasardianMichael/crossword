'use client'

import { Segmented } from 'antd'
import { cn } from '@helpers/cn'

export type SegmentedOption<T extends string | number> = { value: T; label: string }

export type SegmentedControlProps<T extends string | number> = {
  label: string
  value: T
  options: SegmentedOption<T>[]
  onChange: (value: T) => void
  className?: string
  size?: 'sm' | 'md'
  block?: boolean
}

/** antd's `Segmented` — a radio group with a sliding thumb; arrow keys move it. */
export const SegmentedControl = <T extends string | number>({
  label,
  value,
  options,
  onChange,
  className,
  size = 'md',
  block,
}: SegmentedControlProps<T>) => (
  <Segmented<T>
    aria-label={label}
    value={value}
    options={options}
    onChange={onChange}
    size={size === 'sm' ? 'small' : 'middle'}
    block={block}
    className={cn('max-w-full overflow-x-auto font-semibold no-scrollbar', className)}
  />
)
