import { kreuzwortraetselAufDeutsch } from './kreuzwortraetsel-auf-deutsch'
import { kreuzwortraetselErstellen } from './kreuzwortraetsel-erstellen'
import { kreuzwortraetselFuerSchueler } from './kreuzwortraetsel-fuer-schueler'
import { kreuzwortraetselLoesenTipps } from './kreuzwortraetsel-loesen-tipps'
import { schwedenraetsel } from './schwedenraetsel'
import type { Guide } from '../../types'

/** Guides in this language, in the order the hub lists them. */
export const guides: readonly Guide[] = [
  kreuzwortraetselErstellen,
  kreuzwortraetselLoesenTipps,
  schwedenraetsel,
  kreuzwortraetselFuerSchueler,
  kreuzwortraetselAufDeutsch,
]
