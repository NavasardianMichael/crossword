import { ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { FORMATS } from '@constants/puzzle'
import { ROUTES } from '@constants/routes'
import { AppLink } from '@components/ui/bare/AppLink'
import { MiniGrid } from './MiniGrid'

/** The two formats side by side, each linking to its landing page. */
export const FormatCards = async () => {
  const t = await getTranslations('Formats')
  return (
    <ul className='grid gap-5 md:grid-cols-2'>
      {FORMATS.map((format) => (
        <li key={format}>
          <AppLink
            href={format === 'classic' ? ROUTES.crossword : ROUTES.scanword}
            className='panel group flex h-full flex-col gap-4 p-6 transition-transform hover:-translate-y-1 sm:flex-row sm:items-center'
          >
            <MiniGrid format={format} className='w-28 shrink-0 rotate-[-3deg] transition-transform group-hover:rotate-0' />
            <span className='flex flex-col gap-2'>
              <span className='font-display text-h3 font-extrabold'>{t(`${format}.name`)}</span>
              <span className='text-ink-700'>{t(`${format}.description`)}</span>
              <span className='inline-flex items-center gap-1 font-display font-bold text-coral-700'>
                {t(`${format}.cta`)}
                <ArrowRight aria-hidden className='size-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100' />
              </span>
            </span>
          </AppLink>
        </li>
      ))}
    </ul>
  )
}
