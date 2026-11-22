import { jakRozwiazywacKrzyzowki } from './jak-rozwiazywac-krzyzowki'
import { jakZrobicKrzyzowke } from './jak-zrobic-krzyzowke'
import { krzyzowkaPanoramiczna } from './krzyzowka-panoramiczna'
import { krzyzowkiDlaDzieci } from './krzyzowki-dla-dzieci'
import { krzyzowkiPoPolsku } from './krzyzowki-po-polsku'
import type { Guide } from '../../types'

/** Guides in this language, in the order the hub lists them. */
export const guides: readonly Guide[] = [
  jakZrobicKrzyzowke,
  jakRozwiazywacKrzyzowki,
  krzyzowkaPanoramiczna,
  krzyzowkiDlaDzieci,
  krzyzowkiPoPolsku,
]
