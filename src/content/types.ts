import type { Locale } from '@constants/puzzle'

/**
 * The guides (`/[lang]/guides/<slug>`): articles as typed data, one file per page in
 * `guides/<locale>/<slug>.ts`, written natively in that language — never translated from
 * another one. Text fields take two inline marks, rendered by `RichText`: `[label](/path)`
 * links (locale-free paths; the page's language is added) and `**bold**`.
 * `tests/unit/content` checks the rest — registry, slugs, lengths, links, related pages,
 * punctuation.
 */

export type ContentBlock =
  | { kind: 'p'; text: string }
  | { kind: 'list'; items: string[]; ordered?: boolean }
  /** A highlighted piece of advice. */
  | { kind: 'tip'; text: string }
  /** The same thing done poorly, then well: a vague clue and a sharp one. */
  | { kind: 'compare'; weak: string; strong: string }
  /** Sample clues with their answers, the answer hidden until opened. */
  | { kind: 'clues'; items: { clue: string; answer: string }[] }

export type ContentSection = {
  /** The heading's anchor, for the table of contents: lowercase Latin, dashes. */
  id: string
  heading: string
  blocks: ContentBlock[]
}

export type FaqItem = { question: string; answer: string }

/** The subjects every language may write a guide on. */
export const GUIDE_TOPICS = ['make', 'solve', 'scanword', 'teachers'] as const

export type GuideTopic = (typeof GUIDE_TOPICS)[number]

/**
 * What a guide is about, the same in every language: guides sharing a key are one page in
 * several languages (`hreflang`). `language-hy` is "crosswords in Armenian" — written in
 * Armenian for Armenian searches («հայերեն խաչբառ»), and in English for "armenian crossword".
 */
export type GuideKey = GuideTopic | `language-${Locale}`

export type Guide = {
  key: GuideKey
  /** The URL's last part, in Latin letters: the main search phrase (`hayeren-khachbar`). */
  slug: string
  /** The `<h1>` and the Article headline. */
  title: string
  /** For cards and the breadcrumb. */
  shortTitle: string
  /** `<title>`: the main search phrase first, no brand (the layout adds it). */
  metaTitle: string
  /** The meta description. */
  description: string
  /**
   * The title in Latin letters, as many people type a non-Latin language (`hayeren khachbar`):
   * the Article's `alternativeHeadline`. Left out for Latin-script languages.
   */
  latinTitle?: string
  /**
   * Other ways people search for this — Latin-lettered and English phrasings included: the
   * Article's `keywords` in JSON-LD only. Never shown as a list on the page (Google's spam
   * policies name "keywords in a list or group" as keyword stuffing); visible text says these
   * things in sentences.
   */
  searchTerms: string[]
  /** ISO dates (YYYY-MM-DD). Bump `updated` whenever the text changes: it is the sitemap `lastmod`. */
  published: string
  updated: string
  intro: string[]
  sections: ContentSection[]
  faq: FaqItem[]
  /** Other guides in the same language, by key. */
  related: GuideKey[]
}
