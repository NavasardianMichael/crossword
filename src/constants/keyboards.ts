import { ALPHABETS, COMBINERS } from './alphabet'
import type { Locale } from './puzzle'

/**
 * The on-screen keyboard rows per language, in cell tokens (lowercase; keys print them through
 * `displayCell`). A closed alphabet's keys are exactly its letters; vowel signs and Thai tone
 * marks sit on an extra row and complete the previous cell. Chinese and Korean are open
 * scripts: the keys are a starter set, and an IME field accepts the rest.
 *
 * - English, and the other plain Latin languages: QWERTY.
 * - Russian: ЙЦУКЕН without `ё`, which Russian crosswords write as `е`.
 * - Armenian: the phonetic layout, with `և` and `ու` each one key.
 */
const chars = (text: string): string[] => [...text]

const chunk = (letters: readonly string[], size: number): string[][] => {
  const rows: string[][] = []
  for (let index = 0; index < letters.length; index += size) rows.push([...letters.slice(index, index + size)])
  return rows
}

/** QWERTY, then the letters that are not plain a–z (Polish `ł`, German `ä`, Dutch `ij`). */
const qwerty = (extra: readonly string[] = []): string[][] => {
  const rows = [chars('qwertyuiop'), chars('asdfghjkl'), chars('zxcvbnm')]
  if (extra.length) rows.push([...extra])
  return rows
}

const grapheme = (locale: 'hi' | 'mr' | 'bn' | 'ta' | 'th'): string[][] => [
  ...chunk(ALPHABETS[locale], 10),
  [...(COMBINERS[locale] ?? [])],
]

export const KEYBOARD_ROWS: Record<Locale, string[][]> = {
  en: qwerty(),
  ru: [chars('йцукенгшщзхъ'), chars('фывапролджэ'), chars('ячсмитьбю')],
  hy: [
    ['է', 'թ', 'փ', 'ձ', 'ջ', 'և', 'ր', 'չ', 'ճ', 'ժ'],
    ['ք', 'ո', 'ե', 'ռ', 'տ', 'ը', 'ու', 'ի', 'օ', 'պ'],
    ['ա', 'ս', 'դ', 'ֆ', 'գ', 'հ', 'յ', 'կ', 'լ', 'խ'],
    ['զ', 'ղ', 'ց', 'վ', 'բ', 'ն', 'մ', 'շ', 'ծ'],
  ],
  es: [chars('qwertyuiop'), chars('asdfghjklñ'), chars('zxcvbnm')],
  pt: qwerty(),
  fr: [chars('azertyuiop'), chars('qsdfghjklm'), [...chars('wxcvbn'), 'œ']],
  de: [chars('qwertzuiopü'), chars('asdfghjklöä'), chars('yxcvbnm')],
  id: qwerty(),
  mr: grapheme('mr'),
  it: qwerty(),
  pl: qwerty([...'ąćęłńóśźż']),
  vi: chunk(ALPHABETS.vi, 10),
  uk: [chars('йцукенгшщзхї'), chars('фівапролджє'), chars('ґячсмитьбю')],
  ar: chunk(ALPHABETS.ar, 11),
  hi: grapheme('hi'),
  ko: [chars('ㅂㅈㄷㄱㅅㅛㅕㅑㅐㅔ'), chars('ㅁㄴㅇㄹㅎㅗㅓㅏㅣ'), chars('ㅋㅌㅊㅍㅠㅜㅡ'), chars('ㄲㄸㅃㅆㅉㅘㅙㅚㅝㅞㅟㅢ')],
  bn: grapheme('bn'),
  ja: [
    chars('あいうえお'),
    chars('かきくけこ'),
    chars('さしすせそ'),
    chars('たちつてと'),
    chars('なにぬねの'),
    chars('はひふへほ'),
    chars('まみむめも'),
    chars('やゆよ'),
    chars('らりるれろ'),
    chars('わをん'),
    chars('がぎぐげご'),
    chars('ざじずぜぞ'),
    chars('だぢづでど'),
    chars('ばびぶべぼ'),
    chars('ぱぴぷぺぽ'),
    chars('ぁぃぅぇぉゃゅょっ'),
    ['ー'],
  ],
  zh: chunk(chars('人中大小天水火木土日月山川海风雨花鸟鱼虫金银红白黑东西南北春夏秋冬'), 10),
  fa: chunk(ALPHABETS.fa, 11),
  nl: qwerty(['ij']),
  ro: qwerty([...'ăâîșț']),
  el: [chars('ερτυθιοπ'), chars('ασδφγηξκλ'), chars('ζχψωβνμ')],
  cs: qwerty([...'áčďéěíňóřšťúůýž']),
  sv: qwerty([...'åäö']),
  hu: qwerty([...'áéíóöőúüű']),
  he: [chars('קראטוןםפ'), chars('שדגכעיחלךף'), chars('זסבהנמצתץ')],
  fil: qwerty(),
  ms: qwerty(),
  ur: chunk(ALPHABETS.ur, 10),
  th: grapheme('th'),
  ta: grapheme('ta'),
  sw: qwerty(),
}

const CODE_ROWS = [
  ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash'],
  ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote'],
  ['KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash'],
]

/** English-layout key positions follow the first three on-screen rows, left to right. */
const positional = (rows: readonly (readonly string[])[]): Record<string, string> => {
  const map: Record<string, string> = {}
  rows.slice(0, 3).forEach((row, index) => {
    row.forEach((letter, key) => {
      const code = CODE_ROWS[index]?.[key]
      if (code) map[code] = letter
    })
  })
  return map
}

/**
 * Physical keys by position (`KeyboardEvent.code`), for a player whose OS keyboard is still on
 * English. Only used when the typed character itself is not a letter of the puzzle's language.
 * Chinese, Japanese and Korean stay off this map so a desktop IME can compose.
 */
export const KEY_CODE_LETTERS: Partial<Record<Locale, Record<string, string>>> = {
  ru: {
    KeyQ: 'й',
    KeyW: 'ц',
    KeyE: 'у',
    KeyR: 'к',
    KeyT: 'е',
    KeyY: 'н',
    KeyU: 'г',
    KeyI: 'ш',
    KeyO: 'щ',
    KeyP: 'з',
    BracketLeft: 'х',
    BracketRight: 'ъ',
    KeyA: 'ф',
    KeyS: 'ы',
    KeyD: 'в',
    KeyF: 'а',
    KeyG: 'п',
    KeyH: 'р',
    KeyJ: 'о',
    KeyK: 'л',
    KeyL: 'д',
    Semicolon: 'ж',
    Quote: 'э',
    KeyZ: 'я',
    KeyX: 'ч',
    KeyC: 'с',
    KeyV: 'м',
    KeyB: 'и',
    KeyN: 'т',
    KeyM: 'ь',
    Comma: 'б',
    Period: 'ю',
    Backquote: 'е',
  },
  hy: {
    Digit1: 'է',
    Digit2: 'թ',
    Digit3: 'փ',
    Digit4: 'ձ',
    Digit5: 'ջ',
    Digit6: 'ւ',
    Digit7: 'և',
    Digit8: 'ր',
    Digit9: 'չ',
    Digit0: 'ճ',
    Equal: 'ժ',
    KeyQ: 'ք',
    KeyW: 'ո',
    KeyE: 'ե',
    KeyR: 'ռ',
    KeyT: 'տ',
    KeyY: 'ը',
    KeyU: 'ւ',
    KeyI: 'ի',
    KeyO: 'օ',
    KeyP: 'պ',
    BracketLeft: 'խ',
    BracketRight: 'ծ',
    Backslash: 'շ',
    KeyA: 'ա',
    KeyS: 'ս',
    KeyD: 'դ',
    KeyF: 'ֆ',
    KeyG: 'գ',
    KeyH: 'հ',
    KeyJ: 'յ',
    KeyK: 'կ',
    KeyL: 'լ',
    KeyZ: 'զ',
    KeyX: 'ղ',
    KeyC: 'ց',
    KeyV: 'վ',
    KeyB: 'բ',
    KeyN: 'ն',
    KeyM: 'մ',
  },
  uk: positional(KEYBOARD_ROWS.uk),
  el: positional(KEYBOARD_ROWS.el),
  ar: positional(KEYBOARD_ROWS.ar),
  fa: positional(KEYBOARD_ROWS.fa),
  ur: positional(KEYBOARD_ROWS.ur),
  he: positional(KEYBOARD_ROWS.he),
  hi: positional(KEYBOARD_ROWS.hi),
  mr: positional(KEYBOARD_ROWS.mr),
  bn: positional(KEYBOARD_ROWS.bn),
  ta: positional(KEYBOARD_ROWS.ta),
  th: positional(KEYBOARD_ROWS.th),
}
