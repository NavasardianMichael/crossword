'use client'

import { useEffect, useState } from 'react'
import { Coins } from 'lucide-react'
import { useFormatter, useLocale, useTranslations } from 'next-intl'
import { getPacksAPI, startCheckoutAPI } from '@api/billing/main'
import type { CreditPack } from '@api/billing/types'
import { useBillingStore } from '@store/billing/store'
import { usePathname } from '@i18n/navigation'
import { RETURN_TO_QUERY } from '@constants/auth'
import {
  CREDIT_PACKS,
  type CreditPackId,
  DIFFICULTIES,
  DIFFICULTY_CREDITS,
  isLocale,
  puzzleCredits,
  SIZE_CREDITS,
  SIZES,
} from '@constants/puzzle'
import { ROUTES } from '@constants/routes'
import { trackEvent } from '@helpers/analytics'
import { cn } from '@helpers/cn'
import { reportError } from '@helpers/reportError'
import { AppLink, ButtonLink } from '@components/ui/bare/AppLink'
import { Button } from '@components/ui/Button'
import { ErrorAlert } from '@components/ui/ErrorAlert'
import { Card } from '@components/ui/layout/Card'

const BADGES: Partial<Record<CreditPackId, 'popularBadge' | 'bestValueBadge'>> = { popular: 'popularBadge', big: 'bestValueBadge' }

/** Until Paddle answers (or when it cannot), the packs at their USD list price, not yet buyable. */
const LIST_PACKS: CreditPack[] = CREDIT_PACKS.map(({ id, credits, usd }) => ({ id, credits, usd, price: null, available: false }))

/** The medium puzzle at medium difficulty — the yardstick a pack is measured in. */
const TYPICAL_PUZZLE = SIZE_CREDITS.medium + DIFFICULTY_CREDITS[2]

/**
 * The balance and this month's free puzzle, what each puzzle costs, and the packs. Buying opens
 * a Paddle checkout: the API creates the transaction, the browser goes to our checkout page.
 */
export const CreditsView = () => {
  const t = useTranslations('Credits')
  const tAll = useTranslations()
  const format = useFormatter()
  const locale = useLocale()
  const pathname = usePathname()
  const status = useBillingStore.use.status()
  const [packs, setPacks] = useState<CreditPack[]>(LIST_PACKS)
  const [buying, setBuying] = useState<CreditPackId | null>(null)
  const [checkoutError, setCheckoutError] = useState<unknown>(null)

  useEffect(() => {
    let cancelled = false
    getPacksAPI()
      .then((loaded) => {
        if (!cancelled) setPacks(loaded)
      })
      .catch((error: unknown) => reportError(error, 'billing:packs', { silent: true }))
    return () => {
      cancelled = true
    }
  }, [])

  const buy = async (pack: CreditPackId) => {
    if (!isLocale(locale) || buying) return
    setBuying(pack)
    setCheckoutError(null)
    try {
      const { checkoutUrl } = await startCheckoutAPI({ pack, locale })
      trackEvent('begin_checkout', { pack })
      // Paddle's URL is our own checkout page plus `?_ptxn=…`; a full load, so Paddle.js starts clean.
      window.location.assign(checkoutUrl)
    } catch (error) {
      setCheckoutError(error)
      setBuying(null)
    }
  }

  const signInHref = { pathname: ROUTES.signIn, query: { [RETURN_TO_QUERY]: pathname } }
  const shopOpen = Boolean(status?.shopOpen)

  return (
    <div className='flex flex-col gap-6'>
      <Card className='flex flex-col gap-3'>
        <h2 className='font-display text-h3 font-bold'>{status && !status.signedIn ? t('guestTitle') : t('balanceTitle')}</h2>
        {status?.signedIn ? (
          <p className='flex items-center gap-2 font-display text-h2 font-extrabold'>
            <Coins aria-hidden className='size-7 text-coral-600' />
            {tAll('Billing.credits', { count: status.credits })}
          </p>
        ) : null}
        {status ? (
          <p className='text-ink-700'>
            {status.freeAvailable
              ? t('freeAvailable')
              : t('freeUsed', { date: format.dateTime(new Date(status.freeResetsAt), { day: 'numeric', month: 'long', timeZone: 'UTC' }) })}
          </p>
        ) : null}
        {status && !status.signedIn ? (
          <div className='flex flex-col items-start gap-3'>
            <p className='text-ink-700'>{t('guestText')}</p>
            <ButtonLink href={signInHref} variant='primary' size='sm'>
              {tAll('Billing.signIn')}
            </ButtonLink>
          </div>
        ) : null}
      </Card>

      <Card className='flex flex-col gap-3'>
        <h2 className='font-display text-h3 font-bold'>{t('pricesTitle')}</h2>
        <p className='text-ink-700'>{t('pricesText')}</p>
        <div className='overflow-x-auto'>
          <table className='w-full min-w-72 border-collapse text-start'>
            <thead>
              <tr className='border-b-2 border-line-strong'>
                <th scope='col' className='py-2 pe-3 text-start font-display font-bold'>
                  {t('size')}
                </th>
                {DIFFICULTIES.map((difficulty) => (
                  <th key={difficulty} scope='col' className='px-3 py-2 text-end font-display font-bold'>
                    {tAll(`Difficulty.${difficulty}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SIZES.map((size) => (
                <tr key={size} className='border-b border-line-strong last:border-0'>
                  <th scope='row' className='py-2 pe-3 text-start font-bold'>
                    {tAll(`Sizes.${size}`)}
                  </th>
                  {DIFFICULTIES.map((difficulty) => (
                    <td key={difficulty} className='px-3 py-2 text-end tabular-nums'>
                      {format.number(puzzleCredits(size, difficulty))}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <section aria-labelledby='packs-title' className='flex flex-col gap-4'>
        <h2 id='packs-title' className='font-display text-h3 font-bold'>
          {t('packsTitle')}
        </h2>
        {status && !shopOpen ? <p className='text-ink-700'>{t('shopClosed')}</p> : null}
        {checkoutError ? <ErrorAlert error={checkoutError} message={t('checkoutFailed')} /> : null}
        <ul className='grid gap-4 sm:grid-cols-3'>
          {packs.map((pack) => {
            const badge = BADGES[pack.id]
            return (
              <li key={pack.id}>
                <Card className={cn('flex h-full flex-col gap-2 hyphens-auto wrap-anywhere', pack.id === 'popular' && 'border-ink-900 shadow-chunky')}>
                  <div className='flex flex-wrap items-center justify-between gap-2'>
                    <h3 className='font-display font-bold'>{t(`packs.${pack.id}`)}</h3>
                    {badge ? (
                      <span className='max-w-full rounded-full bg-sun-200 px-2.5 py-0.5 text-caption font-bold wrap-anywhere'>
                        {t(badge)}
                      </span>
                    ) : null}
                  </div>
                  <p className='font-display text-h2 font-extrabold'>{tAll('Billing.credits', { count: pack.credits })}</p>
                  <p className='text-h3 font-bold'>{pack.price ?? format.number(pack.usd, { style: 'currency', currency: 'USD' })}</p>
                  <p className='text-body-sm text-ink-500'>{t('packPuzzles', { count: Math.floor(pack.credits / TYPICAL_PUZZLE) })}</p>
                  <div className='mt-auto pt-2'>
                    {status && !status.signedIn ? (
                      <ButtonLink href={signInHref} variant='outline' fullWidth wrap>
                        {t('signInToBuy')}
                      </ButtonLink>
                    ) : (
                      <Button
                        variant={pack.id === 'popular' ? 'primary' : 'outline'}
                        fullWidth
                        loading={buying === pack.id}
                        disabled={!pack.available || !status || Boolean(buying)}
                        onClick={() => void buy(pack.id)}
                      >
                        {t('buy')}
                      </Button>
                    )}
                  </div>
                </Card>
              </li>
            )
          })}
        </ul>
        <p className='text-body-sm text-ink-500'>
          {t('paddleNote')}{' '}
          <AppLink href={ROUTES.terms} className='font-bold text-coral-600 underline underline-offset-2'>
            {t('refundsNote')}
          </AppLink>
        </p>
      </section>
    </div>
  )
}
