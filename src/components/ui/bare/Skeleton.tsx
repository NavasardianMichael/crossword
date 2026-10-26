import { cn } from '@helpers/cn'

/**
 * An exact-size placeholder block, for slots whose shape antd's `Skeleton` presets do not
 * match (an avatar chip in the header). Text-shaped loading states use antd's `Skeleton`.
 */
export const Skeleton = ({ className }: { className?: string }) => (
  <div aria-hidden className={cn('animate-pulse rounded-control bg-cream-200', className)} />
)
