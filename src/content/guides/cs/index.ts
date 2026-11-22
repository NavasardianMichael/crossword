import { ceskeKrizovky } from './ceske-krizovky'
import { jakLustitKrizovky } from './jak-lustit-krizovky'
import { jakVytvoritKrizovku } from './jak-vytvorit-krizovku'
import { krizovkyProDeti } from './krizovky-pro-deti'
import { skandinavka } from './skandinavka'
import type { Guide } from '../../types'

/** Guides in this language, in the order the hub lists them. */
export const guides: readonly Guide[] = [jakVytvoritKrizovku, jakLustitKrizovky, skandinavka, krizovkyProDeti, ceskeKrizovky]
