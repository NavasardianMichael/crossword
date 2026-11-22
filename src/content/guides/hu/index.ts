import { keresztrejtvenyFejtesTippek } from './keresztrejtveny-fejtes-tippek'
import { keresztrejtvenyGyerekeknek } from './keresztrejtveny-gyerekeknek'
import { keresztrejtvenyKeszites } from './keresztrejtveny-keszites'
import { magyarKeresztrejtveny } from './magyar-keresztrejtveny'
import { skandinavRejtveny } from './skandinav-rejtveny'
import type { Guide } from '../../types'

/** Guides in this language, in the order the hub lists them. */
export const guides: readonly Guide[] = [
  keresztrejtvenyKeszites,
  keresztrejtvenyFejtesTippek,
  skandinavRejtveny,
  keresztrejtvenyGyerekeknek,
  magyarKeresztrejtveny,
]
