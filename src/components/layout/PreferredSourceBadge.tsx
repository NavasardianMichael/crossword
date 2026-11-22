import { ArrowRight, Star } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { googlePreferredSourceUrl } from '@helpers/url'
import { GoogleLogo } from '@components/brand/GoogleLogo'

/**
 * "Add as a preferred source on Google": Google's own page for this site, in a new tab. A reader
 * who adds it sees the site more often in Top Stories and AI answers. A plain link in the app's
 * sticker look rather than Google's script-drawn button, so the footer loads nothing from Google.
 */
export const PreferredSourceBadge = () => {
  const t = useTranslations('Common')

  return (
    <a
      href={googlePreferredSourceUrl()}
      target='_blank'
      rel='noopener noreferrer'
      className='group inline-flex max-w-full items-center gap-3 self-start rounded-panel border-2 border-ink-900 bg-surface py-2 ps-2 pe-4 text-ink-900 transition-all hover:-translate-y-0.5 hover:bg-sun-100 hover:shadow-chunky'
    >
      <span className='relative flex size-10 shrink-0 items-center justify-center rounded-control border-2 border-ink-900 bg-cream-50'>
        <GoogleLogo className='size-5' />
        <span className='absolute -end-2 -top-2 flex size-5 items-center justify-center rounded-full border-2 border-ink-900 bg-sun-300'>
          <Star aria-hidden className='size-2.5 fill-current' />
        </span>
      </span>
      <span className='flex min-w-0 flex-col leading-tight'>
        <span className='text-caption text-ink-500'>{t('preferredSourceEyebrow')}</span>
        <span className='text-body-sm font-bold'>{t('preferredSource')}</span>
      </span>
      <ArrowRight aria-hidden className='size-4 shrink-0 text-ink-500 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5' />
    </a>
  )
}
