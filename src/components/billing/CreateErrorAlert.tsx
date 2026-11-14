'use client'

import { useTranslations } from 'next-intl'
import { billingRefusal } from '@helpers/billing'
import { ErrorAlert } from '@components/ui/ErrorAlert'

type CreateErrorAlertProps = { error: unknown; onRetry: () => void; message?: string; className?: string }

/**
 * A failed "new puzzle". A refusal to pay renders nothing here — `CreditsRefusalDialog` explains
 * it and offers the way on. Free credits paused for the hour say so, with a retry. Anything else
 * is a plain `ErrorAlert`.
 */
export const CreateErrorAlert = ({ error, onRetry, message, className }: CreateErrorAlertProps) => {
  const t = useTranslations('Billing')
  const refusal = billingRefusal(error)

  if (refusal === 'signInRequired' || refusal === 'insufficientCredits') return null
  if (refusal === 'freeBusy') return <ErrorAlert error={error} message={t('refusedFreeBusy')} onRetry={onRetry} className={className} />
  return <ErrorAlert error={error} message={message} onRetry={onRetry} className={className} />
}
