import { Fragment } from 'react'
import { ArrowRight, Clock } from 'lucide-react'
import { getFormatter, getTranslations } from 'next-intl/server'
import { LOCALE_LABELS } from '@i18n/config'
import { AUTHOR } from '@constants/app'
import type { Locale } from '@constants/puzzle'
import { guidePath, ROUTES } from '@constants/routes'
import { readingMinutes } from '@content/index'
import type { ContentSection, FaqItem, Guide } from '@content/types'
import { plainText } from '@helpers/inlineMarkup'
import { breadcrumbSchema, faqSchema } from '@linkedDataSchema/index'
import { JsonLd } from '@components/seo/JsonLd'
import { AppLink, ButtonLink } from '@components/ui/bare/AppLink'
import { RichText } from './RichText'

/** The anchor of a guide's questions, after its sections. */
const FAQ_ID = 'faq'

export type Crumb = { name: string; path: string }

/** The trail above a guide and its BreadcrumbList JSON-LD, from one list. The last crumb is the page. */
export const Breadcrumbs = async ({ locale, items }: { locale: Locale; items: Crumb[] }) => {
  const t = await getTranslations('Content')
  return (
    <>
      <JsonLd data={breadcrumbSchema(locale, items)} />
      <nav aria-label={t('breadcrumb')} className='text-body-sm text-ink-500'>
        {items.map((item, index) => (
          <Fragment key={item.path}>
            {index > 0 && <span aria-hidden> / </span>}
            {index === items.length - 1 ? (
              <span aria-current='page' className='text-ink-700'>
                {item.name}
              </span>
            ) : (
              <AppLink href={item.path} className='underline-offset-2 hover:text-coral-700 hover:underline'>
                {item.name}
              </AppLink>
            )}
          </Fragment>
        ))}
      </nav>
    </>
  )
}

/** Byline, updated date and reading time, under the `<h1>`. `<time>` carries the machine date. */
export const ContentMeta = async ({ locale, guide }: { locale: Locale; guide: Guide }) => {
  const t = await getTranslations('Content')
  const format = await getFormatter()
  return (
    <p className='mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-body-sm text-ink-500'>
      {/* Who stands behind the text: the About page; the Article's author names the same person. */}
      <span>
        {t.rich('byline', {
          name: AUTHOR.name,
          link: (chunks) => (
            <AppLink href={ROUTES.about} className='underline underline-offset-2 hover:text-coral-700'>
              {chunks}
            </AppLink>
          ),
        })}
      </span>
      <span>
        {t.rich('updated', {
          date: () => <time dateTime={guide.updated}>{format.dateTime(new Date(`${guide.updated}T12:00:00Z`), { dateStyle: 'long' })}</time>,
        })}
      </span>
      <span className='inline-flex items-center gap-1'>
        <Clock aria-hidden className='size-4' />
        {t('readingTime', { minutes: readingMinutes(locale, guide) })}
      </span>
    </p>
  )
}

/** Jump links to a guide's sections and its questions. */
export const TableOfContents = async ({ sections, hasFaq }: { sections: ContentSection[]; hasFaq: boolean }) => {
  const t = await getTranslations('Content')
  if (sections.length < 3) return null
  const items = [...sections.map(({ id, heading }) => ({ id, label: heading })), ...(hasFaq ? [{ id: FAQ_ID, label: t('faqTitle') }] : [])]
  return (
    <nav aria-labelledby='toc-heading' className='mt-8 rounded-panel border-2 border-ink-900 bg-cream-100 p-5'>
      <h2 id='toc-heading' className='eyebrow'>
        {t('toc')}
      </h2>
      <ol className='mt-3 flex list-decimal flex-col gap-1.5 ps-5 marker:text-ink-500'>
        {items.map(({ id, label }) => (
          <li key={id}>
            <a href={`#${id}`} className='text-ink-900 hover:text-coral-700 hover:underline'>
              {label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

/**
 * A guide's questions, open rather than folded (they are what people search for), and the
 * FAQPage JSON-LD from the same strings, marks removed.
 */
export const ContentFaq = async ({ items }: { items: FaqItem[] }) => {
  const t = await getTranslations('Content')
  return (
    <section id={FAQ_ID} className='mt-12 scroll-mt-24' aria-labelledby='faq-heading'>
      <JsonLd data={faqSchema(items.map(({ question, answer }) => ({ question, answer: plainText(answer) })))} />
      <h2 id='faq-heading' className='font-display text-h2 font-extrabold text-ink-900'>
        {t('faqTitle')}
      </h2>
      <div className='mt-5 flex flex-col gap-3'>
        {items.map(({ question, answer }) => (
          <div key={question} className='rounded-panel border-2 border-ink-900 bg-surface p-5'>
            <h3 className='font-display text-h3 font-bold text-ink-900'>{question}</h3>
            <p className='mt-2 leading-relaxed'>
              <RichText text={answer} />
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

/**
 * "Make one now": the end of every guide. A guide about another language opens that language's
 * site — its generator writes every word in that language. The language is named in itself
 * (`LOCALE_LABELS`, «Հայերեն»): a name inside a sentence would need its grammatical case in
 * Russian and many others, which a placeholder cannot give.
 */
export const GuideCta = async ({ locale, subject }: { locale: Locale; subject?: Locale }) => {
  const t = await getTranslations('Content')
  if (subject && subject !== locale) {
    const language = LOCALE_LABELS[subject]
    return (
      <section className='mt-12 rounded-panel border-2 border-ink-900 bg-sun-200 p-6 text-center shadow-chunky sm:p-8'>
        <h2 className='font-display text-h2 font-extrabold text-ink-900'>{t('languageCtaTitle')}</h2>
        <p className='mx-auto mt-2 max-w-xl text-ink-700'>{t('languageCtaText', { language })}</p>
        <div className='mt-5 flex flex-wrap justify-center gap-3'>
          <ButtonLink href={ROUTES.crossword} locale={subject} hrefLang={subject} variant='primary'>
            {t('ctaCrossword')} · <span lang={subject}>{language}</span>
          </ButtonLink>
          <ButtonLink href={ROUTES.scanword} locale={subject} hrefLang={subject} variant='outline'>
            {t('ctaScanword')} · <span lang={subject}>{language}</span>
          </ButtonLink>
        </div>
      </section>
    )
  }
  return (
    <section className='mt-12 rounded-panel border-2 border-ink-900 bg-sun-200 p-6 text-center shadow-chunky sm:p-8'>
      <h2 className='font-display text-h2 font-extrabold text-ink-900'>{t('ctaTitle')}</h2>
      <p className='mx-auto mt-2 max-w-xl text-ink-700'>{t('ctaText')}</p>
      <div className='mt-5 flex flex-wrap justify-center gap-3'>
        <ButtonLink href={ROUTES.crossword} variant='primary'>
          {t('ctaCrossword')}
        </ButtonLink>
        <ButtonLink href={ROUTES.scanword} variant='outline'>
          {t('ctaScanword')}
        </ButtonLink>
      </div>
    </section>
  )
}

export const GuideCard = async ({ locale, guide, headingLevel: Heading = 'h3' }: { locale: Locale; guide: Guide; headingLevel?: 'h2' | 'h3' }) => {
  const t = await getTranslations('Content')
  return (
    <AppLink
      href={guidePath(guide.slug)}
      className='group flex h-full flex-col rounded-panel border-2 border-ink-900 bg-surface p-5 transition-all hover:-translate-y-0.5 hover:shadow-chunky'
    >
      <Heading className='font-display text-h3 font-bold text-ink-900 group-hover:text-coral-700'>{guide.shortTitle}</Heading>
      <p className='mt-2 flex-1 text-body-sm leading-relaxed text-ink-700'>{guide.description}</p>
      <span className='mt-4 inline-flex items-center gap-1 text-caption font-bold text-ink-500'>
        {t('readingTime', { minutes: readingMinutes(locale, guide) })}
        <ArrowRight aria-hidden className='size-3.5 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100' />
      </span>
    </AppLink>
  )
}
