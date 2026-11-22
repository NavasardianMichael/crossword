import { krosvordyDlyaShkolyariv } from './krosvordy-dlya-shkolyariv'
import { krosvordyUkrayinskoyu } from './krosvordy-ukrayinskoyu'
import { shchoTakeSkanvord } from './shcho-take-skanvord'
import { sklastyKrosvordOnlajn } from './sklasty-krosvord-onlajn'
import { yakRozghaduvatyKrosvordy } from './yak-rozghaduvaty-krosvordy'
import type { Guide } from '../../types'

/** Guides in this language, in the order the hub lists them. */
export const guides: readonly Guide[] = [
  sklastyKrosvordOnlajn,
  yakRozghaduvatyKrosvordy,
  shchoTakeSkanvord,
  krosvordyDlyaShkolyariv,
  krosvordyUkrayinskoyu,
]
