'use client'

import { useEffect, useState } from 'react'
import { CircleCheck, CircleX, Clock } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { getPaymentAPI } from '@api/billing/main'
import { useBillingStoreBase } from '@store/billing/store'
import { useRouter } from '@i18n/navigation'
import { PAYMENT_ID_QUERY } from '@constants/paddle'
import { ROUTES } from '@constants/routes'
import { trackEvent } from '@helpers/analytics'
import { ButtonLink } from '@components/ui/bare/AppLink'
import { ErrorAlert } from '@components/ui/ErrorAlert'
import { Spinner } from '@components/ui/Spinner'

const POLL_INTERVAL_MS = 2000
/** Webhooks usually land within seconds; past this the credits are "on their way", not lost. */
const POLL_TIMEOUT_MS = 60_000

type ReturnState =
  | { kind: 'verifying' }
  | { kind: 'completed'; credits: number }
  | { kind: 'pending' }
  | { kind: 'failed' }
  | { kind: 'error'; error: unknown }

/** After Paddle's overlay reports a payment: waits for the webhook to add the credits, then says so. */
export const PaymentReturn = () => {
  const t = useTranslations('Payments')
  const router = useRouter()
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
        if (Date.now() - startedAt > POLL_TIMEOUT_MS) {
          return setState(payment.status === 'failed' ? { kind: 'failed' } : { kind: 'pending' })
        }
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
  if (state.kind === 'error') return <ErrorAlert error={state.error} message={t('verifyError')} className='w-full max-w-md' />

  const { icon, title, text } = {
    completed: { icon: <CircleCheck aria-hidden className='size-14 text-mint-600' />, title: t('successTitle'), text: state.kind === 'completed' ? t('successText', { count: state.credits }) : '' },
    pending: { icon: <Clock aria-hidden className='size-14 text-ink-500' />, title: t('successTitle'), text: t('pendingText') },
    failed: { icon: <CircleX aria-hidden className='size-14 text-coral-600' />, title: '', text: t('failedText') },
  }[state.kind]

  return (
    <div role='status' className='flex flex-col items-center gap-4 text-center'>
      {icon}
      {title ? <h2 className='font-display text-h2 font-extrabold'>{title}</h2> : null}
      <p className='max-w-md text-ink-700'>{text}</p>
      <div className='flex flex-wrap justify-center gap-3'>
        {state.kind === 'failed' ? (
          <ButtonLink href={ROUTES.credits}>{t('backToCredits')}</ButtonLink>
        ) : (
          <>
            <ButtonLink href={ROUTES.home}>{t('makePuzzle')}</ButtonLink>
            <ButtonLink href={ROUTES.credits} variant='outline'>
              {t('backToCredits')}
            </ButtonLink>
          </>
        )}
      </div>
    </div>
  )
}
