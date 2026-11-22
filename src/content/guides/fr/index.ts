import { commentResoudreMotsCroises } from './comment-resoudre-mots-croises'
import { creerDesMotsCroises } from './creer-des-mots-croises'
import { motsCroisesEnFrancais } from './mots-croises-en-francais'
import { motsCroisesPourEnfants } from './mots-croises-pour-enfants'
import { motsFleches } from './mots-fleches'
import type { Guide } from '../../types'

/** Guides in this language, in the order the hub lists them. */
export const guides: readonly Guide[] = [creerDesMotsCroises, commentResoudreMotsCroises, motsFleches, motsCroisesPourEnfants, motsCroisesEnFrancais]
