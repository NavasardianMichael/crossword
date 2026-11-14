'use client'

import { useSyncExternalStore } from 'react'
import { Cookie, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ROUTES } from '@constants/routes'
import { isConsentBannerOpen, saveConsent, subscribeConsentBanner } from '@helpers/consent'
import { AppLink } from '@components/ui/bare/AppLink'
import { Button } from '@components/ui/Button'
import { IconButton } from '@components/ui/IconButton'

/**
 * Asks once whether Google Analytics may set its cookies — only where an opt-in is needed
 * (`helpers/consent.ts`); elsewhere they are on from the start. Until the visitor answers,
 * analytics runs cookieless. Closing it counts as accepting, and the text says so. Comes back
 * from "Cookie settings" in the footer. Not a modal: the page stays usable while it is open.
 */
export const ConsentBanner = () => {
  const t = useTranslations('Consent')
  const tCommon = useTranslations('Common')
  // Closed in the server render: the answer lives on the device.
  const open = useSyncExternalStore(subscribeConsentBanner, isConsentBannerOpen, () => false)

  if (!open) return null

  return (
    <section
      aria-label={t('label')}
      className='fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,var(--safe-bottom))]'
    >
      <div className='panel relative mx-auto flex max-w-3xl flex-col gap-3 p-4 pe-14 sm:flex-row sm:items-center sm:gap-4'>
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
        {/* Last in the tab order; closing counts as accepting, as the text says. */}
        <IconButton
          label={tCommon('close')}
          icon={<X aria-hidden className='size-5' />}
          tooltip={false}
          className='absolute end-1.5 top-1.5 border-transparent bg-transparent shadow-none'
          onClick={() => saveConsent('granted')}
        />
      </div>
    </section>
  )
}
