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
  type Difficulty,
  FREE_MONTHLY_CREDITS,
  isLocale,
  puzzleCredits,
  type PuzzleSize,
  SIZES,
} from '@constants/puzzle'
import { ROUTES } from '@constants/routes'
import { trackEvent } from '@helpers/analytics'
import { collectClientInfo } from '@helpers/clientInfo'
import { cn } from '@helpers/cn'
import { reportError } from '@helpers/reportError'
import { AppLink, ButtonLink } from '@components/ui/bare/AppLink'
import { Button } from '@components/ui/Button'
import { ErrorAlert } from '@components/ui/ErrorAlert'
import { Card } from '@components/ui/layout/Card'

const BADGES: Partial<Record<CreditPackId, 'popularBadge' | 'bestValueBadge'>> = { popular: 'popularBadge', big: 'bestValueBadge' }

/** Until Paddle answers (or when it cannot), the packs at their USD list price, not yet buyable. */
const LIST_PACKS: CreditPack[] = CREDIT_PACKS.map(({ id, credits, usd }) => ({ id, credits, usd, price: null, available: false }))

/** The medium puzzle at medium difficulty — the yardstick a pack is measured in, and the free monthly allowance. */
const TYPICAL_PUZZLE = FREE_MONTHLY_CREDITS

/** The price table's colour per difficulty: mint, sunshine, coral — calm to fiery. */
const DIFFICULTY_TONES: Record<Difficulty, { chip: string; tile: string }> = {
  1: { chip: 'border-mint-600 bg-mint-200', tile: 'border-mint-300 bg-mint-100' },
  2: { chip: 'border-sun-600 bg-sun-200', tile: 'border-sun-300 bg-sun-100' },
  3: { chip: 'border-coral-600 bg-coral-200', tile: 'border-coral-300 bg-coral-100' },
}

/** A tiny crossword per size, growing with it; the dark squares are where a grid has its blocks. */
const GRID_GLYPHS: Record<PuzzleSize, { columns: string; blocks: readonly number[]; cells: number }> = {
  small: { columns: 'grid-cols-2', blocks: [3], cells: 4 },
  medium: { columns: 'grid-cols-3', blocks: [2, 6], cells: 9 },
  large: { columns: 'grid-cols-4', blocks: [3, 5, 10, 12], cells: 16 },
}

const GridGlyph = ({ size }: { size: PuzzleSize }) => {
  const { columns, blocks, cells } = GRID_GLYPHS[size]
  return (
    <span aria-hidden className='inline-flex w-6 shrink-0 justify-center sm:w-7'>
      <span className={cn('grid gap-px rounded-sm bg-ink-700 p-px', columns)}>
        {Array.from({ length: cells }, (_, cell) => (
          <span key={cell} className={cn('size-1.5', blocks.includes(cell) ? 'bg-ink-700' : 'bg-cream-50')} />
        ))}
      </span>
    </span>
  )
}

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
      const { checkoutUrl } = await startCheckoutAPI({ pack, locale, client: collectClientInfo() })
      trackEvent('begin_checkout', { pack })
      // Paddle's URL is our own checkout page plus `?_ptxn=…`; a full load, so Paddle.js starts clean.
      window.location.assign(checkoutUrl)
    } catch (error) {
      setCheckoutError(error)
      setBuying(null)
    }
  }

  const signInHref = { pathname: ROUTES.signIn, query: { [RETURN_TO_QUERY]: pathname } }
  const renewsOn = (iso: string) => format.dateTime(new Date(iso), { day: 'numeric', month: 'long', timeZone: 'UTC' })
  const shopOpen = Boolean(status?.shopOpen)

  return (
    <div className='flex flex-col gap-6'>
      <Card className='flex flex-col gap-3'>
        <h2 className='font-display text-h3 font-bold'>{t('balanceTitle')}</h2>
        {status ? (
          <>
            <p className='flex items-center gap-2 font-display text-h2 font-extrabold'>
              <Coins aria-hidden className='size-7 text-coral-600' />
              {tAll('Billing.credits', { count: status.credits + status.freeCredits })}
            </p>
            <p className='text-ink-700'>
              {status.freeCredits > 0
                ? t('freeAvailable', { count: status.freeCredits, date: renewsOn(status.freeResetsAt) })
                : t('freeUsed', { count: FREE_MONTHLY_CREDITS, date: renewsOn(status.freeResetsAt) })}
            </p>
          </>
        ) : null}
        {status && !status.signedIn ? (
          <div className='flex flex-col items-start gap-3'>
            <p className='text-ink-700'>{t('guestText', { count: FREE_MONTHLY_CREDITS })}</p>
            <ButtonLink href={signInHref} variant='primary' size='sm'>
              {tAll('Billing.signIn')}
            </ButtonLink>
          </div>
        ) : null}
      </Card>

      <Card className='flex flex-col gap-3'>
        <h2 className='font-display text-h3 font-bold'>{t('pricesTitle')}</h2>
        <p className='text-ink-700'>{t('pricesText')}</p>
        <div className='-mx-1 overflow-x-auto px-1 pb-1'>
          <table className='w-full border-separate border-spacing-1 text-start sm:border-spacing-2.5'>
            <thead>
              <tr>
                <th scope='col' className='pe-1 text-start align-bottom text-caption font-bold text-ink-500'>
                  {t('size')}
                </th>
                {DIFFICULTIES.map((difficulty) => (
                  <th key={difficulty} scope='col' className='w-[23%] align-bottom font-normal'>
                    <span
                      className={cn(
                        'flex flex-col items-center gap-1 rounded-xl border-2 px-1 py-1 text-center font-display text-caption font-bold hyphens-auto sm:rounded-full sm:px-2 sm:text-body-sm',
                        DIFFICULTY_TONES[difficulty].chip
                      )}
                    >
                      <span aria-hidden className='flex gap-0.5'>
                        {DIFFICULTIES.map((pip) => (
                          <span key={pip} className={cn('size-1.5 rounded-full', pip <= difficulty ? 'bg-ink-900' : 'bg-ink-900/20')} />
                        ))}
                      </span>
                      {tAll(`Difficulty.${difficulty}`)}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SIZES.map((size) => (
                <tr key={size}>
                  <th scope='row' className='pe-1 text-start font-display text-caption font-bold sm:text-body-sm'>
                    <span className='flex items-center gap-1.5 sm:gap-2'>
                      <GridGlyph size={size} />
                      {tAll(`Sizes.${size}`)}
                    </span>
                  </th>
                  {DIFFICULTIES.map((difficulty) => (
                    <td key={difficulty} className='p-0'>
                      <span
                        className={cn(
                          'flex items-center justify-center gap-1 rounded-xl border-2 px-1 py-2 shadow-chunky sm:px-2 sm:py-2.5',
                          DIFFICULTY_TONES[difficulty].tile
                        )}
                      >
                        <Coins aria-hidden className='hidden size-4 shrink-0 text-coral-600 sm:block' />
                        <span className='font-display text-body leading-none font-extrabold tabular-nums sm:text-h3'>
                          {format.number(puzzleCredits(size, difficulty))}
                        </span>
                      </span>
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
