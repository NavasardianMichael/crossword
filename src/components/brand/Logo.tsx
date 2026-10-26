import { useTranslations } from 'next-intl'
import { cn } from '@helpers/cn'
import { AppLink } from '@components/ui/bare/AppLink'
import { Emblem } from './Emblem'

/** Emblem + the translated name, linking home. The name hides on the narrowest phones. */
export const Logo = ({ className }: { className?: string }) => {
  const t = useTranslations('Common')
  return (
    <AppLink href='/' className={cn('group flex items-center gap-2.5', className)} aria-label={t('appName')}>
      <Emblem className='size-10 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105' />
      <span aria-hidden className='hidden font-display text-[1.15rem] leading-none font-extrabold text-ink-900 min-[380px]:block'>
        {t('appName')}
      </span>
    </AppLink>
  )
}
