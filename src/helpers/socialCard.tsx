import { ImageResponse } from 'next/og'
import { createTranslator } from 'next-intl'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { LOCALE_LABELS } from '@i18n/config'
import { OG_IMAGE_SIZE } from '@constants/app'
import type { Locale, PuzzleView } from '@constants/puzzle'
import { getSiteUrl } from '@helpers/url'
import { PuzzleCard, SiteCard } from '@components/brand/SocialCard'

/**
 * The faces the link-preview cards render with — the PDF's static TrueType files, read from
 * `public/` (the standalone release carries it, and is the working directory). satori's own
 * font has no bold and no Armenian; it falls back glyph by glyph through this list.
 */
const FONT_FILES = [
  { name: 'Rubik', file: 'rubik-bold.ttf', weight: 700 },
  { name: 'Nunito', file: 'nunito-regular.ttf', weight: 400 },
  { name: 'Nunito', file: 'nunito-bold.ttf', weight: 700 },
  { name: 'Noto Sans Armenian', file: 'noto-sans-armenian-regular.ttf', weight: 400 },
  { name: 'Noto Sans Armenian', file: 'noto-sans-armenian-bold.ttf', weight: 700 },
] as const

type SocialCardFont = { name: string; data: Buffer; weight: 400 | 700; style: 'normal' }

let fonts: Promise<SocialCardFont[]> | undefined

const loadFonts = (): Promise<SocialCardFont[]> => {
  fonts ??= Promise.all(
    FONT_FILES.map(async ({ name, file, weight }) => ({
      name,
      weight,
      style: 'normal' as const,
      // eslint-disable-next-line security/detect-non-literal-fs-filename -- FONT_FILES is a constant
      data: await readFile(path.join(process.cwd(), 'public/fonts/pdf', file)),
    }))
  )
  return fonts
}

/** Route handlers sit outside `[lang]`, so the request config cannot pick the catalogue: it is loaded here. */
const translator = async (locale: Locale) => {
  const messages = (await import(`../messages/${locale}.json`)).default
  return createTranslator({ locale, messages })
}

/** The page's language first among the language chips. */
export const renderSiteCard = async (locale: Locale, init?: ResponseInit) => {
  const t = await translator(locale)
  const languages = [LOCALE_LABELS[locale]]
  return new ImageResponse(
    <SiteCard
      appName={t('Common.appName')}
      eyebrow={t('Home.hero.eyebrow')}
      title={t.raw('Home.hero.title') as string}
      languages={languages}
      host={new URL(getSiteUrl()).host}
    />,
    { ...OG_IMAGE_SIZE, ...init, fonts: await loadFonts() }
  )
}

/** In the puzzle's own language, whoever shares it. */
export const renderPuzzleCard = async (puzzle: PuzzleView, init?: ResponseInit) => {
  const t = await translator(puzzle.locale)
  return new ImageResponse(
    <PuzzleCard
      puzzle={puzzle}
      appName={t('Common.appName')}
      format={t(`Formats.${puzzle.format}.name`)}
      topic={t(puzzle.topic === 'any' ? 'Topics.any' : `Topics.${puzzle.topic}.name`)}
      difficulty={t(`Difficulty.${puzzle.difficulty}`)}
      meta={t('Seo.ogPuzzleMeta', { size: `${puzzle.width}×${puzzle.height}`, words: puzzle.words.length })}
      cta={t('Seo.ogPuzzleCta')}
    />,
    { ...OG_IMAGE_SIZE, ...init, fonts: await loadFonts() }
  )
}
