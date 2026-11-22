import type { Locale } from '@constants/puzzle'

/**
 * Text on the PDF in any of the 33 languages. Rubik and Nunito draw Latin (Vietnamese included,
 * in Nunito) and Cyrillic; every other script has a Noto Sans font of its own
 * (`scripts/pdf-fonts.py`), loaded only when the sheet has text in it. A line is drawn as runs,
 * one font each; a right-to-left line is put in visual order first (`visualRuns`).
 */
export const PDF_SCRIPTS = ['armenian', 'greek', 'arabic', 'hebrew', 'devanagari', 'bengali', 'tamil', 'thai', 'sc', 'jp', 'kr'] as const

export type PdfScript = (typeof PDF_SCRIPTS)[number]

const SCRIPT_RANGES: [Exclude<PdfScript, 'sc' | 'jp' | 'kr'>, RegExp][] = [
  ['armenian', /[԰-֏ﬓ-ﬗ]/],
  ['greek', /[Ͱ-Ͽἀ-῿]/],
  ['arabic', /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/],
  ['hebrew', /[֐-׿יִ-ﭏ]/],
  ['devanagari', /[ऀ-ॿ꣠-ꣿ᳐-᳿]/],
  ['bengali', /[ঀ-৿]/],
  ['tamil', /[஀-௿]/],
  ['thai', /[฀-๿]/],
]

const HANGUL = /[ᄀ-ᇿ㄰-㆏가-힣]/
const KANA = /[぀-ヿ]/
const CJK = /[ᄀ-ᇿ　-ヿ㄰-㆏㐀-䶿一-鿿가-힣豈-﫿＀-￯]/

/** Han characters are drawn in the puzzle's own CJK font: the same character differs by country. */
const CJK_FONT: Partial<Record<Locale, PdfScript>> = { zh: 'sc', ja: 'jp', ko: 'kr' }

/** The script font a character needs, or `undefined` when Rubik / Nunito draw it. */
export const scriptOf = (char: string, locale: Locale): PdfScript | undefined => {
  for (const [script, range] of SCRIPT_RANGES) if (range.test(char)) return script
  if (!CJK.test(char)) return undefined
  return CJK_FONT[locale] ?? (HANGUL.test(char) ? 'kr' : KANA.test(char) ? 'jp' : 'sc')
}

/** Every script font a set of texts needs. */
export const scriptsIn = (texts: readonly string[], locale: Locale): PdfScript[] => {
  const scripts = new Set<PdfScript>()
  for (const text of texts) {
    for (const char of text) {
      const script = scriptOf(char, locale)
      if (script) scripts.add(script)
    }
  }
  return PDF_SCRIPTS.filter((script) => scripts.has(script))
}

/** A font as the layout sees it: what it can draw. */
export type RunFont = { chars: ReadonlySet<number> }

/** A face: its own font first, its fallbacks, and a font per script the sheet loaded. */
export type RunFace<F extends RunFont> = { primary: F; fallbacks: readonly F[]; scripts: Partial<Record<PdfScript, F>> }

export type TextRun<F> = { text: string; font: F }

/** Marks and joiners belong to the letter before them: splitting them off would break shaping. */
const JOINS_PREVIOUS = /[\p{M}‌‍]/u
const LETTER = /\p{L}/u

const fontFor = <F extends RunFont>(char: string, face: RunFace<F>, locale: Locale, previous?: F): F => {
  const script = scriptOf(char, locale)
  const own = script ? face.scripts[script] : undefined
  if (own) return own
  const code = char.codePointAt(0)!
  if (previous && JOINS_PREVIOUS.test(char)) return previous
  // Spaces, digits and punctuation stay in the run they are in, so an Arabic phrase or a Hindi
  // clue is one run: one shaping context, one direction.
  if (previous && !LETTER.test(char) && previous.chars.has(code)) return previous
  return [face.primary, ...face.fallbacks, ...Object.values(face.scripts)].find((font) => font?.chars.has(code)) ?? face.primary
}

/** Logical text split into runs of one font each. */
export const fontRuns = <F extends RunFont>(text: string, face: RunFace<F>, locale: Locale): TextRun<F>[] => {
  const runs: TextRun<F>[] = []
  for (const char of text) {
    const last = runs.at(-1)
    const font = fontFor(char, face, locale, last?.font)
    if (last && last.font === font) last.text += char
    else runs.push({ text: char, font })
  }
  return runs
}

const STRONG_RTL = /[֐-ࣿיִ-﷿ﹰ-﻿]/

/** What `visualRuns` needs from a bidi implementation (`bidi-js`). */
export type Bidi = {
  getEmbeddingLevels: (text: string, direction: 'ltr' | 'rtl') => { levels: Uint8Array }
  getReorderedIndices: (text: string, levels: { levels: Uint8Array }) => number[]
  getMirroredCharacter: (char: string) => string | null
}

/**
 * A right-to-left line as runs in drawing order, left to right (Unicode bidi): numbers and Latin
 * words inside it stay left-to-right, brackets mirror. The font shaper (fontkit) reverses a run
 * of Arabic or Hebrew letters itself, so such a run is handed over in logical order — which its
 * joining needs — and only a run without those letters is reversed here.
 */
export const visualRuns = <F extends RunFont>(text: string, face: RunFace<F>, locale: Locale, bidi: Bidi): TextRun<F>[] => {
  const levels = bidi.getEmbeddingLevels(text, 'rtl')
  const groups: { level: number; indices: number[] }[] = []
  for (const index of bidi.getReorderedIndices(text, levels)) {
    const level = levels.levels[index]!
    const last = groups.at(-1)
    if (last && last.level === level) last.indices.push(index)
    else groups.push({ level, indices: [index] })
  }
  return groups.flatMap(({ level, indices }) => {
    if (level % 2 === 0) return fontRuns(indices.map((index) => text[index]).join(''), face, locale)
    const logical = indices
      .reverse()
      .map((index) => bidi.getMirroredCharacter(text[index]!) ?? text[index])
      .join('')
    return fontRuns(logical, face, locale)
      .reverse()
      .map((run) => (STRONG_RTL.test(run.text) ? run : { ...run, text: [...run.text].reverse().join('') }))
  })
}
