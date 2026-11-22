import { kodomoMukeKurosuwaado } from './kodomo-muke-kurosuwaado'
import { kurosuwaadoNoTokikata } from './kurosuwaado-no-tokikata'
import { kurosuwaadoNoTsukurikata } from './kurosuwaado-no-tsukurikata'
import { nihongoKurosuwaado } from './nihongo-kurosuwaado'
import { yajirushiKurosuwaado } from './yajirushi-kurosuwaado'
import type { Guide } from '../../types'

/** Guides in this language, in the order the hub lists them. */
export const guides: readonly Guide[] = [
  kurosuwaadoNoTsukurikata,
  kurosuwaadoNoTokikata,
  yajirushiKurosuwaado,
  kodomoMukeKurosuwaado,
  nihongoKurosuwaado,
]
