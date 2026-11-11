'use client'

import { useEffect, useRef } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname } from '@i18n/navigation'
import { PRIMARY_NAV } from '@constants/navigation'
import { cn } from '@helpers/cn'
import { AppLink } from '@components/ui/bare/AppLink'

export const isActivePath = (pathname: string, href: string): boolean =>
  href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)

/**
 * The inline nav, from `lg`. Labels run long in some languages, so the list wraps and shows
 * only its first row: links that do not fit drop out of sight (all of them are in the menu)
 * instead of running under the buttons — at any width, in any language, without measuring
 * first. The effect only takes the hidden ones out of the tab order.
 */
export const DesktopNav = () => {
  const t = useTranslations('Nav')
  const locale = useLocale()
  const pathname = usePathname()
  const list = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const ul = list.current
    if (!ul) return
    const sync = () => {
      const items = [...ul.children].filter((li) => li instanceof HTMLElement)
      const firstRow = items[0]?.offsetTop ?? 0
      for (const li of items) li.inert = li.offsetTop > firstRow
    }
    sync()
    const observer = new ResizeObserver(sync)
    observer.observe(ul)
    return () => observer.disconnect()
    // Another language brings other label widths without necessarily resizing the list.
  }, [locale])

  return (
    <nav aria-label={t('main')} className='me-auto hidden min-w-0 lg:block'>
      {/* One row of links tall; the second row starts below the clip, so it never peeks in. */}
      <ul ref={list} className='flex h-12 flex-wrap content-start items-center gap-x-0.5 gap-y-6 overflow-hidden p-1 xl:gap-x-1'>
        {PRIMARY_NAV.map(({ labelKey, href }) => {
          const active = isActivePath(pathname, href)
          return (
            <li key={href} className='shrink-0'>
              <AppLink
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex h-10 items-center rounded-full border-2 px-2.5 font-display text-body-sm font-bold whitespace-nowrap transition-colors xl:px-3.5',
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
