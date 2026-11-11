import { useTranslations } from 'next-intl'
import { cn } from '@helpers/cn'
import { AppLink } from '@components/ui/bare/AppLink'
import { Emblem } from './Emblem'

/**
 * Emblem + the translated name, linking home. Where the name does not fit beside the emblem —
 * a long one on a phone — it wraps onto a second row that is clipped away, leaving the emblem
 * (the nav's trick, `DesktopNav`). Between `lg` and `xl` the inline nav gets that room outright.
 */
export const Logo = ({ className }: { className?: string }) => {
  const t = useTranslations('Common')
  return (
    <AppLink
      href='/'
      className={cn('group -m-1 flex h-12 flex-wrap content-start items-center gap-x-2.5 gap-y-8 overflow-hidden p-1', className)}
      aria-label={t('appName')}
    >
      <Emblem className='size-10 shrink-0 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105' />
      <span aria-hidden className='font-display text-[1.15rem] leading-none font-extrabold whitespace-nowrap text-ink-900 lg:hidden xl:block'>
        {t('appName')}
      </span>
    </AppLink>
  )
}
