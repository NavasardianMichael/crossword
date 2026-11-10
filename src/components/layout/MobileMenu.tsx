'use client'

import { useState } from 'react'
import { BookOpen, CircleHelp, Coins, Grid3x3, History, LayoutGrid, type LucideIcon, Mail, Menu, Shapes } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { usePathname } from '@i18n/navigation'
import { ROUTES } from '@constants/routes'
import { cn } from '@helpers/cn'
import { AuthMenu } from '@components/auth/AuthMenu'
import { AppLink } from '@components/ui/bare/AppLink'
import { Dialog } from '@components/ui/Dialog'
import { IconButton } from '@components/ui/IconButton'
import { isActivePath } from './DesktopNav'

const ITEMS: { labelKey: string; href: string; icon: LucideIcon }[] = [
  { labelKey: 'crossword', href: ROUTES.crossword, icon: Grid3x3 },
  { labelKey: 'scanword', href: ROUTES.scanword, icon: LayoutGrid },
  { labelKey: 'topics', href: ROUTES.topics, icon: Shapes },
  { labelKey: 'history', href: ROUTES.history, icon: History },
  { labelKey: 'credits', href: ROUTES.credits, icon: Coins },
  { labelKey: 'rules', href: ROUTES.rules, icon: BookOpen },
  { labelKey: 'faq', href: ROUTES.faq, icon: CircleHelp },
  { labelKey: 'contact', href: ROUTES.contact, icon: Mail },
]

/** The site menu, opened from the hamburger: the same links as the header, plus sign-in. */
export const MobileMenu = () => {
  const [open, setOpen] = useState(false)
  const t = useTranslations()
  const pathname = usePathname()
  const close = () => setOpen(false)

  return (
    <div>
      <IconButton
        label={t('Common.openMenu')}
        icon={<Menu className='size-5' />}
        onClick={() => setOpen(true)}
        aria-expanded={open}
      />
      <Dialog open={open} onClose={close} title={t('Common.menu')} variant='drawer'>
        <nav aria-label={t('Nav.main')}>
          <ul className='flex flex-col gap-1.5'>
            {ITEMS.map(({ labelKey, href, icon: Icon }) => {
              const active = isActivePath(pathname, href)
              return (
                <li key={href}>
                  <AppLink
                    href={href}
                    onClick={close}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex min-h-12 items-center gap-3 rounded-control border-2 px-3 font-display font-bold transition-colors',
                      active ? 'border-ink-900 bg-sun-200' : 'border-transparent hover:bg-cream-200'
                    )}
                  >
                    <Icon aria-hidden className='size-5 text-coral-600' />
                    {t(`Nav.${labelKey}`)}
                  </AppLink>
                </li>
              )
            })}
          </ul>
          <div className='mt-3 border-t-2 border-dashed border-line-strong pt-3'>
            <AuthMenu onNavigate={close} />
          </div>
        </nav>
      </Dialog>
    </div>
  )
}
