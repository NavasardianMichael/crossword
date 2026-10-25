import { cn } from '@helpers/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'sun' | 'outline' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

/**
 * Button looks as classes, for the place an antd `Button` cannot go: `ButtonLink` (a
 * server-rendered locale link). `Button` uses the same variant utilities on top of antd, so a
 * link and a button side by side match.
 */
export const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'btn-chunky btn-primary',
  secondary: 'btn-chunky btn-secondary',
  sun: 'btn-chunky btn-sun',
  outline: 'btn-chunky btn-outline',
  danger: 'btn-chunky btn-danger',
  ghost: 'border-transparent bg-transparent text-ink-700 shadow-none hover:bg-cream-200 hover:text-ink-900',
}

export const buttonClassName = ({
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
}: {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  className?: string
}) =>
  cn(
    'relative inline-flex select-none items-center justify-center gap-2 rounded-control border font-display font-bold whitespace-nowrap',
    'aria-disabled:pointer-events-none',
    size === 'sm' && 'h-control px-4 text-body-sm',
    size === 'md' && 'h-control-lg px-6 text-body',
    size === 'lg' && 'h-14 px-8 text-h3',
    VARIANT_CLASSES[variant],
    fullWidth && 'w-full',
    className
  )
