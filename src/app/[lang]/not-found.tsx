import { getTranslations } from 'next-intl/server'
import { ROUTES } from '@constants/routes'
import { Emblem } from '@components/brand/Emblem'
import { ButtonLink } from '@components/ui/bare/AppLink'

export default async function NotFound() {
  const t = await getTranslations('Errors')
  return (
    <div className='container-page flex min-h-[60dvh] flex-col items-center justify-center gap-4 py-16 text-center'>
      <Emblem className='size-24 animate-float' />
      <p aria-hidden className='font-display text-display font-extrabold text-coral-500'>
        404
      </p>
      <h1 className='text-h2 font-bold'>{t('notFoundTitle')}</h1>
      <p className='max-w-md text-ink-700'>{t('notFoundBody')}</p>
      <ButtonLink href={ROUTES.home} className='mt-2'>
        {t('goHome')}
      </ButtonLink>
    </div>
  )
}
