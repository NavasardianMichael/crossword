import type { Locale } from './puzzle'

/**
 * What a letter is in each language's grid. Every word is stored, measured, laid out and
 * checked as a list of **cell tokens**, never as a JavaScript string length.
 *
 * - Russian folds `ё` into `е`, as Russian crosswords do; `й` stays its own letter.
 * - Armenian has two letters that are not one code point each in typing: `ու` (two code
 *   points, one letter, one cell) and `և` (one code point, one cell). `'և'.toUpperCase()` is
 *   the classical `ԵՒ`, so grid letters are uppercased by `displayCell`, never by CSS.
 *
 * **Twin file.** `src/constants/alphabet.ts` (web) and `server/src/lib/alphabet.ts` (API) must
 * stay byte-identical below the marker line — `tests/unit/twins.spec.ts` fails on drift.
 */
// --- twin: keep identical below this line ---

/** Every token a cell can hold, per locale. */
export const ALPHABETS: Record<Locale, readonly string[]> = {
  en: [...'abcdefghijklmnopqrstuvwxyz'],
  ru: [...'абвгдежзийклмнопрстуфхцчшщъыьэюя'],
  // The 38 letters U+0561–U+0586 without the bare `ւ`, plus `ու` and `և`: 39 letters.
  hy: [...'աբգդեզէըթժիլխծկհձղճմյնշոչպջռսվտրցփքօֆ', 'ու', 'և'],
}

const TOKENS: Record<Locale, ReadonlySet<string>> = {
  en: new Set(ALPHABETS.en),
  ru: new Set(ALPHABETS.ru),
  hy: new Set(ALPHABETS.hy),
}

/** Letters per locale, as written in a clue — used to tell the language of a text apart. */
export const SCRIPTS: Record<Locale, RegExp> = {
  en: /[a-z]/i,
  ru: /[а-яё]/i,
  hy: /[Ա-և]/,
}

/**
 * Stress marks, soft hyphens and zero-width characters a model sometimes leaves in a word,
 * plus Armenian accent, emphasis and question marks (՛ ՜ ՞) and the abbreviation mark (՟).
 * Only these: decomposing and dropping every combining mark would turn `й` into `и`.
 */
const STRIPPED = /[̀́­​-‍⁠﻿՛՜՞՟]/g

/** Splits a normalized word into cell tokens; Armenian `ու` is one token. */
export const toCells = (word: string, locale: Locale): string[] => {
  const chars = [...word]
  if (locale !== 'hy') return chars
  const cells: string[] = []
  for (let i = 0; i < chars.length; i++) {
    if (chars[i] === 'ո' && chars[i + 1] === 'ւ') {
      cells.push('ու')
      i++
    } else {
      cells.push(chars[i]!)
    }
  }
  return cells
}

/**
 * A model's word as the grid stores it: one lowercase word in the locale's alphabet, or `null`
 * when it is not one (two words, a hyphen, a digit, another script, classical spelling…).
 */
export const normalizeWord = (raw: string, locale: Locale): string | null => {
  let word = raw.normalize('NFC').trim().replace(STRIPPED, '').toLocaleLowerCase(locale)
  if (!word || /[^\p{L}]/u.test(word)) return null

  if (locale === 'ru') word = word.replaceAll('ё', 'е')
  if (locale === 'hy') {
    // `եւ` is how `և` is spelled out in classical orthography and in some fonts' uppercase.
    word = word.replaceAll('եւ', 'և')
    // In reformed orthography `ւ` only lives inside `ու`; anywhere else the word is classical.
    if (word.replaceAll('ու', '').includes('ւ')) return null
  }

  const cells = toCells(word, locale)
  return cells.every((cell) => TOKENS[locale].has(cell)) ? word : null
}

/** Length in cells. */
export const cellCount = (word: string, locale: Locale): number => toCells(word, locale).length

/** How a token is printed in a cell. `և` has no single uppercase form, so it stays as typed. */
export const displayCell = (token: string, locale: Locale): string =>
  token === 'և' ? token : token.toLocaleUpperCase(locale)

/** A word printed in grid capitals: `Երևան` → `ԵՐևԱՆ`, not the classical `ԵՐԵՒԱՆ`. */
export const displayWord = (word: string, locale: Locale): string =>
  toCells(word, locale)
    .map((cell) => displayCell(cell, locale))
    .join('')

/** A keystroke as a cell token, or `null` when it is not a letter of this locale. */
export const foldTyped = (key: string, locale: Locale): string | null => {
  let token = key.normalize('NFC').toLocaleLowerCase(locale)
  if (locale === 'ru' && token === 'ё') token = 'е'
  return TOKENS[locale].has(token) ? token : null
}

/**
 * A keystroke that completes the token in the previous cell instead of filling a new one:
 * Armenian `ո` then `ւ` is the letter `ու`. `null` when the two do not combine.
 */
export const mergeTyped = (previous: string, key: string, locale: Locale): string | null => {
  const joined = previous + key.normalize('NFC').toLocaleLowerCase(locale)
  return joined !== previous && TOKENS[locale].has(joined) ? joined : null
}
