import { comoResolverPalavrasCruzadas } from './como-resolver-palavras-cruzadas'
import { criarPalavrasCruzadas } from './criar-palavras-cruzadas'
import { palavrasCruzadasDiretas } from './palavras-cruzadas-diretas'
import { palavrasCruzadasEmPortugues } from './palavras-cruzadas-em-portugues'
import { palavrasCruzadasParaCriancas } from './palavras-cruzadas-para-criancas'
import type { Guide } from '../../types'

/** Guides in this language, in the order the hub lists them. */
export const guides: readonly Guide[] = [
  criarPalavrasCruzadas,
  comoResolverPalavrasCruzadas,
  palavrasCruzadasDiretas,
  palavrasCruzadasParaCriancas,
  palavrasCruzadasEmPortugues,
]
