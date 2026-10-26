import en from '@messages/en.json'
import hy from '@messages/hy.json'
import ru from '@messages/ru.json'
import { createTranslator } from 'next-intl'
import { type Locale, LOCALE_LABELS, LOCALES } from '@i18n/config'
import { localePath } from '@i18n/pathname'
import { APP_NAME, AUTHOR } from '@constants/app'
import { DIFFICULTIES, FORMATS, GRID_SPECS, SIZES, TOPICS } from '@constants/puzzle'
import { ROUTES, topicPath } from '@constants/routes'
import { absoluteUrl } from '@helpers/url'

/**
 * `/llms.txt` and `/llms-full.txt` (llmstxt.org): the site described for AI assistants and
 * answer engines, in Markdown. Built from the catalogues and the puzzle constants, so it can
 * never drift from what the pages say. Every URL is absolute and locale-prefixed.
 */
const MESSAGES = { en, ru, hy } as const

const translator = (locale: Locale) => createTranslator({ locale, messages: MESSAGES[locale] })

type Section = { title: string; paragraphs: string[] }
type FaqGroup = { title: string; items: { question: string; answer: string }[] }

const url = (locale: Locale, path: string) => absoluteUrl(localePath(locale, path))

/** Facts an answer engine can quote, from the constants the app itself runs on. */
const keyFacts = (): string[] => {
  const grid = (format: (typeof FORMATS)[number]) =>
    SIZES.map((size) => `${GRID_SPECS[format][size].width}×${GRID_SPECS[format][size].height}`).join(' / ')
  return [
    'Free to play, with no account and no sign-up.',
    `Languages: ${LOCALES.map((locale) => LOCALE_LABELS[locale]).join(', ')} — each with its own word pool, written natively, not translated.`,
    `Formats: classic crossword (numbered Across/Down clue lists; ${grid('classic')} grids) and scanword (clues inside the grid with arrows; ${grid('scanword')} grids).`,
    `${TOPICS.length} topics, ${DIFFICULTIES.length} difficulty levels (easy, medium, hard) and ${SIZES.length} sizes (small, medium, large).`,
    'No repeats: each device remembers the words it has shown and excludes them from every new puzzle.',
    'Words and clues are proposed by an AI model (Google Gemini); code builds the grid and drops any invalid word or clue.',
    'A progressive web app: installable, and puzzles already opened play offline. Puzzles can be shared by link and printed.',
    `Made by ${AUTHOR.name} (${AUTHOR.url}).`,
  ]
}

const pageLinks = (locale: Locale): string[] => {
  const t = translator(locale)
  const link = (title: string, path: string, description: string) =>
    `- [${title}](${url(locale, path)}): ${description}`
  return [
    link(t('Seo.homeTitle'), ROUTES.home, t('Seo.homeDescription')),
    link(t('Seo.crosswordTitle'), ROUTES.crossword, t('Seo.crosswordDescription')),
    link(t('Seo.scanwordTitle'), ROUTES.scanword, t('Seo.scanwordDescription')),
    link(t('Seo.rulesTitle'), ROUTES.rules, t('Seo.rulesDescription')),
    link(t('Seo.faqTitle'), ROUTES.faq, t('Seo.faqDescription')),
    link(t('Seo.aboutTitle'), ROUTES.about, t('Seo.aboutDescription')),
    link(t('Seo.topicsTitle'), ROUTES.topics, t('Seo.topicsDescription')),
    ...TOPICS.map((topic) =>
      link(
        t('Seo.topicTitle', { topic: t(`Topics.${topic}.name`) }),
        topicPath(topic),
        t(`Topics.${topic}.description`)
      )
    ),
  ]
}

const header = (): string[] => [
  `# ${APP_NAME}`,
  '',
  `> ${translator('en')('Common.tagline')}`,
  '',
  ...keyFacts().map((fact) => `- ${fact}`),
]

export const buildLlmsTxt = (): string =>
  [
    ...header(),
    '',
    ...LOCALES.flatMap((locale) => ['', `## ${LOCALE_LABELS[locale]}`, '', ...pageLinks(locale)]),
    '',
    '## Optional',
    '',
    `- [Full text](${absoluteUrl('/llms-full.txt')}): About, How to play and every FAQ answer, in all three languages`,
    `- [Privacy policy](${url('en', ROUTES.privacy)}): what is stored, where, and why`,
    `- [Sitemap](${absoluteUrl('/sitemap.xml')})`,
    '',
  ].join('\n')

const longForm = (locale: Locale): string[] => {
  const t = translator(locale)
  const sections = (namespace: 'About' | 'Rules') => [
    `### ${t(`${namespace}.title`)} (${url(locale, namespace === 'About' ? ROUTES.about : ROUTES.rules)})`,
    '',
    ...(t.raw(`${namespace}.sections`) as Section[]).flatMap(({ title, paragraphs }) => [
      `#### ${title}`,
      '',
      ...paragraphs.flatMap((paragraph) => [paragraph, '']),
    ]),
  ]
  const faq = (t.raw('Faq.groups') as FaqGroup[]).flatMap(({ title, items }) => [
    `#### ${title}`,
    '',
    ...items.flatMap(({ question, answer }) => [`**${question}**`, '', answer, '']),
  ])
  return [
    `## ${LOCALE_LABELS[locale]}`,
    '',
    ...sections('About'),
    ...sections('Rules'),
    `### ${t('Faq.title')} (${url(locale, ROUTES.faq)})`,
    '',
    ...faq,
  ]
}

export const buildLlmsFullTxt = (): string => [...header(), '', ...LOCALES.flatMap(longForm)].join('\n')
