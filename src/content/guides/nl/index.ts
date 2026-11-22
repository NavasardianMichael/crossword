import { kruiswoordpuzzelMaken } from './kruiswoordpuzzel-maken'
import { kruiswoordpuzzelOplossenTips } from './kruiswoordpuzzel-oplossen-tips'
import { kruiswoordpuzzelVoorKinderen } from './kruiswoordpuzzel-voor-kinderen'
import { nederlandseKruiswoordpuzzel } from './nederlandse-kruiswoordpuzzel'
import { zweedsePuzzel } from './zweedse-puzzel'
import type { Guide } from '../../types'

/** Guides in this language, in the order the hub lists them. */
export const guides: readonly Guide[] = [
  kruiswoordpuzzelMaken,
  kruiswoordpuzzelOplossenTips,
  zweedsePuzzel,
  kruiswoordpuzzelVoorKinderen,
  nederlandseKruiswoordpuzzel,
]
