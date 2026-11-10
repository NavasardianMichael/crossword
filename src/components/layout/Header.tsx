import { Logo } from '@components/brand/Logo'
import { InstallButton } from '@components/pwa/InstallButton'
import { DesktopNav } from './DesktopNav'
import { LanguageSwitcher } from './LanguageSwitcher'
import { MobileMenu } from './MobileMenu'

/**
 * Sticky paper bar with a dashed "cut here" edge. Desktop shows the nav inline. The hamburger
 * opens those links again, and sign-in. On a puzzle board in the game layout it steps aside.
 */
export const Header = () => (
  <header className='sticky top-0 z-40 border-b-2 game-page:hidden border-dashed border-line-strong bg-cream-100/90 pt-safe backdrop-blur-md'>
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
