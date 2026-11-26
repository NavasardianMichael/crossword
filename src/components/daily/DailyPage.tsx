import { CalendarDays, Play } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import type { DailyView } from '@api/puzzles/types'
import { CONTENT_UPDATED_AT } from '@constants/legal'
import type { Locale } from '@constants/puzzle'
import { puzzlePath, ROUTES } from '@constants/routes'
import { breadcrumbSchema, dailyPageSchema } from '@linkedDataSchema/index'
import { FaqSection } from '@components/marketing/FaqSection'
import { JsonLd } from '@components/seo/JsonLd'
import { AppLink, ButtonLink } from '@components/ui/bare/AppLink'
import { PageHeader } from '@components/ui/layout/PageHeader'
import { Section } from '@components/ui/layout/Section'
import { DailyClueLists } from './DailyClueLists'
import { DailyGridPreview } from './DailyGridPreview'
import { DailyStreak } from './DailyStreak'

/**
 * `/[lang]/daily`: one URL per language, its puzzle new at 00:00 UTC. The page ranks on its
 * evergreen copy (what the daily is, the FAQ) and carries the day's clues as text; title,
 * description and structured data never change with the day, so nothing needs reindexing daily.
 * The board opens on the puzzle's own page (`/p/<id>`, noindex), where its words join the
 * device's seen-list as any opened puzzle's do.
 */
const ABOUT_PARAGRAPHS = 3
const FAQ_COUNT = 5

const formatDay = (day: string, locale: Locale) =>
  new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${day}T00:00:00Z`))

export const DailyPage = async ({ locale, daily }: { locale: Locale; daily: DailyView | null }) => {
  const t = await getTranslations('Daily')
  const seo = await getTranslations('Seo')
  const nav = await getTranslations('Nav')
  const appName = (await getTranslations('Common'))('appName')
  const today = daily?.today ?? null
  const linkClass = 'font-bold text-teal-700 underline-offset-4 hover:text-coral-700 hover:underline'

  return (
    <>
      <JsonLd
        data={dailyPageSchema(
          { locale, name: seo('dailyTitle'), description: seo('dailyDescription'), path: ROUTES.daily, dateModified: CONTENT_UPDATED_AT },
          { name: t('title'), description: t('subtitle'), siteName: appName }
        )}
      />
      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: nav('home'), path: ROUTES.home },
          { name: nav('daily'), path: ROUTES.daily },
        ])}
      />

      <PageHeader
        eyebrow={
          <span className='inline-flex items-center gap-2'>
            <CalendarDays aria-hidden className='size-4' />
            {t('eyebrow')}
          </span>
        }
        title={t('title')}
        subtitle={t('subtitle')}
        actions={
          daily && (
            <>
              <p className='inline-flex items-center rounded-full border-2 border-teal-600 bg-teal-100 px-4 py-1.5 font-display font-bold text-ink-900'>
                <time dateTime={daily.date}>{t('today', { date: formatDay(daily.date, locale) })}</time>
              </p>
              <DailyStreak today={daily.date} dailies={[...(today ? [{ id: today.id, date: today.date }] : []), ...daily.previous]} />
            </>
          )
        }
      />

      {today ? (
        <Section id='today' title={t('todayTitle')} subtitle={t('todaySubtitle', { count: today.words.length })}>
          <div className='grid items-start gap-10 lg:grid-cols-[minmax(0,26rem)_1fr]'>
            <div className='flex flex-col items-center gap-5'>
              <DailyGridPreview today={today} locale={locale} label={t('gridLabel', { width: today.width, height: today.height })} />
              <ButtonLink href={puzzlePath(today.id)} variant='primary' size='lg'>
                <Play aria-hidden className='size-5' />
                {t('play')}
              </ButtonLink>
            </div>
            <DailyClueLists locale={locale} words={today.words} />
          </div>
        </Section>
      ) : (
        <Section id='today'>
          <p className='mx-auto max-w-2xl rounded-panel border-2 border-dashed border-line-strong bg-cream-200/60 p-6 text-center text-ink-700'>
            {t('unavailable')}
          </p>
        </Section>
      )}

      {daily?.yesterday && (
        <Section id='yesterday' title={t('yesterdayTitle')} subtitle={formatDay(daily.yesterday.date, locale)}>
          <details className='rounded-panel border-2 border-ink-900 bg-white p-5'>
            <summary className='cursor-pointer font-display font-bold text-teal-700'>{t('yesterdayShow')}</summary>
            <div className='mt-6'>
              <DailyClueLists locale={locale} answers={daily.yesterday.words} />
            </div>
          </details>
          <p className='mt-4'>
            <AppLink href={puzzlePath(daily.yesterday.id)} className={linkClass}>
              {t('yesterdayPlay')}
            </AppLink>
          </p>
        </Section>
      )}

      {daily && daily.previous.length > 1 && (
        <Section id='previous' title={t('previousTitle')}>
          <ul className='flex flex-wrap gap-3'>
            {daily.previous.map(({ id, date }) => (
              <li key={id}>
                <AppLink href={puzzlePath(id)} className='inline-flex rounded-full border-2 border-ink-900 bg-white px-4 py-2 font-display font-bold text-ink-900 hover:bg-sun-200'>
                  <time dateTime={date}>{formatDay(date, locale)}</time>
                </AppLink>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section id='about' title={t('aboutTitle')}>
        <div className='flex max-w-3xl flex-col gap-4 text-ink-700'>
          {Array.from({ length: ABOUT_PARAGRAPHS }, (_, index) => (
            <p key={index}>{t(`about${index + 1}`)}</p>
          ))}
        </div>
        <div className='mt-8 flex flex-col items-start gap-3 rounded-panel border-2 border-ink-900 bg-sun-100 p-6'>
          <h3 className='font-display text-h3 font-extrabold text-ink-900'>{t('makeOwnTitle')}</h3>
          <p className='text-ink-700'>{t('makeOwnText')}</p>
          <ButtonLink href={ROUTES.crossword} variant='secondary'>
            {t('makeOwnCta')}
          </ButtonLink>
        </div>
      </Section>

      <Section id='faq' title={t('faqTitle')} align='center'>
        <FaqSection namespace='Daily' count={FAQ_COUNT} />
        <p className='mt-6 text-center'>
          <AppLink href={ROUTES.rules} className={linkClass}>
            {t('rulesLink')}
          </AppLink>
        </p>
      </Section>
    </>
  )
}
