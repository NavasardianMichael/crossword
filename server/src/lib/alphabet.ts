import type { Locale } from './puzzle.js'

/**
 * What a letter is in each language's grid. Every word is stored, measured, laid out and
 * checked as a list of **cell tokens**, never as a JavaScript string length.
 *
 * - Russian folds `ё` into `е`. Armenian `ու` is two code points and one cell; `և` stays `և`.
 * - Latin crosswords that ignore accents (Spanish `ñ` kept, German `äöü` kept, `ß` written `ss`)
 *   fold the marks. Polish, Czech, Hungarian, Romanian, Swedish and Vietnamese keep theirs.
 * - Dutch `ij` is one cell. Greek tonos is dropped and final `ς` is `σ`.
 * - Hindi, Marathi, Bengali, Tamil and Thai cells are Unicode grapheme clusters, so a vowel
 *   sign shares its consonant's cell. Chinese is one Han character per cell; Korean is one
 *   Hangul syllable, typed as jamo. Japanese answers are hiragana.
 *
 * **Twin file.** `src/constants/alphabet.ts` (web) and `server/src/lib/alphabet.ts` (API) must
 * stay byte-identical below the marker line — `tests/unit/twins.spec.ts` fails on drift.
 */
// --- twin: keep identical below this line ---

const LETTERS = (text: string): readonly string[] => [...text]

/** Every token a cell can hold, per locale. `zh` and `ko` are open: any Han character, any syllable. */
export const ALPHABETS: Record<Locale, readonly string[]> = {
  en: LETTERS('abcdefghijklmnopqrstuvwxyz'),
  ru: LETTERS('абвгдежзийклмнопрстуфхцчшщъыьэюя'),
  hy: [...LETTERS('աբգդեզէըթժիլխծկհձղճմյնշոչպջռսվտրցփքօֆ'), 'ու', 'և'],
  es: LETTERS('abcdefghijklmnopqrstuvwxyzñ'),
  pt: LETTERS('abcdefghijklmnopqrstuvwxyz'),
  fr: [...LETTERS('abcdefghijklmnopqrstuvwxyz'), 'œ'],
  de: LETTERS('abcdefghijklmnopqrstuvwxyzäöü'),
  id: LETTERS('abcdefghijklmnopqrstuvwxyz'),
  it: LETTERS('abcdefghijklmnopqrstuvwxyz'),
  pl: LETTERS('aąbcćdeęfghijklłmnńoópqrsśtuvwxyzźż'),
  vi: LETTERS('aàảãáạăằẳẵắặâầẩẫấậbcdđeèẻẽéẹêềểễếệghiìỉĩíịklmnoòỏõóọôồổỗốộơờởỡớợpqrstuùủũúụưừửữứựvxyỳỷỹýỵ'),
  uk: LETTERS('абвгґдеєжзиіїйклмнопрстуфхцчшщьюя'),
  ar: [...LETTERS('ابتثجحخدذرزسشصضطظعغفقكلمنهوي'), 'ة', 'ى', 'ء'],
  hi: LETTERS('अआइईउऊएऐओऔऋकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह'),
  ko: [],
  bn: LETTERS('অআইঈউঊএঐওঔকখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহ'),
  ja: [
    ...LETTERS('あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん'),
    ...LETTERS('がぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽ'),
    ...LETTERS('ぁぃぅぇぉゃゅょっ'),
    'ー',
  ],
  zh: [],
  fa: LETTERS('ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی'),
  nl: [...LETTERS('abcdefghijklmnopqrstuvwxyz'), 'ij'],
  ro: LETTERS('aăâbcdefghiîjklmnopqrsștțuvwxyz'),
  el: LETTERS('αβγδεζηθικλμνξοπρστυφχψω'),
  cs: LETTERS('aábcčdďeéěfghiíjklmnňoópqrřsštťuúůvwxyýzž'),
  sv: LETTERS('abcdefghijklmnopqrstuvwxyzåäö'),
  hu: LETTERS('aábcdeéfghiíjklmnoóöőpqrstuúüűvwxyz'),
  he: LETTERS('אבגדהוזחטיכךלמםנןסעפףצץקרשת'),
  fil: LETTERS('abcdefghijklmnopqrstuvwxyz'),
  ms: LETTERS('abcdefghijklmnopqrstuvwxyz'),
  ur: LETTERS('ابپتثٹجچحخدڈذرڑزژسشصضطظعغفقکگلمنںوہھیےء'),
  th: LETTERS('กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮะาเแโใไ'),
  ta: LETTERS('அஆஇஈஉஊஎஏஐஒஓஔகஙசஜஞடணதநபமயரலவழளறனஷஸஹ'),
  sw: LETTERS('abcdefghijklmnopqrstuvwxyz'),
  mr: LETTERS('अआइईउऊएऐओऔऋॲऑकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसहळ'),
}

/**
 * Keys that complete the previous cell instead of filling the next one: vowel signs, virama,
 * Thai tone marks. Not stored as answers on their own.
 */
export const COMBINERS: Partial<Record<Locale, readonly string[]>> = {
  hi: LETTERS('ािीुूृेैोौंँ्ः़'),
  mr: LETTERS('ािीुूृेैोौंँ्ः़ॅॉ'),
  bn: LETTERS('ািীুূেৈোৌংঁ্ঃ়'),
  ta: LETTERS('ாிீுூெேைொோௌ்'),
  th: LETTERS('่้๊๋ัิีึืุู็์ํ๎ำ'),
}

/** Cells are extended grapheme clusters, not code points. */
export const GRAPHEME_LOCALES = new Set<Locale>(['hi', 'mr', 'bn', 'ta', 'th'])

/** Any character of the script is a cell. The on-screen keyboard is only a starter set. */
export const OPEN_LOCALES = new Set<Locale>(['zh', 'ko'])

const TOKENS: Record<Locale, ReadonlySet<string>> = {
  en: new Set(ALPHABETS.en),
  ru: new Set(ALPHABETS.ru),
  hy: new Set(ALPHABETS.hy),
  es: new Set(ALPHABETS.es),
  pt: new Set(ALPHABETS.pt),
  fr: new Set(ALPHABETS.fr),
  de: new Set(ALPHABETS.de),
  id: new Set(ALPHABETS.id),
  mr: new Set(ALPHABETS.mr),
  it: new Set(ALPHABETS.it),
  pl: new Set(ALPHABETS.pl),
  vi: new Set(ALPHABETS.vi),
  uk: new Set(ALPHABETS.uk),
  ar: new Set(ALPHABETS.ar),
  hi: new Set(ALPHABETS.hi),
  ko: new Set(ALPHABETS.ko),
  bn: new Set(ALPHABETS.bn),
  ja: new Set(ALPHABETS.ja),
  zh: new Set(ALPHABETS.zh),
  fa: new Set(ALPHABETS.fa),
  nl: new Set(ALPHABETS.nl),
  ro: new Set(ALPHABETS.ro),
  el: new Set(ALPHABETS.el),
  cs: new Set(ALPHABETS.cs),
  sv: new Set(ALPHABETS.sv),
  hu: new Set(ALPHABETS.hu),
  he: new Set(ALPHABETS.he),
  fil: new Set(ALPHABETS.fil),
  ms: new Set(ALPHABETS.ms),
  ur: new Set(ALPHABETS.ur),
  th: new Set(ALPHABETS.th),
  ta: new Set(ALPHABETS.ta),
  sw: new Set(ALPHABETS.sw),
}

/**
 * A clue must contain one of these, and must not contain `CLUE_FOREIGN`. Japanese and Korean
 * clues may use Han characters; their answers stay hiragana and Hangul syllables.
 */
const CLUE_PIECE = {
  latin: 'A-Za-z\\u00C0-\\u024F\\u1E00-\\u1EFF',
  cyrillic: '\\u0400-\\u04FF',
  armenian: '\\u0530-\\u058F',
  greek: '\\u0370-\\u03FF',
  hebrew: '\\u0590-\\u05FF',
  arabic: '\\u0600-\\u06FF',
  devanagari: '\\u0900-\\u097F',
  bengali: '\\u0980-\\u09FF',
  tamil: '\\u0B80-\\u0BFF',
  thai: '\\u0E00-\\u0E7F',
  kana: '\\u3040-\\u30FF',
  han: '\\u4E00-\\u9FFF',
  hangul: '\\uAC00-\\uD7A3',
} as const

type CluePiece = keyof typeof CLUE_PIECE

const CLUE_PIECES: Record<Locale, readonly CluePiece[]> = {
  en: ['latin'],
  ru: ['cyrillic'],
  hy: ['armenian'],
  es: ['latin'],
  pt: ['latin'],
  fr: ['latin'],
  de: ['latin'],
  id: ['latin'],
  mr: ['devanagari'],
  it: ['latin'],
  pl: ['latin'],
  vi: ['latin'],
  uk: ['cyrillic'],
  ar: ['arabic'],
  hi: ['devanagari'],
  ko: ['hangul', 'han'],
  bn: ['bengali'],
  ja: ['kana', 'han'],
  zh: ['han'],
  fa: ['arabic'],
  nl: ['latin'],
  ro: ['latin'],
  el: ['greek'],
  cs: ['latin'],
  sv: ['latin'],
  hu: ['latin'],
  he: ['hebrew'],
  fil: ['latin'],
  ms: ['latin'],
  ur: ['arabic'],
  th: ['thai'],
  ta: ['tamil'],
  sw: ['latin'],
}

const characterClass = (pieces: readonly CluePiece[]): RegExp =>
  // eslint-disable-next-line security/detect-non-literal-regexp -- classes come from the fixed CLUE_PIECE table
  new RegExp(`[${pieces.map((piece) => CLUE_PIECE[piece]).join('')}]`, 'u')

export const SCRIPTS: Record<Locale, RegExp> = {
  en: characterClass(CLUE_PIECES.en),
  ru: characterClass(CLUE_PIECES.ru),
  hy: characterClass(CLUE_PIECES.hy),
  es: characterClass(CLUE_PIECES.es),
  pt: characterClass(CLUE_PIECES.pt),
  fr: characterClass(CLUE_PIECES.fr),
  de: characterClass(CLUE_PIECES.de),
  id: characterClass(CLUE_PIECES.id),
  mr: characterClass(CLUE_PIECES.mr),
  it: characterClass(CLUE_PIECES.it),
  pl: characterClass(CLUE_PIECES.pl),
  vi: characterClass(CLUE_PIECES.vi),
  uk: characterClass(CLUE_PIECES.uk),
  ar: characterClass(CLUE_PIECES.ar),
  hi: characterClass(CLUE_PIECES.hi),
  ko: characterClass(CLUE_PIECES.ko),
  bn: characterClass(CLUE_PIECES.bn),
  ja: characterClass(CLUE_PIECES.ja),
  zh: characterClass(CLUE_PIECES.zh),
  fa: characterClass(CLUE_PIECES.fa),
  nl: characterClass(CLUE_PIECES.nl),
  ro: characterClass(CLUE_PIECES.ro),
  el: characterClass(CLUE_PIECES.el),
  cs: characterClass(CLUE_PIECES.cs),
  sv: characterClass(CLUE_PIECES.sv),
  hu: characterClass(CLUE_PIECES.hu),
  he: characterClass(CLUE_PIECES.he),
  fil: characterClass(CLUE_PIECES.fil),
  ms: characterClass(CLUE_PIECES.ms),
  ur: characterClass(CLUE_PIECES.ur),
  th: characterClass(CLUE_PIECES.th),
  ta: characterClass(CLUE_PIECES.ta),
  sw: characterClass(CLUE_PIECES.sw),
}

const ALL_PIECES = Object.keys(CLUE_PIECE) as CluePiece[]

/** Letters of another script in a clue mean the model mixed languages. */
export const CLUE_FOREIGN: Record<Locale, RegExp> = {
  en: characterClass(ALL_PIECES.filter((piece) => !CLUE_PIECES.en.includes(piece))),
  ru: characterClass(ALL_PIECES.filter((piece) => !CLUE_PIECES.ru.includes(piece))),
  hy: characterClass(ALL_PIECES.filter((piece) => !CLUE_PIECES.hy.includes(piece))),
  es: characterClass(ALL_PIECES.filter((piece) => !CLUE_PIECES.es.includes(piece))),
  pt: characterClass(ALL_PIECES.filter((piece) => !CLUE_PIECES.pt.includes(piece))),
  fr: characterClass(ALL_PIECES.filter((piece) => !CLUE_PIECES.fr.includes(piece))),
  de: characterClass(ALL_PIECES.filter((piece) => !CLUE_PIECES.de.includes(piece))),
  id: characterClass(ALL_PIECES.filter((piece) => !CLUE_PIECES.id.includes(piece))),
  mr: characterClass(ALL_PIECES.filter((piece) => !CLUE_PIECES.mr.includes(piece))),
  it: characterClass(ALL_PIECES.filter((piece) => !CLUE_PIECES.it.includes(piece))),
  pl: characterClass(ALL_PIECES.filter((piece) => !CLUE_PIECES.pl.includes(piece))),
  vi: characterClass(ALL_PIECES.filter((piece) => !CLUE_PIECES.vi.includes(piece))),
  uk: characterClass(ALL_PIECES.filter((piece) => !CLUE_PIECES.uk.includes(piece))),
  ar: characterClass(ALL_PIECES.filter((piece) => !CLUE_PIECES.ar.includes(piece))),
  hi: characterClass(ALL_PIECES.filter((piece) => !CLUE_PIECES.hi.includes(piece))),
  ko: characterClass(ALL_PIECES.filter((piece) => !CLUE_PIECES.ko.includes(piece))),
  bn: characterClass(ALL_PIECES.filter((piece) => !CLUE_PIECES.bn.includes(piece))),
  ja: characterClass(ALL_PIECES.filter((piece) => !CLUE_PIECES.ja.includes(piece))),
  zh: characterClass(ALL_PIECES.filter((piece) => !CLUE_PIECES.zh.includes(piece))),
  fa: characterClass(ALL_PIECES.filter((piece) => !CLUE_PIECES.fa.includes(piece))),
  nl: characterClass(ALL_PIECES.filter((piece) => !CLUE_PIECES.nl.includes(piece))),
  ro: characterClass(ALL_PIECES.filter((piece) => !CLUE_PIECES.ro.includes(piece))),
  el: characterClass(ALL_PIECES.filter((piece) => !CLUE_PIECES.el.includes(piece))),
  cs: characterClass(ALL_PIECES.filter((piece) => !CLUE_PIECES.cs.includes(piece))),
  sv: characterClass(ALL_PIECES.filter((piece) => !CLUE_PIECES.sv.includes(piece))),
  hu: characterClass(ALL_PIECES.filter((piece) => !CLUE_PIECES.hu.includes(piece))),
  he: characterClass(ALL_PIECES.filter((piece) => !CLUE_PIECES.he.includes(piece))),
  fil: characterClass(ALL_PIECES.filter((piece) => !CLUE_PIECES.fil.includes(piece))),
  ms: characterClass(ALL_PIECES.filter((piece) => !CLUE_PIECES.ms.includes(piece))),
  ur: characterClass(ALL_PIECES.filter((piece) => !CLUE_PIECES.ur.includes(piece))),
  th: characterClass(ALL_PIECES.filter((piece) => !CLUE_PIECES.th.includes(piece))),
  ta: characterClass(ALL_PIECES.filter((piece) => !CLUE_PIECES.ta.includes(piece))),
  sw: characterClass(ALL_PIECES.filter((piece) => !CLUE_PIECES.sw.includes(piece))),
}

/**
 * Stress marks, soft hyphens and zero-width characters a model sometimes leaves in a word.
 * Only these: decomposing and dropping every combining mark would turn `й` into `и` and
 * Vietnamese tones into plain vowels.
 */
const STRIPPED = /[̀́­​-‍⁠﻿՛՜՞՟]/g

const GRAPHEME_SCRIPT: Record<'hi' | 'mr' | 'bn' | 'ta' | 'th', RegExp> = {
  hi: /[\u0900-\u097F]/,
  mr: /[\u0900-\u097F]/,
  bn: /[\u0980-\u09FF]/,
  ta: /[\u0B80-\u0BFF]/,
  th: /[\u0E00-\u0E7F]/,
}

/** Crossword traditions that print accents as the plain letter. `ñ`, `äöü` and `œ` opt out below. */
const ACCENT_FOLD = new Set<Locale>(['es', 'pt', 'fr', 'it', 'nl', 'id', 'ms', 'sw', 'fil', 'de'])

const ACCENT_TO_BASE: Record<string, string> = {
  à: 'a',
  á: 'a',
  â: 'a',
  ä: 'a',
  ã: 'a',
  å: 'a',
  è: 'e',
  é: 'e',
  ê: 'e',
  ë: 'e',
  ì: 'i',
  í: 'i',
  î: 'i',
  ï: 'i',
  ò: 'o',
  ó: 'o',
  ô: 'o',
  ö: 'o',
  õ: 'o',
  ù: 'u',
  ú: 'u',
  û: 'u',
  ü: 'u',
  ý: 'y',
  ÿ: 'y',
  ç: 'c',
  ñ: 'n',
  æ: 'ae',
}

const ACCENT_KEEP: Partial<Record<Locale, ReadonlySet<string>>> = {
  es: new Set(['ñ']),
  de: new Set(['ä', 'ö', 'ü']),
}

const GREEK_TONE: Record<string, string> = {
  ά: 'α',
  έ: 'ε',
  ή: 'η',
  ί: 'ι',
  ΐ: 'ι',
  ϊ: 'ι',
  ό: 'ο',
  ύ: 'υ',
  ΰ: 'υ',
  ϋ: 'υ',
  ώ: 'ω',
}

const ALEF: Record<string, string> = { أ: 'ا', إ: 'ا', آ: 'ا', ٱ: 'ا', ؤ: 'و', ئ: 'ي' }

const CHO = LETTERS('ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ')
const JUNG = LETTERS('ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ')
const JONG = LETTERS('ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ')

const JUNG_COMBO: Record<string, Record<string, string>> = {
  ㅗ: { ㅏ: 'ㅘ', ㅐ: 'ㅙ', ㅣ: 'ㅚ' },
  ㅜ: { ㅓ: 'ㅝ', ㅔ: 'ㅞ', ㅣ: 'ㅟ' },
  ㅡ: { ㅣ: 'ㅢ' },
}

const JONG_SPLIT: Record<string, readonly [string, string]> = {
  ㄳ: ['ㄱ', 'ㅅ'],
  ㄵ: ['ㄴ', 'ㅈ'],
  ㄶ: ['ㄴ', 'ㅎ'],
  ㄺ: ['ㄹ', 'ㄱ'],
  ㄻ: ['ㄹ', 'ㅁ'],
  ㄼ: ['ㄹ', 'ㅂ'],
  ㄽ: ['ㄹ', 'ㅅ'],
  ㄾ: ['ㄹ', 'ㅌ'],
  ㄿ: ['ㄹ', 'ㅍ'],
  ㅀ: ['ㄹ', 'ㅎ'],
  ㅄ: ['ㅂ', 'ㅅ'],
}

const isJamo = (token: string): boolean => CHO.includes(token) || JUNG.includes(token) || JONG.includes(token)

const hangul = (lead: number, vowel: number, tail: number): string =>
  String.fromCharCode(0xac00 + (lead * 21 + vowel) * 28 + tail)

const decomposeHangul = (token: string): { lead: number; vowel: number; tail: number } | null => {
  const code = token.codePointAt(0)
  if (code === undefined || code < 0xac00 || code > 0xd7a3 || [...token].length !== 1) return null
  const syllable = code - 0xac00
  return { lead: Math.floor(syllable / 588), vowel: Math.floor((syllable % 588) / 28), tail: syllable % 28 }
}

const mapChars = (word: string, table: Record<string, string>): string =>
  [...word].map((char) => table[char] ?? char).join('')

const foldWord = (word: string, locale: Locale): string => {
  if (locale === 'ru') word = word.replaceAll('ё', 'е')
  if (locale === 'uk') word = word.replace(/['’ʼ]/g, '')
  if (locale === 'el') word = mapChars(word, GREEK_TONE).replaceAll('ς', 'σ')
  if (locale === 'ro') word = word.replaceAll('ş', 'ș').replaceAll('ţ', 'ț')
  if (locale === 'ar' || locale === 'fa' || locale === 'ur') {
    word = mapChars(word.replace(/[\u064B-\u065F\u0670\u0640]/g, ''), ALEF)
    if (locale === 'fa') word = mapChars(word, { ي: 'ی', ك: 'ک', ى: 'ی', ة: 'ه' })
    if (locale === 'ur') word = mapChars(word, { ي: 'ی', ك: 'ک', ى: 'ی', ة: 'ہ', ه: 'ہ' })
  }
  if (locale === 'he') word = word.replace(/[\u0591-\u05C7\u05F3\u05F4]/g, '')
  if (locale === 'ja') {
    word = [...word]
      .map((char) => {
        const code = char.codePointAt(0)!
        return code >= 0x30a1 && code <= 0x30f6 ? String.fromCodePoint(code - 0x60) : char
      })
      .join('')
  }
  if (ACCENT_FOLD.has(locale)) {
    const keep = ACCENT_KEEP[locale]
    word = [...word].map((char) => (keep?.has(char) ? char : (ACCENT_TO_BASE[char] ?? char))).join('')
  }
  if (locale === 'de') word = word.replaceAll('ß', 'ss')
  if (GRAPHEME_LOCALES.has(locale)) word = word.replace(/[\u200C\u200D]/g, '')
  return word
}

const segmenters = new Map<string, Intl.Segmenter>()

const graphemesOf = (word: string, locale: Locale): string[] => {
  let segmenter = segmenters.get(locale)
  if (!segmenter) {
    segmenter = new Intl.Segmenter(locale, { granularity: 'grapheme' })
    segmenters.set(locale, segmenter)
  }
  return [...segmenter.segment(word)].map((part) => part.segment)
}

const isCell = (cell: string, locale: Locale): boolean => {
  if (TOKENS[locale].has(cell)) return true
  if (locale === 'zh') return /^\p{Script=Han}$/u.test(cell)
  if (locale === 'ko') return /^[\uAC00-\uD7A3]$/u.test(cell)
  if (GRAPHEME_LOCALES.has(locale)) {
    const script = GRAPHEME_SCRIPT[locale as 'hi' | 'mr' | 'bn' | 'ta' | 'th']
    const chars = [...cell]
    return chars.some((char) => /\p{L}/u.test(char)) && chars.every((char) => script.test(char))
  }
  return false
}

const lettersOnly = (word: string, locale: Locale): boolean => {
  if (locale === 'zh') return /^\p{Script=Han}+$/u.test(word)
  if (locale === 'ko') return /^[\uAC00-\uD7A3]+$/u.test(word)
  if (GRAPHEME_LOCALES.has(locale)) return /^[\p{L}\p{M}]+$/u.test(word)
  return /^[\p{L}]+$/u.test(word)
}

/** Splits a normalized word into cell tokens. Armenian `ու` and Dutch `ij` are one token each. */
export const toCells = (word: string, locale: Locale): string[] => {
  if (GRAPHEME_LOCALES.has(locale)) return graphemesOf(word, locale)
  const chars = [...word]
  if (locale !== 'hy' && locale !== 'nl') return chars
  const cells: string[] = []
  for (let i = 0; i < chars.length; i++) {
    const pair = locale === 'hy' ? chars[i] === 'ո' && chars[i + 1] === 'ւ' : chars[i] === 'i' && chars[i + 1] === 'j'
    if (pair) {
      cells.push(locale === 'hy' ? 'ու' : 'ij')
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
  let word = foldWord(raw.normalize('NFC').trim().replace(STRIPPED, '').toLocaleLowerCase(locale), locale)
  if (!word) return null

  if (locale === 'hy') {
    word = word.replaceAll('եւ', 'և')
    if (word.replaceAll('ու', '').includes('ւ')) return null
  }

  if (!lettersOnly(word, locale)) return null
  const cells = toCells(word, locale)
  return cells.length > 0 && cells.every((cell) => isCell(cell, locale)) ? word : null
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
  const token = foldWord(key.normalize('NFC').toLocaleLowerCase(locale), locale)
  if (locale === 'ko' && isJamo(token)) return token
  const cells = toCells(token, locale)
  return cells.length === 1 && isCell(cells[0]!, locale) ? cells[0]! : null
}

/**
 * A keystroke that completes the token in the previous cell instead of filling a new one:
 * Armenian `ո` then `ւ`, Dutch `i` then `j`, a vowel sign on a consonant, jamo building a syllable.
 */
export const mergeTyped = (previous: string, key: string, locale: Locale): string | null => {
  const typed = key.normalize('NFC').toLocaleLowerCase(locale)
  const joined = previous + typed
  if (joined !== previous && TOKENS[locale].has(joined)) return joined
  if (GRAPHEME_LOCALES.has(locale)) {
    const cells = toCells(joined, locale)
    if (cells.length === 1 && isCell(cells[0]!, locale)) return cells[0]!
  }
  if (locale !== 'ko') return null
  if ([...previous].length !== 1 || [...typed].length !== 1) return null

  const lead = CHO.indexOf(previous)
  const vowel = JUNG.indexOf(typed)
  if (lead >= 0 && vowel >= 0) return hangul(lead, vowel, 0)

  const parts = decomposeHangul(previous)
  if (!parts) return null
  const grown = parts.tail === 0 ? JUNG_COMBO[JUNG[parts.vowel]!]?.[typed] : undefined
  if (grown) return hangul(parts.lead, JUNG.indexOf(grown), 0)
  if (parts.tail === 0) {
    const tail = JONG.indexOf(typed)
    if (tail >= 0) return hangul(parts.lead, parts.vowel, tail + 1)
  }
  return null
}

/**
 * Korean `간` plus `ㅏ` is `가` in the same cell and `나` in the next. `null` when the two
 * keystrokes do not split that way.
 */
export const spillTyped = (previous: string, key: string, locale: Locale): { stay: string; next: string } | null => {
  if (locale !== 'ko') return null
  const parts = decomposeHangul(previous)
  const vowel = JUNG.indexOf(key.normalize('NFC'))
  if (!parts || parts.tail === 0 || vowel < 0) return null
  const tail = JONG[parts.tail - 1]!
  const split = JONG_SPLIT[tail]
  if (split) {
    const stayTail = JONG.indexOf(split[0])
    const nextLead = CHO.indexOf(split[1])
    if (stayTail < 0 || nextLead < 0) return null
    return { stay: hangul(parts.lead, parts.vowel, stayTail + 1), next: hangul(nextLead, vowel, 0) }
  }
  const nextLead = CHO.indexOf(tail)
  if (nextLead < 0) return null
  return { stay: hangul(parts.lead, parts.vowel, 0), next: hangul(nextLead, vowel, 0) }
}

/** Whether another keystroke may still change this cell (a matra, a virama, a following jamo). */
export const compositionOpen = (token: string, locale: Locale): boolean =>
  GRAPHEME_LOCALES.has(locale) || (locale === 'ko' && (isJamo(token) || decomposeHangul(token) !== null))
