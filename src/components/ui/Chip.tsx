'use client'

import { Tag } from 'antd'
import { Check } from 'lucide-react'
import { cn } from '@helpers/cn'

export type ChipProps = {
  label: string
  selected: boolean
  onToggle: () => void
  className?: string
}

/** antd's `CheckableTag` for choice lists (topics), sized for touch. */
export const Chip = ({ label, selected, onToggle, className }: ChipProps) => (
  <Tag.CheckableTag
    checked={selected}
    onChange={onToggle}
    // Through `icon`, not children: the tag wraps children in a span, where the block-level SVG would wrap.
    icon={selected ? <Check aria-hidden className='size-4 shrink-0' /> : undefined}
    className={cn(
      'm-0 inline-flex min-h-11 items-center gap-1.5 rounded-full border-2 px-4 text-body-sm font-bold whitespace-nowrap',
      selected ? 'border-coral-500 bg-coral-100 text-ink-900' : 'border-line-strong bg-white text-ink-700 hover:border-ink-300 hover:text-ink-900',
      className
    )}
  >
    {label}
  </Tag.CheckableTag>
)
