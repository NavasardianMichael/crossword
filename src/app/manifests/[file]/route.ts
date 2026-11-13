import { NextResponse } from 'next/server'
import { isLocale, LOCALES } from '@i18n/config'
import { buildManifest } from '@helpers/manifest'

/**
 * `/manifests/<locale>.webmanifest` — each language's web manifest, prerendered. The file
 * extension keeps it out of the proxy's locale redirect.
 */
export const dynamic = 'force-static'
export const dynamicParams = false

export const generateStaticParams = () => LOCALES.map((locale) => ({ file: `${locale}.webmanifest` }))

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }): Promise<NextResponse> {
  const locale = (await params).file.replace(/\.webmanifest$/, '')
  if (!isLocale(locale)) return new NextResponse(null, { status: 404 })
  const { Common } = (await import(`../../../messages/${locale}.json`)).default as { Common: { appName: string; tagline: string } }
  return NextResponse.json(buildManifest(locale, { name: Common.appName, description: Common.tagline }), {
    headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' },
  })
}
