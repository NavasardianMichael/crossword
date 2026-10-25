import { EN_CONTENT } from './en.js'
import { HY_CONTENT } from './hy.js'
import { RU_CONTENT } from './ru.js'
import type { LocaleContent } from './types.js'
import type { Locale } from '../puzzle.js'

/** Native prompt material per language — see `types.ts`. */
export const LOCALE_CONTENT: Record<Locale, LocaleContent> = { en: EN_CONTENT, ru: RU_CONTENT, hy: HY_CONTENT }
