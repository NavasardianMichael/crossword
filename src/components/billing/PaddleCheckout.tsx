'use client'

import { useEffect, useState } from 'react'
import { initializePaddle, type PaddleEventData } from '@paddle/paddle-js'
import { useTranslations } from 'next-intl'
import { useRouter } from '@i18n/navigation'
import { PADDLE_CLIENT_TOKEN, PADDLE_ENVIRONMENT, PADDLE_TRANSACTION_QUERY, PAYMENT_ID_QUERY } from '@constants/paddle'
import { ROUTES } from '@constants/routes'
import { reportError } from '@helpers/reportError'
import { ButtonLink } from '@components/ui/bare/AppLink'
import { ErrorAlert } from '@components/ui/ErrorAlert'
import { Spinner } from '@components/ui/Spinner'

/**
 * Paddle's "default payment link". The API's checkout URL is this page plus `?_ptxn=txn_…`;
 * Paddle.js, once initialized, sees the parameter and opens the overlay for that transaction.
 * Paid → the return page waits for the webhook. Closed unpaid → back to the credits page.
 * Docs: https://developer.paddle.com/build/transactions/default-payment-link
 */
export const PaddleCheckout = () => {
  const t = useTranslations('Payments')
  const router = useRouter()
  const [error, setError] = useState<unknown>(() =>
    PADDLE_CLIENT_TOKEN ? null : new Error('NEXT_PUBLIC_PADDLE_CLIENT_TOKEN is not set: the checkout overlay cannot open')
  )

  useEffect(() => {
    // Read here rather than with useSearchParams, which would need a Suspense boundary.
    const transactionId = new URLSearchParams(window.location.search).get(PADDLE_TRANSACTION_QUERY)
    if (!transactionId) {
      router.replace(ROUTES.credits)
      return
    }
    if (!PADDLE_CLIENT_TOKEN) {
      reportError(new Error('NEXT_PUBLIC_PADDLE_CLIENT_TOKEN is not set'), 'paddle:token')
      return
    }

    let cancelled = false
    let completed = false
    const onEvent = (event: PaddleEventData) => {
      if (event.name === 'checkout.completed') {
        completed = true
        router.replace({ pathname: ROUTES.paymentsReturn, query: { [PAYMENT_ID_QUERY]: transactionId } })
      } else if (event.name === 'checkout.closed' && !completed) {
        router.replace(ROUTES.credits)
      }
    }

    initializePaddle({ environment: PADDLE_ENVIRONMENT, token: PADDLE_CLIENT_TOKEN, eventCallback: onEvent })
      .then((paddle) => {
        if (!paddle) throw new Error('Paddle.js did not load')
      })
      .catch((failure: unknown) => {
        reportError(failure, 'paddle:init')
        if (!cancelled) setError(failure)
      })
    return () => {
      cancelled = true
    }
  }, [router])

  if (error) {
    return (
      <div className='flex flex-col items-center gap-4'>
        <ErrorAlert error={error} message={t('checkoutUnavailable')} className='w-full max-w-md' />
        <ButtonLink href={ROUTES.credits} variant='outline'>
          {t('backToCredits')}
        </ButtonLink>
      </div>
    )
  }
  return <Spinner size='lg' label={t('opening')} />
}
