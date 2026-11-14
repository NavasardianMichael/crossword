'use client'

import { useState } from 'react'
import { Coins, LogIn } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useBillingStore } from '@store/billing/store'
import { useCreateStore } from '@store/puzzle/create/store'
import { usePathname } from '@i18n/navigation'
import { RETURN_TO_QUERY } from '@constants/auth'
import { FREE_MONTHLY_CREDITS, puzzleCredits } from '@constants/puzzle'
import { ROUTES } from '@constants/routes'
import { billingRefusal } from '@helpers/billing'
import { ButtonLink } from '@components/ui/bare/AppLink'
import { Button } from '@components/ui/Button'
import { Dialog } from '@components/ui/Dialog'

type PaymentRefusal = 'signInRequired' | 'insufficientCredits'

const isPaymentRefusal = (refusal: string | undefined): refusal is PaymentRefusal =>
  refusal === 'signInRequired' || refusal === 'insufficientCredits'

/**
 * A "new puzzle" the credits could not pay for (HTTP 402): what it costs against what the player
 * has, and the way on — sign in (a guest) or buy credits (an account), with the credit packs one
 * tap away for both. Reads the create store's error, so it is mounted once beside the button.
 */
export const CreditsRefusalDialog = () => {
  const t = useTranslations('Billing')
  const pathname = usePathname()
  const error = useCreateStore.use.error()
  const options = useCreateStore.use.options()
  const dismissError = useCreateStore.use.dismissError()
  const status = useBillingStore.use.status()

  const refusal = billingRefusal(error)
  const open = isPaymentRefusal(refusal)
  // The last refusal stays on screen while the dialog animates out.
  const [shown, setShown] = useState<PaymentRefusal>('insufficientCredits')
  if (open && refusal !== shown) setShown(refusal)

  const guest = shown === 'signInRequired'
  const price = puzzleCredits(options.size, options.difficulty)

  return (
    <Dialog
      open={open}
      onClose={dismissError}
      title={
        <span className='flex items-center gap-2'>
          <Coins aria-hidden className='size-6 text-coral-600' />
          {t('refusalTitle')}
        </span>
      }
      footer={
        guest ? (
          <>
            <ButtonLink href={ROUTES.credits} variant='ghost' size='sm' onClick={dismissError}>
              {t('seePacks')}
            </ButtonLink>
            <ButtonLink
              href={{ pathname: ROUTES.signIn, query: { [RETURN_TO_QUERY]: pathname } }}
              variant='primary'
              size='sm'
              onClick={dismissError}
            >
              <LogIn aria-hidden className='size-5' />
              {t('signIn')}
            </ButtonLink>
          </>
        ) : (
          <>
            <Button variant='ghost' size='sm' onClick={dismissError}>
              {t('notNow')}
            </Button>
            <ButtonLink href={ROUTES.credits} variant='primary' size='sm' onClick={dismissError}>
              <Coins aria-hidden className='size-5' />
              {t('buyCredits')}
            </ButtonLink>
          </>
        )
      }
    >
      <div className='flex flex-col gap-4'>
        <p className='text-ink-700'>{guest ? t('refusedSignIn', { count: FREE_MONTHLY_CREDITS }) : t('refusedCredits')}</p>
        <p className='flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-control border-2 border-line-subtle bg-sun-100 p-3 text-center text-body-sm font-bold'>
          <span>{t('cost', { count: price })}</span>
          {status ? (
            <>
              <span aria-hidden>·</span>
              <span>{t('youHave', { count: status.credits + status.freeCredits })}</span>
            </>
          ) : null}
        </p>
      </div>
    </Dialog>
  )
}
