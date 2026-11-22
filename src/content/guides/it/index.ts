import { comeRisolvereCruciverba } from './come-risolvere-cruciverba'
import { creareCruciverba } from './creare-cruciverba'
import { cruciverbaInItaliano } from './cruciverba-in-italiano'
import { cruciverbaPerBambini } from './cruciverba-per-bambini'
import { schemaSvedese } from './schema-svedese'
import type { Guide } from '../../types'

/** Guides in this language, in the order the hub lists them. */
export const guides: readonly Guide[] = [creareCruciverba, comeRisolvereCruciverba, schemaSvedese, cruciverbaPerBambini, cruciverbaInItaliano]
