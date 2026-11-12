'use client'

import { useEffect, useState } from 'react'
import { CircleCheck, Clock } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { getPaymentAPI } from '@api/billing/main'
import { useBillingStoreBase } from '@store/billing/store'
import { usePendingRouter } from '@hooks/useNavigationPending'
import { PAYMENT_ID_QUERY } from '@constants/paddle'
import { ROUTES } from '@constants/routes'
import { trackEvent } from '@helpers/analytics'
import { ButtonLink } from '@components/ui/bare/AppLink'
import { ErrorAlert } from '@components/ui/ErrorAlert'
import { Spinner } from '@components/ui/Spinner'

const POLL_INTERVAL_MS = 2000
/** Webhooks usually land within seconds; past this the credits are "on their way", not lost. */
const POLL_TIMEOUT_MS = 60_000

type ReturnState = { kind: 'verifying' } | { kind: 'completed'; credits: number } | { kind: 'pending' } | { kind: 'error'; error: unknown }

/**
 * After Paddle's overlay reports a payment: waits for the webhook to add the credits, then says so.
 *
 * Only `checkout.completed` sends a buyer here, so the page never says the payment failed: a
 * `failed` status is an earlier declined card in the same overlay, and the completed webhook
 * is still on its way. When polling stops before it lands, the page says the credits will
 * come by themselves — no need to wait here — and how to reach us if they do not.
 */
export const PaymentReturn = () => {
  const t = useTranslations('Payments')
  const router = usePendingRouter()
  const [state, setState] = useState<ReturnState>({ kind: 'verifying' })

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get(PAYMENT_ID_QUERY)
    if (!id) {
      router.replace(ROUTES.credits)
      return
    }

    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | undefined
    const startedAt = Date.now()

    const poll = async () => {
      try {
        const payment = await getPaymentAPI({ id })
        if (cancelled) return
        if (payment.status === 'completed' || payment.status === 'refunded') {
          void useBillingStoreBase.getState().refresh()
          trackEvent('purchase', { credits: payment.credits })
          return setState({ kind: 'completed', credits: payment.credits })
        }
        if (Date.now() - startedAt > POLL_TIMEOUT_MS) return setState({ kind: 'pending' })
        timer = setTimeout(() => void poll(), POLL_INTERVAL_MS)
      } catch (error) {
        if (!cancelled) setState({ kind: 'error', error })
      }
    }
    void poll()

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [router])

  if (state.kind === 'verifying') return <Spinner size='lg' label={t('verifying')} />

  const contact = (
    <ButtonLink href={ROUTES.contact} variant='ghost'>
      {t('contactUs')}
    </ButtonLink>
  )

  if (state.kind === 'error') {
    return (
      <div className='flex w-full max-w-md flex-col items-center gap-4 text-center'>
        <ErrorAlert error={state.error} message={t('verifyError')} className='w-full' />
        <p className='text-ink-700'>{t('lateHelp')}</p>
        <div className='flex flex-wrap justify-center gap-3'>
          <ButtonLink href={ROUTES.credits} variant='outline'>
            {t('backToCredits')}
          </ButtonLink>
          {contact}
        </div>
      </div>
    )
  }

  const completed = state.kind === 'completed'
  return (
    <div role='status' className='flex flex-col items-center gap-4 text-center'>
      {completed ? <CircleCheck aria-hidden className='size-14 text-mint-600' /> : <Clock aria-hidden className='size-14 text-ink-500' />}
      <h2 className='font-display text-h2 font-extrabold'>{t('successTitle')}</h2>
      <p className='max-w-md text-ink-700'>{completed ? t('successText', { count: state.credits }) : t('pendingText')}</p>
      {completed ? null : <p className='max-w-md text-ink-700'>{t('lateHelp')}</p>}
      <div className='flex flex-wrap justify-center gap-3'>
        <ButtonLink href={ROUTES.home}>{t('makePuzzle')}</ButtonLink>
        <ButtonLink href={ROUTES.credits} variant='outline'>
          {t('backToCredits')}
        </ButtonLink>
        {completed ? null : contact}
      </div>
    </div>
  )
}
