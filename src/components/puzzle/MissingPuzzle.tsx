import { History, House, WifiOff } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ROUTES } from '@constants/routes'
import { ButtonLink } from '@components/ui/bare/AppLink'

/** A puzzle that is neither on the device nor reachable — with the ways on, never a dead end. */
export const MissingPuzzle = () => {
  const t = useTranslations('Play')
  const tNav = useTranslations('Nav')
  return (
    <div className='container-page flex min-h-[50dvh] flex-col items-center justify-center gap-4 text-center'>
      <WifiOff aria-hidden className='size-12 text-ink-300' />
      <h1 className='text-h2 font-extrabold'>{t('missingTitle')}</h1>
      <p className='max-w-md text-ink-700'>{t('missingText')}</p>
      <div className='flex flex-wrap justify-center gap-3'>
        <ButtonLink href={ROUTES.home}>
          <House aria-hidden className='size-5' />
          {tNav('home')}
        </ButtonLink>
        <ButtonLink href={ROUTES.history} variant='outline'>
          <History aria-hidden className='size-5' />
          {tNav('history')}
        </ButtonLink>
      </div>
    </div>
  )
}
