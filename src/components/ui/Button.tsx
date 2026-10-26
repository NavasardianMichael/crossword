'use client'

import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from 'react'
import { Button as AntButton } from 'antd'
import { cn } from '@helpers/cn'
import { type ButtonSize, type ButtonVariant, VARIANT_CLASSES } from './bare/buttonClassName'

export type { ButtonSize, ButtonVariant } from './bare/buttonClassName'

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'color'> & {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  loading?: boolean
  icon?: ReactNode
  type?: 'button' | 'submit' | 'reset'
}

/**
 * antd's `Button` with the chunky sticker finish. antd supplies focus, loading and disabled
 * behaviour; `btn-chunky` + a variant (globals.css §6) draws the fill and the pressable edge —
 * utilities sit in a higher cascade layer than antd, so they win without `!important`.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth, loading, icon, className, type = 'button', ...rest }, ref) => (
    <AntButton
      ref={ref}
      htmlType={type}
      type={variant === 'ghost' ? 'text' : 'default'}
      size={size === 'sm' ? 'middle' : 'large'}
      block={fullWidth}
      loading={loading}
      icon={icon}
      className={cn(
        'font-bold',
        size === 'sm' && 'px-4 text-body-sm',
        size === 'md' && 'px-6 text-body',
        size === 'lg' && 'h-14 px-8 text-h3',
        VARIANT_CLASSES[variant],
        className
      )}
      {...rest}
    />
  )
)

Button.displayName = 'Button'
