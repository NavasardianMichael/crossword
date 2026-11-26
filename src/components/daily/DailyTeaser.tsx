import { CalendarDays } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { ROUTES } from '@constants/routes'
import { cn } from '@helpers/cn'
import { ButtonLink } from '@components/ui/bare/AppLink'

/** "Today's crossword": the link to `/daily` from the home, format and topic pages — server-rendered, crawlable. */
export const DailyTeaser = async ({ className }: { className?: string }) => {
  const t = await getTranslations('Daily')
  return (
    <aside className={cn('container-page', className)}>
      <div className='flex flex-col items-start gap-4 rounded-panel border-2 border-ink-900 bg-teal-100 p-6 shadow-chunky sm:flex-row sm:items-center'>
        <span className='flex size-12 shrink-0 items-center justify-center rounded-2xl border-2 border-ink-900 bg-sun-300'>
          <CalendarDays aria-hidden className='size-6' />
        </span>
        <div className='flex-1'>
          <h2 className='font-display text-h3 font-extrabold text-ink-900'>{t('teaserTitle')}</h2>
          <p className='text-ink-700'>{t('teaserText')}</p>
        </div>
        <ButtonLink href={ROUTES.daily} variant='primary'>
          {t('teaserCta')}
        </ButtonLink>
      </div>
    </aside>
  )
}
