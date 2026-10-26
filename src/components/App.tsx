import type { ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { AntdProvider, type AntdProviderProps } from './AntdProvider'
import { AppEffects } from './AppEffects'
import { Footer } from './layout/Footer'
import { Header } from './layout/Header'
import { InstallHint } from './pwa/InstallHint'
import { PageViewTracker } from './pwa/PageViewTracker'
import { ServiceWorkerRegistrar } from './pwa/ServiceWorkerRegistrar'
import { Toaster } from './ui/Toaster'

/**
 * The page shell. A server component: the header and footer — and so every navigation
 * link — are in the server HTML; the client-only parts are small islands. `AntdProvider`
 * is a client boundary that passes its server-rendered children straight through.
 *
 * One document-level scroller, so sticky headers, iOS momentum scrolling and scroll
 * restoration all behave.
 */
export type AppProps = Omit<AntdProviderProps, 'children'> & { children: ReactNode }

export const App = ({ children, antdLocale, direction }: AppProps) => {
  const t = useTranslations('Common')
  return (
    <AntdProvider antdLocale={antdLocale} direction={direction}>
      <a
        href='#main'
        className='sr-only z-50 rounded-control border-2 border-ink-900 bg-sun-300 px-4 py-2 font-bold text-ink-900 focus:not-sr-only focus:fixed focus:inset-s-4 focus:top-4'
      >
        {t('skipToContent')}
      </a>
      <AppEffects />
      <ServiceWorkerRegistrar />
      <PageViewTracker />
      <div className='flex min-h-dvh flex-col'>
        <Header />
        <main id='main' className='flex-1'>
          {children}
        </main>
        <Footer />
      </div>
      <Toaster />
      <InstallHint />
    </AntdProvider>
  )
}
