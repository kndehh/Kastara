import {expect,it,vi} from 'vitest'
import {loadCatalogStatus} from '@/services/catalog'
it('reports unconfigured honestly and performs no network request',async()=>{const spy=vi.spyOn(globalThis,'fetch');expect(await loadCatalogStatus()).toEqual({status:'unconfigured',reason:'backend-unconfigured'});expect(spy).not.toHaveBeenCalled();spy.mockRestore()})
