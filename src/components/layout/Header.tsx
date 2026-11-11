import { HeaderSignIn } from '@components/auth/HeaderSignIn'
import { CreditBalance } from '@components/billing/CreditBalance'
import { Logo } from '@components/brand/Logo'
import { InstallButton } from '@components/pwa/InstallButton'
import { DesktopNav } from './DesktopNav'
import { LanguageSwitcher } from './LanguageSwitcher'
import { MobileMenu } from './MobileMenu'

/**
 * Sticky paper bar with a dashed "cut here" edge. From `lg` the nav runs inline, as many links
 * as fit; the hamburger always has them all, and sign-in. The credits chip shows the credit
 * balance to everyone (0 for a guest); a guest also gets a sign-in link from `sm`.
 * Gaps tighten as the bar narrows; every control stays a 44 px target. On a puzzle board in
 * the game layout it steps aside.
 */
export const Header = () => (
  <header className='sticky top-0 z-40 border-b-2 game-page:hidden border-dashed border-line-strong bg-cream-100/90 pt-safe backdrop-blur-md'>
    <div className='container-page flex h-header items-center gap-2 xl:gap-3'>
      <Logo className='me-auto min-w-0 lg:me-2 lg:shrink-0 xl:me-4' />
      <DesktopNav />
      <div className='flex shrink-0 items-center gap-1.5 xl:gap-2'>
        <CreditBalance />
        <HeaderSignIn />
        <InstallButton />
        <LanguageSwitcher />
        <MobileMenu />
      </div>
    </div>
  </header>
)
