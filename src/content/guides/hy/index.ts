import { hayerenKhachbar } from './hayeren-khachbar'
import { inchpesLucelKhachbar } from './inchpes-lucel-khachbar'
import { khachbarDprocakanneriHamar } from './khachbar-dprocakanneri-hamar'
import { khachbarKazmel } from './khachbar-kazmel'
import { skanvord } from './skanvord'
import type { Guide } from '../../types'

/** Guides in this language, in the order the hub lists them. */
export const guides: readonly Guide[] = [khachbarKazmel, inchpesLucelKhachbar, skanvord, khachbarDprocakanneriHamar, hayerenKhachbar]
