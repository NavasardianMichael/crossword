'use client'

import { useEffect, useState } from 'react'
import { initializePaddle, type Paddle, type PaddleEventData } from '@paddle/paddle-js'
import { useTranslations } from 'next-intl'
import { usePendingRouter } from '@hooks/useNavigationPending'
import { PADDLE_CLIENT_TOKEN, PADDLE_ENVIRONMENT, PADDLE_TRANSACTION_QUERY, PAYMENT_ID_QUERY } from '@constants/paddle'
import { ROUTES } from '@constants/routes'
import { reportError } from '@helpers/reportError'
import { ButtonLink } from '@components/ui/bare/AppLink'
import { ErrorAlert } from '@components/ui/ErrorAlert'
import { Spinner } from '@components/ui/Spinner'

/**
 * The checkout page. The API's checkout URL is this page plus `?_ptxn=txn_…`, the shape of
 * Paddle's "default payment link"; Paddle.js, once initialized, sees the parameter and opens
 * the overlay for that transaction.
 * Paid → the return page waits for the webhook. Closed unpaid → back to the credits page.
 * Docs: https://developer.paddle.com/build/transactions/default-payment-link
 */
export const PaddleCheckout = () => {
  const t = useTranslations('Payments')
  const router = usePendingRouter()
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
    let paddle: Paddle | undefined
    const onEvent = (event: PaddleEventData) => {
      // The page was left: the overlay was closed with it, and its events steer nothing.
      if (cancelled) return
      if (event.name === 'checkout.completed') {
        completed = true
        // The overlay lives on <body> and outlives a client-side navigation; our return page takes over.
        paddle?.Checkout.close()
        router.replace({ pathname: ROUTES.paymentsReturn, query: { [PAYMENT_ID_QUERY]: transactionId } })
      } else if (event.name === 'checkout.closed' && !completed) {
        router.replace(ROUTES.credits)
      }
    }

    initializePaddle({ environment: PADDLE_ENVIRONMENT, token: PADDLE_CLIENT_TOKEN, eventCallback: onEvent })
      .then((instance) => {
        if (!instance) throw new Error('Paddle.js did not load')
        paddle = instance
      })
      .catch((failure: unknown) => {
        reportError(failure, 'paddle:init')
        if (!cancelled) setError(failure)
      })
    return () => {
      cancelled = true
      // Left with Back while the overlay was open: it lives on <body> and would follow to the next page.
      if (!completed) paddle?.Checkout.close()
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
