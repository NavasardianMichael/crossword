import { goraKorsord } from './gora-korsord'
import { korsordForBarn } from './korsord-for-barn'
import { losaKorsordTips } from './losa-korsord-tips'
import { svenskaKorsord } from './svenska-korsord'
import { svensktKorsord } from './svenskt-korsord'
import type { Guide } from '../../types'

/** Guides in this language, in the order the hub lists them. */
export const guides: readonly Guide[] = [goraKorsord, losaKorsordTips, svensktKorsord, korsordForBarn, svenskaKorsord]
