'use client'

import { useTranslations } from 'next-intl'
import { usePathname } from '@i18n/navigation'
import { PRIMARY_NAV } from '@constants/navigation'
import { cn } from '@helpers/cn'
import { AppLink } from '@components/ui/bare/AppLink'

export const isActivePath = (pathname: string, href: string): boolean =>
  href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)

export const DesktopNav = () => {
  const t = useTranslations('Nav')
  const pathname = usePathname()

  return (
    <nav aria-label={t('main')} className='me-auto hidden min-w-0 lg:block'>
      <ul className='flex items-center gap-1'>
        {PRIMARY_NAV.map(({ labelKey, href }) => {
          const active = isActivePath(pathname, href)
          return (
            <li key={href}>
              <AppLink
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'block rounded-full border-2 px-4 py-1.5 font-display text-body-sm font-bold whitespace-nowrap transition-colors',
                  active ? 'border-ink-900 bg-sun-200 text-ink-900' : 'border-transparent text-ink-700 hover:bg-cream-200 hover:text-ink-900'
                )}
              >
                {t(labelKey)}
              </AppLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
