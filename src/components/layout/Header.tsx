import { Logo } from '@components/brand/Logo'
import { InstallButton } from '@components/pwa/InstallButton'
import { DesktopNav } from './DesktopNav'
import { LanguageSwitcher } from './LanguageSwitcher'
import { MobileMenu } from './MobileMenu'

/**
 * Sticky paper bar with a dashed "cut here" edge. Desktop shows the nav inline; below `lg` it
 * moves into the menu drawer.
 */
export const Header = () => (
  <header className='sticky top-0 z-40 border-b-2 border-dashed border-line-strong bg-cream-100/90 pt-safe backdrop-blur-md'>
    <div className='container-page flex h-header items-center gap-3'>
      <Logo className='me-auto shrink-0 lg:me-6' />
      <DesktopNav />
      <div className='flex shrink-0 items-center gap-2'>
        <InstallButton />
        <LanguageSwitcher />
        <MobileMenu />
      </div>
    </div>
  </header>
)
