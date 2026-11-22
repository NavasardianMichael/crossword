import { autodefinidos } from './autodefinidos'
import { comoResolverCrucigramas } from './como-resolver-crucigramas'
import { crearCrucigrama } from './crear-crucigrama'
import { crucigramasEnEspanol } from './crucigramas-en-espanol'
import { crucigramasParaNinos } from './crucigramas-para-ninos'
import type { Guide } from '../../types'

/** Guides in this language, in the order the hub lists them. */
export const guides: readonly Guide[] = [crearCrucigrama, comoResolverCrucigramas, autodefinidos, crucigramasParaNinos, crucigramasEnEspanol]
