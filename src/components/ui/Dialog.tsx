'use client'

import { type ReactNode, useContext } from 'react'
import { ConfigProvider, Drawer, Grid, Modal } from 'antd'
import { useTranslations } from 'next-intl'
import { cn } from '@helpers/cn'

/**
 * The one overlay: antd's `Modal`, or its `Drawer` (bookie's AppSheet idea).
 * - `center` — a centred modal at every size;
 * - `sheet` — a centred modal from `md` up, a bottom sheet below it;
 * - `drawer` — slides in from the inline end (it follows `dir`).
 * Focus trapping, Escape, scroll lock and the portal come from antd.
 */
export type DialogProps = {
  open: boolean
  onClose: () => void
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
  footer?: ReactNode
  variant?: 'center' | 'sheet' | 'drawer'
  /** Hide the visual title (it still names the dialog for screen readers). */
  hideTitle?: boolean
  className?: string
  closeOnBackdrop?: boolean
  /** Locks every way of closing while a request inside is in flight. */
  pending?: boolean
  /** Modal width: `md` for confirmations and forms, `lg` for pickers. */
  size?: 'md' | 'lg'
}

export const Dialog = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  variant = 'center',
  hideTitle,
  className,
  closeOnBackdrop = true,
  pending = false,
  size = 'md',
}: DialogProps) => {
  const t = useTranslations('Common')
  const screens = Grid.useBreakpoint()
  const { direction } = useContext(ConfigProvider.ConfigContext)

  const requestClose = () => {
    if (!pending) onClose()
  }
  const heading = (
    <div className={cn(hideTitle && 'sr-only')}>
      <span className='block'>{title}</span>
      {description && <span className='mt-1 block font-sans text-body-sm font-normal text-ink-700'>{description}</span>}
    </div>
  )
  const closable = { 'aria-label': t('close'), disabled: pending }
  const shared = { open, title: heading, className, destroyOnHidden: true, keyboard: !pending, mask: { closable: closeOnBackdrop && !pending } }

  // `useBreakpoint` is empty on the server and the first client render; a sheet starts as a modal.
  const asDrawer = variant === 'drawer' || (variant === 'sheet' && screens.md === false)

  if (asDrawer) {
    const fromBottom = variant === 'sheet'
    return (
      <Drawer
        {...shared}
        onClose={requestClose}
        placement={fromBottom ? 'bottom' : direction === 'rtl' ? 'left' : 'right'}
        size={fromBottom ? 'auto' : 'min(24rem, 100%)'}
        closable={{ ...closable, placement: 'end' }}
        footer={footer && <div className='flex flex-wrap justify-end gap-3 pb-safe'>{footer}</div>}
        styles={{
          wrapper: fromBottom ? { maxHeight: '92dvh' } : undefined,
          section: fromBottom ? { borderStartStartRadius: 'var(--radius-panel)', borderStartEndRadius: 'var(--radius-panel)' } : undefined,
          body: { overflowY: 'auto' },
        }}
      >
        {children}
      </Drawer>
    )
  }

  return (
    <Modal
      {...shared}
      onCancel={requestClose}
      centered
      width={size === 'lg' ? 'min(44rem, calc(100% - 2rem))' : 'min(32rem, calc(100% - 2rem))'}
      closable={closable}
      footer={footer ? <div className='flex flex-wrap justify-end gap-3'>{footer}</div> : null}
      styles={{ body: { maxHeight: '70dvh', overflowY: 'auto' } }}
    >
      {children}
    </Modal>
  )
}
