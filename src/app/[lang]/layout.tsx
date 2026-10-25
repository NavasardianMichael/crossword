import type { CSSProperties, ReactNode } from 'react'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { getAntdLocale } from '@i18n/antdLocale'
import { getDirection, LOCALES } from '@i18n/config'
import { routing } from '@i18n/routing'
import { GA_ENABLED, GA_INIT_SCRIPT, GA_SCRIPT_SRC } from '@constants/analytics'
import { AUTHOR } from '@constants/app'
import { cn } from '@helpers/cn'
import { getSiteUrl } from '@helpers/url'
import { App } from '@components/App'
import '@styles/globals.css'
import { fontBody, fontHeading, getScriptFont } from '@styles/fonts'
import { CREAM, CSS_VAR_SCOPE } from '@styles/tokens'

/**
 * No `maximumScale`/`userScalable`: pinch-zoom must stay available. `viewportFit: 'cover'`
 * makes `env(safe-area-inset-*)` non-zero on notched phones. Light only: the browser chrome
 * and form controls are told so, and no dark variant exists.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  interactiveWidget: 'resizes-content',
  themeColor: CREAM[100],
  colorScheme: 'light',
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Seo')
  // The brand is translated too; the English name stays in the manifest and as JSON-LD `alternateName`.
  const appName = (await getTranslations('Common'))('appName')
  return {
    metadataBase: new URL(getSiteUrl()),
    title: { default: t('homeTitle'), template: `%s | ${appName}` },
    description: t('homeDescription'),
    keywords: t('keywords'),
    applicationName: appName,
    manifest: '/manifest.webmanifest',
    appleWebApp: { capable: true, title: appName, statusBarStyle: 'default' },
    other: { 'apple-mobile-web-app-capable': 'yes' },
    openGraph: { type: 'website', siteName: appName },
    creator: AUTHOR.name,
    authors: [{ name: AUTHOR.name, url: AUTHOR.url }],
    category: 'game',
    robots: { index: true, follow: true },
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
      : {}),
  }
}

/** Prerenders the shell for every locale; otherwise every route would be dynamic. */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

type Props = {
  children: ReactNode
  params: Promise<{ lang: string }>
}

export default async function RootLayout({ children, params }: Props) {
  const { lang } = await params
  // A path segment is user input until proven otherwise; an unknown one must 404.
  if (!hasLocale(routing.locales, lang)) notFound()

  const direction = getDirection(lang)
  // Loaded on the server: only the active locale's antd copy crosses the RSC boundary.
  const antdLocale = await getAntdLocale(lang)
  const scriptFont = getScriptFont(lang)
  const style = scriptFont ? ({ '--font-script': `'${scriptFont.family}'` } as CSSProperties) : undefined

  return (
    // CSS_VAR_SCOPE is the class antd scopes its `--ant-*` variables to (theme.ts); on <html>
    // they cover antd portals too, and the globals.css §2 aliases read them from :root.
    // `data-scroll-behavior`: globals.css scrolls smoothly; Next turns it off during route changes.
    <html
      lang={lang}
      dir={direction}
      data-scroll-behavior='smooth'
      className={cn(fontHeading.variable, fontBody.variable, CSS_VAR_SCOPE)}
      style={style}
    >
      <head>
        {/* Fixes the cascade-layer order before any stylesheet — antd's inline <style> included —
            can declare a layer first (globals.css §0 repeats it). */}
        <style>{'@layer theme, base, antd, components, utilities;'}</style>
        {scriptFont && (
          <>
            <link rel='preconnect' href='https://fonts.googleapis.com' />
            <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
            <link rel='stylesheet' href={scriptFont.href} />
          </>
        )}
      </head>
      <body className='paper-dots'>
        {/* `layer` wraps antd's CSS in `@layer antd`, below Tailwind's utilities. */}
        <AntdRegistry layer>
          <NextIntlClientProvider>
            <App antdLocale={antdLocale} direction={direction}>
              {children}
            </App>
          </NextIntlClientProvider>
        </AntdRegistry>
        {GA_ENABLED && (
          <>
            <Script src={GA_SCRIPT_SRC} strategy='afterInteractive' />
            <Script id='ga-init' strategy='afterInteractive'>
              {GA_INIT_SCRIPT}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}
