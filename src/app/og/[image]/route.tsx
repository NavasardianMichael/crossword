import { LOCALES } from '@i18n/config'
import { isLocale } from '@constants/puzzle'
import { renderSiteCard } from '@helpers/socialCard'

/** `/og/en.png`: the link preview of every page in that language (`pageMetadata`), built once per locale. */
export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ image: `${locale}.png` }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ image: string }> }) {
  const locale = (await params).image.replace(/\.png$/, '')
  if (!isLocale(locale)) return new Response(null, { status: 404 })
  return renderSiteCard(locale)
}
