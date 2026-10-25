import { useTranslations } from 'next-intl'
import { LOCALE_LABELS, LOCALES } from '@i18n/config'
import { LEGAL_NAV, PRIMARY_NAV, SECONDARY_NAV } from '@constants/navigation'
import { Emblem } from '@components/brand/Emblem'
import { AppLink } from '@components/ui/bare/AppLink'

/**
 * Server-rendered, so every link is crawlable. The language list links each locale's home
 * page — together with `hreflang` and the sitemap, that is how every variant is found.
 */
export const Footer = () => {
  const t = useTranslations()
  const year = new Date().getFullYear()
  const linkClass = 'text-body-sm font-semibold text-ink-700 transition-colors hover:text-coral-700'

  return (
    <footer className='mt-16 border-t-2 border-dashed border-line-strong bg-cream-200/60 pb-safe'>
      <div className='container-page grid gap-10 py-12 md:grid-cols-[1.3fr_1fr_1fr]'>
        <div className='flex flex-col gap-3'>
          <div className='flex items-center gap-3'>
            <Emblem className='size-12' />
            <p className='font-display text-h3 font-extrabold'>{t('Common.appName')}</p>
          </div>
          <p className='max-w-sm text-body-sm text-ink-700'>{t('Common.tagline')}</p>
        </div>

        <nav aria-label={t('Nav.footer')} className='grid grid-cols-2 content-start gap-x-6 gap-y-2'>
          {[...PRIMARY_NAV, ...SECONDARY_NAV, ...LEGAL_NAV].map(({ labelKey, href }) => (
            <AppLink key={href} href={href} className={linkClass}>
              {t(`Nav.${labelKey}`)}
            </AppLink>
          ))}
        </nav>

        <div>
          <h2 className='eyebrow mb-3'>{t('Common.language')}</h2>
          <ul className='flex flex-col gap-2'>
            {LOCALES.map((locale) => (
              <li key={locale}>
                <AppLink href='/' locale={locale} lang={locale} hrefLang={locale} className={linkClass}>
                  {LOCALE_LABELS[locale]}
                </AppLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className='container-page border-t border-line-strong py-5 text-caption text-ink-500'>
        {t('Common.copyright', { year, appName: t('Common.appName') })}
      </p>
    </footer>
  )
}
