export type ServiceState = {status:'unconfigured';reason:'backend-unconfigured'}
// No network adapter exists yet. Never turn missing configuration into live zeroes.
export async function loadCatalogStatus():Promise<ServiceState> { return {status:'unconfigured',reason:'backend-unconfigured'} }
