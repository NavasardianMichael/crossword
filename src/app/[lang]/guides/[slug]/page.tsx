import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { isLocale } from '@i18n/config'
import { currentLocale, pageMetadata } from '@i18n/metadata'
import type { Locale } from '@constants/puzzle'
import { guidePath, ROUTES } from '@constants/routes'
import { findGuide, guidesByKey, guidesFor, guideSlugsByLocale, guideSubject } from '@content/index'
import type { GuideKey } from '@content/types'
import { articleSchema } from '@linkedDataSchema/index'
import { ContentSections } from '@components/content/ContentSections'
import { Breadcrumbs, ContentFaq, ContentMeta, GuideCard, GuideCta, TableOfContents } from '@components/content/GuideParts'
import { RichText } from '@components/content/RichText'
import { JsonLd } from '@components/seo/JsonLd'

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

/** Each language's own guides, under its own slugs. */
export function generateStaticParams({ params }: { params: { lang: string } }) {
  return isLocale(params.lang) ? guidesFor(params.lang).map((guide) => ({ slug: guide.slug })) : []
}

/** The same guide in its other languages, each at its own slug: the `hreflang` set. */
const languagesOf = (key: GuideKey) =>
  Object.fromEntries((Object.entries(guideSlugsByLocale(key)) as [Locale, string][]).map(([locale, slug]) => [locale, guidePath(slug)]))

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = findGuide(await currentLocale(), (await params).slug)
  if (!guide) return {}
  return pageMetadata({
    path: guidePath(guide.slug),
    title: guide.metaTitle,
    description: guide.description,
    languages: languagesOf(guide.key),
    article: { published: guide.published, updated: guide.updated },
  })
}

export default async function GuidePage({ params }: Props) {
  const locale = await currentLocale()
  const guide = findGuide(locale, (await params).slug)
  if (!guide) notFound()

  const t = await getTranslations('Content')
  const nav = await getTranslations('Nav')
  const common = await getTranslations('Common')
  const path = guidePath(guide.slug)
  const related = guidesByKey(locale, guide.related)

  return (
    <>
      <JsonLd data={articleSchema(locale, path, common('appName'), guide)} />
      <article className='container-page max-w-3xl pt-8 pb-6 text-ink-700 sm:pt-12'>
        <Breadcrumbs
          locale={locale}
          items={[
            { name: nav('home'), path: ROUTES.home },
            { name: nav('guides'), path: ROUTES.guides },
            { name: guide.shortTitle, path },
          ]}
        />
        <h1 className='mt-4 text-h1 font-extrabold text-balance text-ink-900'>{guide.title}</h1>
        <ContentMeta locale={locale} guide={guide} />
        {guide.intro.map((paragraph) => (
          <p key={paragraph} className='mt-5 leading-relaxed sm:text-h3 sm:font-normal'>
            <RichText text={paragraph} />
          </p>
        ))}
        <TableOfContents sections={guide.sections} hasFaq={guide.faq.length > 0} />
        <ContentSections sections={guide.sections} locale={locale} />
        {guide.faq.length > 0 && <ContentFaq items={guide.faq} />}
        <GuideCta locale={locale} subject={guideSubject(guide.key)} />
      </article>

      {related.length > 0 && (
        <section aria-labelledby='related-guides' className='container-page py-12'>
          <h2 id='related-guides' className='text-h2 font-extrabold text-ink-900'>
            {t('relatedTitle')}
          </h2>
          <ul className='mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
            {related.map((other) => (
              <li key={other.slug}>
                <GuideCard locale={locale} guide={other} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}
