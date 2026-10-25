'use client'

import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from 'react'
import { Button as AntButton, Tooltip } from 'antd'
import { cn } from '@helpers/cn'

export type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'color'> & {
  /** Required: an icon-only control has no other accessible name. It is also the tooltip. */
  label: string
  icon: ReactNode
  tone?: 'default' | 'accent'
  size?: 'md' | 'lg'
  /** The tooltip is skipped where the label is already visible nearby. */
  tooltip?: boolean
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ label, icon, tone = 'default', size = 'md', tooltip = true, className, ...rest }, ref) => {
    const button = (
      <AntButton
        ref={ref}
        htmlType='button'
        aria-label={label}
        icon={icon}
        size='large'
        className={cn(
          'shrink-0',
          size === 'md' ? 'size-11' : 'size-12',
          tone === 'default' && 'border-line-strong bg-white text-ink-700 hover:border-ink-300 hover:text-ink-900',
          tone === 'accent' && 'border-coral-300 bg-coral-100 text-coral-700 hover:border-coral-500 hover:text-coral-700',
          className
        )}
        {...rest}
      />
    )
    return tooltip ? (
      <Tooltip title={label} mouseEnterDelay={0.4}>
        {button}
      </Tooltip>
    ) : (
      button
    )
  }
)

IconButton.displayName = 'IconButton'
