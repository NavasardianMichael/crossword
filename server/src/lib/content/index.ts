import { AR_CONTENT } from './ar.js'
import { BN_CONTENT } from './bn.js'
import { CS_CONTENT } from './cs.js'
import { DE_CONTENT } from './de.js'
import { EL_CONTENT } from './el.js'
import { EN_CONTENT } from './en.js'
import { ES_CONTENT } from './es.js'
import { FA_CONTENT } from './fa.js'
import { FIL_CONTENT } from './fil.js'
import { FR_CONTENT } from './fr.js'
import { HE_CONTENT } from './he.js'
import { HI_CONTENT } from './hi.js'
import { HU_CONTENT } from './hu.js'
import { HY_CONTENT } from './hy.js'
import { ID_CONTENT } from './id.js'
import { IT_CONTENT } from './it.js'
import { JA_CONTENT } from './ja.js'
import { KO_CONTENT } from './ko.js'
import { MR_CONTENT } from './mr.js'
import { MS_CONTENT } from './ms.js'
import { NL_CONTENT } from './nl.js'
import { PL_CONTENT } from './pl.js'
import { PT_CONTENT } from './pt.js'
import { RO_CONTENT } from './ro.js'
import { RU_CONTENT } from './ru.js'
import { SV_CONTENT } from './sv.js'
import { SW_CONTENT } from './sw.js'
import { TA_CONTENT } from './ta.js'
import { TH_CONTENT } from './th.js'
import type { LocaleContent } from './types.js'
import { UK_CONTENT } from './uk.js'
import { UR_CONTENT } from './ur.js'
import { VI_CONTENT } from './vi.js'
import { ZH_CONTENT } from './zh.js'
import type { Locale } from '../puzzle.js'

/** Native prompt material per language — see `types.ts`. */
export const LOCALE_CONTENT: Record<Locale, LocaleContent> = {
  en: EN_CONTENT,
  ru: RU_CONTENT,
  hy: HY_CONTENT,
  es: ES_CONTENT,
  pt: PT_CONTENT,
  fr: FR_CONTENT,
  de: DE_CONTENT,
  id: ID_CONTENT,
  mr: MR_CONTENT,
  it: IT_CONTENT,
  pl: PL_CONTENT,
  vi: VI_CONTENT,
  uk: UK_CONTENT,
  ar: AR_CONTENT,
  hi: HI_CONTENT,
  ko: KO_CONTENT,
  bn: BN_CONTENT,
  ja: JA_CONTENT,
  zh: ZH_CONTENT,
  fa: FA_CONTENT,
  nl: NL_CONTENT,
  ro: RO_CONTENT,
  el: EL_CONTENT,
  cs: CS_CONTENT,
  sv: SV_CONTENT,
  hu: HU_CONTENT,
  he: HE_CONTENT,
  fil: FIL_CONTENT,
  ms: MS_CONTENT,
  ur: UR_CONTENT,
  th: TH_CONTENT,
  ta: TA_CONTENT,
  sw: SW_CONTENT,
}
