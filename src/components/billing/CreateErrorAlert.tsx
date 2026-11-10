'use client'

import { useTranslations } from 'next-intl'
import { usePathname } from '@i18n/navigation'
import { RETURN_TO_QUERY } from '@constants/auth'
import { ROUTES } from '@constants/routes'
import { billingRefusal } from '@helpers/billing'
import { ButtonLink } from '@components/ui/bare/AppLink'
import { ErrorAlert } from '@components/ui/ErrorAlert'

type CreateErrorAlertProps = { error: unknown; onRetry: () => void; message?: string; className?: string }

/**
 * A failed "new puzzle". A refusal to pay is not retried — it says why and offers the way on:
 * sign in (a guest's free puzzle is used) or buy credits. Anything else is a plain `ErrorAlert`.
 */
export const CreateErrorAlert = ({ error, onRetry, message, className }: CreateErrorAlertProps) => {
  const t = useTranslations('Billing')
  const pathname = usePathname()
  const refusal = billingRefusal(error)

  if (refusal === 'signInRequired') {
    return (
      <ErrorAlert
        error={error}
        message={t('refusedSignIn')}
        className={className}
        action={
          <ButtonLink href={{ pathname: ROUTES.signIn, query: { [RETURN_TO_QUERY]: pathname } }} variant='outline' size='sm'>
            {t('signIn')}
          </ButtonLink>
        }
      />
    )
  }
  if (refusal === 'insufficientCredits') {
    return (
      <ErrorAlert
        error={error}
        message={t('refusedCredits')}
        className={className}
        action={
          <ButtonLink href={ROUTES.credits} variant='outline' size='sm'>
            {t('buyCredits')}
          </ButtonLink>
        }
      />
    )
  }
  return <ErrorAlert error={error} message={message} onRetry={onRetry} className={className} />
}
