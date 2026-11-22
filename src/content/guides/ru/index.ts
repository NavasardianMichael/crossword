import { armyanskijKrossvord } from './armyanskij-krossvord'
import { chtoTakoeSkanvord } from './chto-takoe-skanvord'
import { kakRazgadyvatKrossvordy } from './kak-razgadyvat-krossvordy'
import { krossvordNaRusskom } from './krossvord-na-russkom'
import { krossvordyDlyaShkolnikov } from './krossvordy-dlya-shkolnikov'
import { sostavitKrossvordOnlajn } from './sostavit-krossvord-onlajn'
import type { Guide } from '../../types'

/** Russian guides, in the order the hub lists them. */
export const guides: readonly Guide[] = [
  sostavitKrossvordOnlajn,
  kakRazgadyvatKrossvordy,
  chtoTakoeSkanvord,
  krossvordyDlyaShkolnikov,
  krossvordNaRusskom,
  armyanskijKrossvord,
]
