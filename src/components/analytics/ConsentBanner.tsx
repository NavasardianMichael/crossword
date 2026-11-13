'use client'

import { useSyncExternalStore } from 'react'
import { Cookie } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ROUTES } from '@constants/routes'
import { isConsentBannerOpen, saveConsent, subscribeConsentBanner } from '@helpers/consent'
import { AppLink } from '@components/ui/bare/AppLink'
import { Button } from '@components/ui/Button'

/**
 * Asks once whether Google Analytics may set its cookies (`helpers/consent.ts`). Until the
 * visitor answers, analytics runs cookieless. Comes back from "Cookie settings" in the footer.
 * Not a modal: the page stays usable while it is open.
 */
export const ConsentBanner = () => {
  const t = useTranslations('Consent')
  // Closed in the server render: the answer lives on the device.
  const open = useSyncExternalStore(subscribeConsentBanner, isConsentBannerOpen, () => false)

  if (!open) return null

  return (
    <section
      aria-label={t('label')}
      className='fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,var(--safe-bottom))]'
    >
      <div className='panel mx-auto flex max-w-3xl flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4'>
        <Cookie aria-hidden className='hidden size-8 shrink-0 text-coral-500 sm:block' />
        <p className='text-body-sm text-ink-700'>
          {t('text')}{' '}
          <AppLink href={ROUTES.privacy} className='font-bold text-coral-600 underline underline-offset-2'>
            {t('privacy')}
          </AppLink>
        </p>
        <div className='flex shrink-0 gap-2 sm:ms-auto'>
          <Button variant='outline' size='sm' className='flex-1 sm:flex-none' onClick={() => saveConsent('denied')}>
            {t('decline')}
          </Button>
          <Button variant='primary' size='sm' className='flex-1 sm:flex-none' onClick={() => saveConsent('granted')}>
            {t('accept')}
          </Button>
        </div>
      </div>
    </section>
  )
}
