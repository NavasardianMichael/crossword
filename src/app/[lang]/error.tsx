'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { reportError } from '@helpers/reportError'
import { ErrorAlert } from '@components/ui/ErrorAlert'

export default function RouteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations('Errors')

  useEffect(() => {
    reportError(error, 'route')
  }, [error])

  return (
    <div className='container-page flex min-h-[50dvh] flex-col items-center justify-center gap-4 py-16 text-center'>
      <h1 className='text-h2 font-bold text-ink-900'>{t('pageErrorTitle')}</h1>
      <p className='max-w-md text-ink-700'>{t('pageErrorBody')}</p>
      <ErrorAlert error={error} onRetry={reset} className='w-full max-w-md text-start' />
    </div>
  )
}
