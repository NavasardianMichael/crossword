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
  wrap,
  className,
}: {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  /** Let a long label grow the button: between words first, inside a word only when one does not fit. */
  wrap?: boolean
  className?: string
}) =>
  cn(
    'relative inline-flex select-none items-center justify-center gap-2 rounded-control border font-display font-bold',
    wrap ? 'py-2 text-center leading-snug whitespace-normal wrap-anywhere' : 'whitespace-nowrap',
    'aria-disabled:pointer-events-none',
    size === 'sm' && cn(wrap ? 'min-h-control' : 'h-control', 'px-4 text-body-sm'),
    size === 'md' && cn(wrap ? 'min-h-control-lg' : 'h-control-lg', 'px-6 text-body'),
    size === 'lg' && cn(wrap ? 'min-h-14' : 'h-14', 'px-8 text-h3'),
    VARIANT_CLASSES[variant],
    fullWidth && 'w-full',
    className
  )
