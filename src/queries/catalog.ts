import {queryOptions} from '@tanstack/react-query'
import {loadCatalogStatus} from '@/services/catalog'
export const catalogStatusOptions=queryOptions({queryKey:['catalog','configuration'],queryFn:loadCatalogStatus})
