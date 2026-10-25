'use client'

import { Alert } from 'antd'
import { RotateCcw } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { classifyError, IS_DEV } from '@helpers/error'
import { Button } from './Button'

export type ErrorAlertProps = {
  error: unknown
  /** Overrides the kind-based copy with a context-specific sentence. */
  message?: string
  onRetry?: () => void
  className?: string
}

/**
 * The one inline error block, on antd's `Alert` (`role="alert"`): translated copy chosen by
 * error *kind* in production, the original message added underneath in development. Never
 * renders a server's own text.
 */
export const ErrorAlert = ({ error, message, onRetry, className }: ErrorAlertProps) => {
  const t = useTranslations()
  const { kind, details } = classifyError(error)

  return (
    <Alert
      type='error'
      showIcon
      className={className}
      title={message ?? t(`Errors.${kind}`)}
      description={
        IS_DEV ? (
          <details className='text-caption text-ink-500'>
            <summary className='cursor-pointer'>{t('Errors.details')}</summary>
            <code className='mt-1 block break-all'>{details}</code>
          </details>
        ) : undefined
      }
      action={
        onRetry && (
          <Button variant='outline' size='sm' onClick={onRetry} icon={<RotateCcw aria-hidden className='size-4' />}>
            {t('Common.retry')}
          </Button>
        )
      }
    />
  )
}
