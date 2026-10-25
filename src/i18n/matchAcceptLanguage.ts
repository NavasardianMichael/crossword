import { DEFAULT_LOCALE, type Locale, LOCALES } from './config'

type WeightedTag = {
  tag: string
  quality: number
}

/** `en-GB,en;q=0.9,es;q=0.8` → tags sorted by descending quality, `q=0` dropped. */
const parseAcceptLanguage = (header: string): WeightedTag[] =>
  header
    .split(',')
    .map((part): WeightedTag | null => {
      const [tag, ...params] = part.trim().split(';')
      if (!tag || tag === '*') return null

      const qParam = params.find((param) => param.trim().startsWith('q='))
      const parsed = qParam ? Number.parseFloat(qParam.trim().slice(2)) : 1
      // An unparseable q falls back to 1, the spec's default, rather than
      // dropping the tag — a typo in one parameter should not cost a user their
      // language. Only an explicit `q=0`, which means "refuse this", drops it.
      const quality = Number.isFinite(parsed) ? parsed : 1

      return quality > 0 ? { tag: tag.trim().toLowerCase(), quality } : null
    })
    .filter((entry): entry is WeightedTag => entry !== null)
    // Stable sort keeps header order within one quality, which is the tie-break
    // the spec implies: an earlier tag is the more preferred one.
    .sort((a, b) => b.quality - a.quality)

const primarySubtag = (tag: string): string => tag.split('-')[0] ?? tag

/**
 * Picks the best supported locale for an `Accept-Language` header.
 *
 * Deliberately **not** the BCP-47 "lookup" algorithm, which truncates the
 * *requested* tag only as far as a bare subtag, which a region-tagged locale would
 * never match. Matching on the primary subtag gives `hy-AM` and `ru-KZ` their language.
 *
 * Quality is the user's stated preference, so it is the **outer** loop: each tag
 * is tried exactly, then by primary subtag, before moving to the next-preferred
 * tag. Resolving all exact matches first would let a lower-quality tag win —
 * `en;q=0.9, hy-AM;q=1.0` would serve English, because `en` happens to be a tag
 * we ship, despite the user asking for Armenian first.
 */
export const matchAcceptLanguage = (header: string | null | undefined): Locale => {
  if (!header) return DEFAULT_LOCALE

  const requested = parseAcceptLanguage(header)
  if (requested.length === 0) return DEFAULT_LOCALE

  const byLowercase = new Map<string, Locale>(LOCALES.map((locale) => [locale.toLowerCase(), locale]))

  const byPrimary = new Map<string, Locale>()
  // Built in LOCALES order, and only the first wins, so the order decides which
  // variant represents a language once one ships with a region.
  for (const locale of LOCALES) {
    const primary = primarySubtag(locale.toLowerCase())
    if (!byPrimary.has(primary)) byPrimary.set(primary, locale)
  }

  for (const { tag } of requested) {
    const exact = byLowercase.get(tag)
    if (exact) return exact

    const fallback = byPrimary.get(primarySubtag(tag))
    if (fallback) return fallback
  }

  return DEFAULT_LOCALE
}
