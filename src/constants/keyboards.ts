import type { Locale } from './puzzle'

/**
 * The on-screen keyboard rows per language, in cell tokens (lowercase; keys print them through
 * `displayCell`). Each layout holds exactly the language's alphabet — `tests/unit/keyboards.spec.ts`
 * checks it against `ALPHABETS`.
 *
 * - English: QWERTY.
 * - Russian: ЙЦУКЕН without `ё`, which Russian crosswords write as `е`.
 * - Armenian: the phonetic layout most keyboards in Armenia use (hangman's order), with `և`
 *   where the `7` key types it and `ու` as one key, since it is one letter in one cell.
 */
export const KEYBOARD_ROWS: Record<Locale, string[][]> = {
  en: [[...'qwertyuiop'], [...'asdfghjkl'], [...'zxcvbnm']],
  ru: [[...'йцукенгшщзхъ'], [...'фывапролджэ'], [...'ячсмитьбю']],
  hy: [
    ['է', 'թ', 'փ', 'ձ', 'ջ', 'և', 'ր', 'չ', 'ճ', 'ժ'],
    ['ք', 'ո', 'ե', 'ռ', 'տ', 'ը', 'ու', 'ի', 'օ', 'պ'],
    ['ա', 'ս', 'դ', 'ֆ', 'գ', 'հ', 'յ', 'կ', 'լ', 'խ'],
    ['զ', 'ղ', 'ց', 'վ', 'բ', 'ն', 'մ', 'շ', 'ծ'],
  ],
}

/**
 * Physical keys by position (`KeyboardEvent.code`), for a player whose OS keyboard is still on
 * English: pressing the key where the letter sits on that language's layout types the letter,
 * so nobody has to switch layouts to play. Only used when the typed character itself is not a
 * letter of the puzzle's language.
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
}
